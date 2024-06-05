from enums import *
import geopandas as gpd
import numpy as np
import os
import pandas as pd
import sys
import thread_with_return as thr

SPLIT_COLS = ["STATE", "ENSEMBLE", "PLAN", "REP_DEM_SPLIT"]
NUM_OF_CORES = 95

def process_file(dir, file, state, i, ensemble):
    plan = gpd.read_file(f"{dir}/{file}")
    splits = {}
    for j, district in plan.iterrows():
        republican_split = str(int(round(district[party_to_election_key(PoliticalParty.REPUBLICAN).value] / district[ElectionKey.TOTAL2020.value], 2) * 100))
        democratic_split = str(int(round(district[party_to_election_key(PoliticalParty.DEMOCRATIC).value] / district[ElectionKey.TOTAL2020.value], 2) * 100))
        split = f"{republican_split}-{democratic_split}"
        if split not in splits:
            splits[split] = 0
        splits[split] += 1
    splits_str = ""
    for key, value in splits.items():
        splits_str += f"{key}:{value},"
    return [[state.value, ensemble.value, i, splits_str]]


def get_splits(state):
    splits = []
    for ensemble in EnsembleSize:
        dir = f"ensemble/{state.value}/{ensemble.value}"
        threads = []
        for i, file in enumerate(os.listdir(dir)):
            while len(threads) >= (NUM_OF_CORES - 1):
                for thread in threads:
                    res = thread.minute_join()
                    if res is not None:
                        splits += res
                threads = [thread for thread in threads if not thread.is_collected()]
            thread = thr.ThreadWithReturn(target=process_file, args=(dir, file, state, i, ensemble))
            thread.start()
            threads.append(thread)
        for thread in threads:
            res = thread.join()
            splits += res
    return splits


def process_state(state):
    splits = get_splits(state)
    print(splits)
    df = pd.DataFrame(splits, columns=SPLIT_COLS)
    df.sort_values("PLAN", inplace=True)
    df.reset_index(drop=True, inplace=True)
    print(df)
    df.to_json(f"charts/{state.value}_SPLITS.json")


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
