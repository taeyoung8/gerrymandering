from enums import *
import geopandas as gpd
import json


def calculate_state_ethnicity(state):
    districts = gpd.read_file(f"shapes/{state.value}_DISTRICTS_FINAL.geojson")
    sum_pop = districts[PopulationKey.TOTAL.value].sum()
    rep_race_data = []
    for race in Race:
        race_count = districts["REP_RACE"].value_counts().get(race.value, 0)
        race_percentage = round((race_count / len(districts)) * 100)
        rep_race_data.append(race_percentage)
    return {
        "state": state.value,
        "labels": [race.value for race in Race],
        "percent_assembly": rep_race_data,
        "percent_overall": [round((districts[race_to_population_key(race).value].sum() / sum_pop) * 100) for race in Race]
    }


if __name__ == "__main__":
    for state in State:
        ethnicity = calculate_state_ethnicity(state)
        with open(f"charts/{state.value}_STATE_ETHNICITY.json", "w") as file:
            json.dump(ethnicity, file)
