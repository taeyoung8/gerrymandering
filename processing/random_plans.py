from enums import *
import functools
import gerrychain
from gerrychain.accept import *
from gerrychain.constraints import *
from gerrychain.proposals import *
from gerrychain.tree import *
from gerrychain.updaters import *
import geopandas as gpd
import math
import os
import pandas as pd
import random
import sys
import thread_with_return as thr
import time

NUM_OF_CORES = 96
NUM_OF_PLANS_PER_CALL = 50

def geometry_tally(partition):
    districts_geometry = {}
    for district in partition.parts:
        district_geometries = [partition.graph.nodes[node]["geometry"] for node in partition.parts[district]]
        districts_geometry[district] = gpd.GeoSeries(district_geometries).unary_union
    return districts_geometry


def calc_population_threshold(ideal_population, state):
    districts = gpd.read_file(f"shapes/{state.value}_DISTRICTS_FINAL.geojson")
    max_percentage_difference = 0
    for i, district in districts.iterrows():
        v1 = district[PopulationKey.TOTAL.value]
        v2 = ideal_population
        percentage_difference = (abs(v1 - v2)) / ((v1 + v2) / 2)
        if percentage_difference > max_percentage_difference:
            max_percentage_difference = percentage_difference
    return max_percentage_difference


def get_some_district_plans(state, initial_partition, ideal_population, population_threshold, crs):
    while True:
        try:
            proposal = functools.partial(recom,
                                        pop_col=PopulationKey.TOTAL.value,
                                        pop_target=ideal_population,
                                        epsilon=population_threshold,
                                        method = partial(
                                            bipartition_tree,
                                            max_attempts=100,
                                            allow_pair_reselection=True))
            chain = gerrychain.MarkovChain(proposal=proposal,
                                        constraints=[],
                                        accept=always_accept,
                                        initial_state=initial_partition,
                                        total_steps=NUM_OF_PLANS_PER_CALL)
            plans = []
            for partition in chain:
                # Get plan as dataframe
                cols = ["DISTRICT", "STATE",
                        PopulationKey.TOTAL.value, PopulationKey.WHITE.value,
                        PopulationKey.BLACK.value, PopulationKey.HISPANIC.value,
                        PopulationKey.ASIAN.value, ElectionKey.DEMOCRATIC2020.value,
                        ElectionKey.REPUBLICAN2020.value, ElectionKey.TOTAL2020.value,
                        ElectionKey.WINNER2020.value, "geometry"]
                new_district_plan = gpd.GeoDataFrame(columns=cols)
                for district in partition.parts:
                    new_district_plan = pd.concat([new_district_plan, pd.DataFrame([[district, state.value,
                                                            partition["population"][district], partition["white_pop"][district],
                                                            partition["black_pop"][district], partition["hisp_pop"][district],
                                                            partition["asian_pop"][district], partition["2020_dem"][district],
                                                            partition["2020_rep"][district], partition["2020_total"][district],
                                                            "Democratic" if partition["2020_dem"][district] > partition["2020_rep"][district] else "Republican",
                                                            partition["geometry"][district]]],
                                                            columns=cols)])
                new_district_plan.set_crs(crs, inplace=True)
                new_district_plan.sort_values("DISTRICT", inplace=True)
                new_district_plan.reset_index(drop=True, inplace=True)
                # Check if new plan exists already
                found = False
                for plan in plans:
                    if plan.equals(new_district_plan):
                        found = True
                        break
                if not found:
                    plans.append(new_district_plan)
            return plans
        except Exception as e:
            print(e)
            continue


def generate_ensemble(state, size, precincts):
    random.seed(time.time())
    # Fix precincts crs
    precincts = precincts.to_crs(precincts.estimate_utm_crs())
    # Create graph
    graph = gerrychain.Graph.from_geodataframe(precincts, ignore_errors=True)
    initial_partition = gerrychain.GeographicPartition(graph,
                                                       assignment="DISTRICT",
                                                       updaters={
                                                            "population": Tally(PopulationKey.TOTAL.value, alias="population"),
                                                            "cut_edges": cut_edges,
                                                            "perimeter": perimeter,
                                                            "white_pop": Tally(PopulationKey.WHITE.value, alias="white_pop"),
                                                            "black_pop": Tally(PopulationKey.BLACK.value, alias="black_pop"),
                                                            "hisp_pop": Tally(PopulationKey.HISPANIC.value, alias="hisp_pop"),
                                                            "asian_pop": Tally(PopulationKey.ASIAN.value, alias="asian_pop"),
                                                            "2020_rep": Tally(ElectionKey.REPUBLICAN2020.value, alias="2020_rep"),
                                                            "2020_dem": Tally(ElectionKey.DEMOCRATIC2020.value, alias="2020_dem"),
                                                            "2020_total": Tally(ElectionKey.TOTAL2020.value, alias="2020_total"),
                                                            "geometry": geometry_tally
                                                       })
    # Calculate ideal population and population threshold
    ideal_population = sum(precincts[PopulationKey.TOTAL.value].values) / precincts.shape[0]
    #population_threshold = calc_population_threshold(ideal_population, state)
    population_threshold = 0.08
    # Generate plans
    unique_plans = []
    running_threads = []
    maximum_number_of_threads = math.ceil(size.value / NUM_OF_PLANS_PER_CALL)
    number_of_threads_started = 0
    i = 1
    while len(unique_plans) < size.value:
        if number_of_threads_started == maximum_number_of_threads and len(running_threads) == 0:
            # Allow more threads to be started
            maximum_number_of_threads += 1
        elif number_of_threads_started == maximum_number_of_threads or len(running_threads) == (NUM_OF_CORES - 1):
            # Wait for threads to finish
            for thread in running_threads:
                res = thread.minute_join()
                if res is not None:
                    for plan in res:
                        found = False
                        for unique_plan in unique_plans:
                            if plan.equals(unique_plan):
                                found = True
                                break
                        if not found:
                            unique_plans.append(plan)
                            with open(f"ensemble/{state.value}/{size.value}/{state.value}_DISTRICT_PLAN_{i}.geojson", "w") as f:
                                f.write(plan.to_json(drop_id=True, to_wgs84=True))
                            i += 1
            running_threads = [thread for thread in running_threads if not thread.is_collected()]
        elif number_of_threads_started < maximum_number_of_threads:
            # Start new thread
            thread = thr.ThreadWithReturn(target=get_some_district_plans,
                                          args=(state, initial_partition, ideal_population, population_threshold, precincts.crs))
            thread.start()
            running_threads.append(thread)
            number_of_threads_started += 1
    # Generate ensemble info
    return [state.value, size.name, len(unique_plans), ideal_population, population_threshold]        


def mggg(state):
    # Create directories
    for size in EnsembleSize:
        os.makedirs(f"ensemble/{state.value}/{size.value}", exist_ok=True)
    # Read precincts
    precincts = gpd.read_file(f"shapes/{state.value}_PRECINCTS_FINAL.geojson")
    # Get ensembles
    print(f"[{state.value}] Generating small ensemble...")
    small = generate_ensemble(state, EnsembleSize.SMALL, precincts)
    print(f"[{state.value}] Small ensemble size: {len(small)}")
    print(f"[{state.value}] Generating large ensemble...")
    large = generate_ensemble(state, EnsembleSize.LARGE, precincts)
    print(f"[{state.value}] Large ensemble size: {len(large)}")
    # Get ensemble info
    ensemble_info = pd.DataFrame(small + large, columns=["STATE", "SIZE", "NUMBER_OF_PLANS", "IDEAL_POPULATION", "POPULATION_THRESHOLD"])
    ensemble_info.to_json(f"ensemble/{state.value}/{state.value}_ENSEMBLE_INFO.json")
    print(ensemble_info)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        mggg(State.MISSISSIPPI)
        mggg(State.NEWYORK)
    else:
        if sys.argv[1] not in [State.MISSISSIPPI.value, State.NEWYORK.value]:
            print("Usage: python3 random_plans.py <STATE: MS/NY>")
        else:
            mggg(State(sys.argv[1]))
