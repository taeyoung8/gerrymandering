from enums import *
import geopandas as gpd
import numpy as np
import os
import pandas as pd
import sys
import thread_with_return as thr

OPPORTUNITY_COLS = ["STATE", "ENSEMBLE", "PLAN", "RACE", "LOW_COUNT", "MEDIUM_COUNT", "HIGH_COUNT"]
NUM_OF_CORES = 96


def process_file(dir, file, state, i, ensemble):
    plan = gpd.read_file(f"{dir}/{file}")
    opportunity_districts = {}
    for race in Race:
        plan[f"{race_to_key(race)}_PERCENT"] = (plan[race_to_population_key(race).value] / plan[PopulationKey.TOTAL.value])
        plan[f"{race_to_key(race)}_PERCENT"] = plan[f"{race_to_key(race)}_PERCENT"].fillna(0).astype(float)
        opportunity_districts[race] = {}
        for threshold in OpportunityThresholds:
            opportunity_districts[race][threshold] = 0
    for j, district in plan.iterrows():
        for race in Race:
            pop = district[f"{race_to_key(race)}_PERCENT"]
            if pop >= OpportunityThresholds.LOW.value:
                opportunity_districts[race][OpportunityThresholds.LOW] += 1
            if pop >= OpportunityThresholds.MEDIUM.value:
                opportunity_districts[race][OpportunityThresholds.MEDIUM] += 1
            if pop >= OpportunityThresholds.HIGH.value:
                opportunity_districts[race][OpportunityThresholds.HIGH] += 1
    rows = []
    for race in Race:
        rows.append([state.value, ensemble.value, i, race.value, opportunity_districts[race][OpportunityThresholds.LOW], opportunity_districts[race][OpportunityThresholds.MEDIUM], opportunity_districts[race][OpportunityThresholds.HIGH]])
    return rows


def get_opportunity_districts(state):
    opportunities = []
    for ensemble in EnsembleSize:
        dir = f"ensemble/{state.value}/{ensemble.value}"
        threads = []
        for i, file in enumerate(os.listdir(dir)):
            while len(threads) >= (NUM_OF_CORES - 1):
                for thread in threads:
                    res = thread.minute_join()
                    if res is not None:
                        opportunities += res
                threads = [thread for thread in threads if not thread.is_collected()]
            thread = thr.ThreadWithReturn(target=process_file, args=(dir, file, state, i, ensemble))
            thread.start()
            threads.append(thread)
        for thread in threads:
            res = thread.join()
            opportunities += res
    return opportunities


def process_state(state):
    opportunities = get_opportunity_districts(state)
    print(opportunities)
    df = pd.DataFrame(opportunities, columns=OPPORTUNITY_COLS)
    df.reset_index(drop=True, inplace=True)
    print(df)
    df.to_json(f"charts/{state.value}_OPPORTUNITY.json")


if __name__ == "__main__":
    os.makedirs("charts", exist_ok=True)
    if len(sys.argv) != 2:
        process_state(State.MISSISSIPPI)
        process_state(State.NEWYORK)
    else:
        if sys.argv[1] not in [State.MISSISSIPPI.value, State.NEWYORK.value]:
            print("Usage: python3 opportunity.py <STATE: MS/NY>")
        else:
            process_state(State(sys.argv[1]))
