from enums import *
import geopandas as gpd
import numpy as np
import os
import pandas as pd
import sys
import thread_with_return as thr

BOX_AND_WHISKER_COLS = ["STATE", "DISTRICT", "RACE", "MIN", "Q1", "MED", "Q3", "MAX"]
NUM_OF_CORE = 96


def process_file(dir, file):
    buckets = {}
    plan = gpd.read_file(f"{dir}/{file}")
    for race in Race:
        buckets[race] = {}
        plan[f"{race_to_key(race)}_PERCENT"] = (plan[race_to_population_key(race).value] / plan[PopulationKey.TOTAL.value]) * 100
        plan[f"{race_to_key(race)}_PERCENT"] = plan[f"{race_to_key(race)}_PERCENT"].fillna(0)
        sorted_plan = plan.sort_values(f"{race_to_key(race)}_PERCENT")
        sorted_plan.reset_index(drop=True, inplace=True)
        for i, district in sorted_plan.iterrows():
            buckets[race][i] = district[f"{race_to_key(race)}_PERCENT"]
    return buckets


def get_population_buckets(state):
    buckets = {}
    for race in Race:
        buckets[race] = {}
    dir = f"ensemble/{state.value}/{EnsembleSize.LARGE.value}"
    threads = []
    for file in os.listdir(dir):
        while len(threads) >= (NUM_OF_CORE - 1):
            for thread in threads:
                res = thread.minute_join()
                if res is not None:
                    for race, districts in res.items():
                        for district, population in districts.items():
                            if district not in buckets[race]:
                                buckets[race][district] = []
                            buckets[race][district].append(population)
            threads = [thread for thread in threads if not thread.is_collected()]
        thread = thr.ThreadWithReturn(target=process_file, args=(dir, file))
        thread.start()
        threads.append(thread)
    for thread in threads:
        res = thread.join()
        for race, districts in res.items():
            for district, population in districts.items():
                if district not in buckets[race]:
                    buckets[race][district] = []
                buckets[race][district].append(population)
    return buckets


def process_state(state):
    buckets = get_population_buckets(state)
    box_and_whiskers = []
    for race in Race:
        box_and_whisker = pd.DataFrame(columns=BOX_AND_WHISKER_COLS)
        data = buckets[race]
        for district, populations in data.items():
            minimum = min(populations)
            q1 = np.percentile(populations, 25)
            median = np.percentile(populations, 50)
            q3 = np.percentile(populations, 75)
            maximum = max(populations)
            box_and_whisker = pd.concat([box_and_whisker, pd.DataFrame([[state.value, district,
                                                                         race.value, minimum, q1,
                                                                         median, q3, maximum]], columns=BOX_AND_WHISKER_COLS)])
        box_and_whisker.reset_index(drop=True, inplace=True)
        box_and_whiskers.append(box_and_whisker)
    box_and_whisker = pd.concat([*box_and_whiskers])
    box_and_whisker.reset_index(drop=True, inplace=True)
    box_and_whisker.to_json(f"charts/{state.value}_BOX_WHISKER.json")


if __name__ == "__main__":
    os.makedirs("charts", exist_ok=True)
    if len(sys.argv) != 2:
        process_state(State.MISSISSIPPI)
        process_state(State.NEWYORK)
    else:
        if sys.argv[1] not in [State.MISSISSIPPI.value, State.NEWYORK.value]:
            print("Usage: python3 box_and_whisker.py <STATE: MS/NY>")
        else:
            process_state(State(sys.argv[1]))
