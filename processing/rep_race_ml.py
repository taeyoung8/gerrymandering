from enums import *
from deepface import DeepFace
import geopandas as gpd
import pandas as pd
import requests
import tempfile as tmp
import threading as th


def process_state(state):
    # Read file
    districts = gpd.read_file(f"shapes/{state.value}_DISTRICTS_FINAL.geojson")
    representatives = pd.read_csv(f"shapes/{state.value}_REPS.csv")
    races = []
    with tmp.TemporaryDirectory() as tempdir:
        for i, district in districts.iterrows():
            path = f"{tempdir}/{state.value}_{i}"
            # Download rep's image
            with open(path, "wb") as file:
                file.write(requests.get(district["REP_PIC"]).content)
            # Parse race with DeepFace model
            try:
                race_from_picture = DeepFace.analyze(img_path=path, actions=["race"], enforce_detection=False)[0]["dominant_race"]
            except Exception as e:
                print(f'[{district["REP_NAME"]}] {e}')
            match race_from_picture:
                case "asian":
                    race_from_picture = "Asian"
                case "black":
                    race_from_picture = "Black"
                case "latino hispanic":
                    race_from_picture = "Hispanic"
                case "white":
                    race_from_picture = "White"
                case _:
                    race_from_picture = "Other"
            # Cross check with manually analysis
            if race_from_picture != representatives.iloc[i]["Member"]:
                race_from_picture = representatives.iloc[i]["Member"]
            races.append(race_from_picture)
    # Set representative race
    districts["REP_RACE"] = races
    # Save changes
    with open(f"shapes/{state.value}_DISTRICTS_FINAL.geojson", "w") as f:
        f.write(precincts.to_json(drop_id=True))


if __name__ == "__main__":
    threads = []
    for state in State:
        thread = th.Thread(target=process_state, args=(state,))
        thread.start()
        threads.append(thread)
    for thread in threads:
        thread.join()