from enums import *
import geopandas as gpd
import pandas as pd


def sort_districts_by_ethnicity(state):
    districts = gpd.read_file(f"shapes/{state.value}_DISTRICTS_FINAL.geojson")
    cols = ["STATE", "RACE", "DISTRICT_SORTED", "POP_PERCENT"]
    ethnicity = pd.DataFrame(columns=cols)
    for race in Race:
        population_key = race_to_population_key(race).value
        districts[f"{population_key}_PERCENT"] = (districts[population_key] / districts[PopulationKey.TOTAL.value]) * 100
        sorted_districts = districts.sort_values(f"{population_key}_PERCENT")
        sorted_districts.reset_index(drop=True, inplace=True)
        for i, district in sorted_districts.iterrows():
            ethnicity = pd.concat([ethnicity, pd.DataFrame([[state.value, race.value,
                                                             i, district[f"{population_key}_PERCENT"]]],
                                                             columns=cols)])
            ethnicity["POP_PERCENT"] = ethnicity["POP_PERCENT"].fillna(0)
    ethnicity.reset_index(drop=True, inplace=True)
    print(ethnicity)
    return ethnicity


if __name__ == "__main__":
    for state in State:
        sort = sort_districts_by_ethnicity(state)
        sort.to_json(f"charts/{state.value}_SORTED_DISTRICTS_ETHNICITY.json")
