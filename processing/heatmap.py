from enums import *
import geopandas as gpd
import numpy as np
import pandas as pd
import threading as th

ASIAN_COLORS = {
    0: "#f1eef6",
    1: "#d7b5d8",
    2: "#df65b0",
    3: "#dd1c77",
    4: "#980043"
}

BLACK_COLORS = {
    0: "#ffffb2",
    1: "#fecc5c",
    2: "#fd8d3c",
    3: "#f03b20",
    4: "#bd0026"
}

HISP_COLORS = {
    0: "#edf8fb",
    1: "#66c2a4",
    2: "#6ae6c6",
    3: "#2ca25f",
    4: "#006d2c"
}

WHITE_COLORS = {
    0: "#f1eef6",
    1: "#bdc9e1",
    2: "#74a9cf",
    3: "#2b8cbe",
    4: "#045a8d"
}

RACE_COLORS = {
    Race.WHITE: WHITE_COLORS,
    Race.BLACK: BLACK_COLORS,
    Race.HISPANIC: HISP_COLORS,
    Race.ASIAN: ASIAN_COLORS
}

RANGES = {
    Mode.DISTRICT: [(0, .10), (.10, .30), (.30, .60), (.60, .80), (.80, 1)],
    Mode.PRECINCT: [(0, .05), (.05, .10), (.10, .20), (.20, .35), (.35, 1)],
    Mode.RANDOM1: [(0, .10), (.10, .30), (.30, .60), (.60, .80), (.80, 1)],
    Mode.RANDOM2: [(0, .10), (.10, .30), (.30, .60), (.60, .80), (.80, 1)],
    Mode.RANDOM3: [(0, .10), (.10, .30), (.30, .60), (.60, .80), (.80, 1)]
}


def get_color_from_bins(bins, state, race, mode, pop):
    color = np.where((bins["STATE"] == state.value) & (bins["RACE"] == race.value) & (bins["MODE"] == mode.value) & (pop <= bins["POP"]))
    return bins.loc[color]["COLOR"].values[0]


def make_bins(state, precincts, districts, random_districts1, random_districts2, random_districts3):
    cols = ["STATE", "RACE", "MODE", "BIN", "MIN", "MAX", "COLOR", "POP"]
    bins = pd.DataFrame(columns=cols)
    for mode in Mode:
        match mode:
            case Mode.PRECINCT:
                data = precincts
            case Mode.DISTRICT:
                data = districts
            case Mode.RANDOM1:
                data = random_districts1
            case Mode.RANDOM2:
                data = random_districts2
            case Mode.RANDOM3:
                data = random_districts3
        for race in Race:
            races = []
            max_pop = np.max(data[race_to_population_key(race).value])
            for index, (i, j) in enumerate(RANGES[mode]):
                races.append(pd.DataFrame([[state.value, race.value, mode.value, index, i, j, RACE_COLORS[race][index], max_pop * j]], columns=cols))
            bins = pd.concat([bins, *races])  
    bins.reset_index(drop=True, inplace=True)
    bins.to_json(f"charts/{state.value}_BINS.json")
    return bins


def make_heat_map(state):
    precincts = gpd.read_file(f"shapes/{state.value}_PRECINCTS_FINAL.geojson")
    districts = gpd.read_file(f"shapes/{state.value}_DISTRICTS_FINAL.geojson")
    random_districts1 = gpd.read_file(f"ensemble/{state.value}/{state.value}_RANDOM_PLAN_1.geojson")
    random_districts2 = gpd.read_file(f"ensemble/{state.value}/{state.value}_RANDOM_PLAN_2.geojson")
    random_districts3 = gpd.read_file(f"ensemble/{state.value}/{state.value}_RANDOM_PLAN_3.geojson")
    bins = make_bins(state, precincts, districts, random_districts1, random_districts2, random_districts3)
    cols = ["NUMBER", "STATE", "MODE", "WHITE_COLOR", "BLACK_COLOR", "HISP_COLOR", "ASIAN_COLOR", "geometry"]
    heat = gpd.GeoDataFrame(columns=cols)
    for i, precinct in precincts.iterrows():
        precinct_with_colors = gpd.GeoDataFrame([[precinct["PRECINCT"], state.value, Mode.PRECINCT.value,
                                                  get_color_from_bins(bins, state, Race.WHITE,  Mode.PRECINCT, precinct[PopulationKey.WHITE.value]),
                                                  get_color_from_bins(bins, state, Race.BLACK,  Mode.PRECINCT, precinct[PopulationKey.BLACK.value]),
                                                  get_color_from_bins(bins, state, Race.HISPANIC,  Mode.PRECINCT, precinct[PopulationKey.HISPANIC.value]),
                                                  get_color_from_bins(bins, state, Race.ASIAN,  Mode.PRECINCT, precinct[PopulationKey.ASIAN.value]),
                                                  precinct["geometry"]]],
                                                columns=cols)
        heat = gpd.GeoDataFrame(pd.concat([heat, precinct_with_colors]))
    for i, district in districts.iterrows():
        district_with_colors = gpd.GeoDataFrame([[district["DISTRICT"], state.value, Mode.DISTRICT.value,
                                                  get_color_from_bins(bins, state, Race.WHITE,  Mode.DISTRICT, district[PopulationKey.WHITE.value]),
                                                  get_color_from_bins(bins, state, Race.BLACK,  Mode.DISTRICT, district[PopulationKey.BLACK.value]),
                                                  get_color_from_bins(bins, state, Race.HISPANIC,  Mode.DISTRICT, district[PopulationKey.HISPANIC.value]),
                                                  get_color_from_bins(bins, state, Race.ASIAN,  Mode.DISTRICT, district[PopulationKey.ASIAN.value]),
                                                  district["geometry"]]],
                                                columns=cols)
        heat = gpd.GeoDataFrame(pd.concat([heat, district_with_colors]))
    for i, district in random_districts1.iterrows():
        random_district_with_colors = gpd.GeoDataFrame([[district["DISTRICT"], state.value, Mode.RANDOM1.value,
                                                         get_color_from_bins(bins, state, Race.WHITE,  Mode.RANDOM1, district[PopulationKey.WHITE.value]),
                                                         get_color_from_bins(bins, state, Race.BLACK,  Mode.RANDOM1, district[PopulationKey.BLACK.value]),
                                                         get_color_from_bins(bins, state, Race.HISPANIC,  Mode.RANDOM1, district[PopulationKey.HISPANIC.value]),
                                                         get_color_from_bins(bins, state, Race.ASIAN,  Mode.RANDOM1, district[PopulationKey.ASIAN.value]),
                                                         district["geometry"]]],
                                                      columns=cols)
        heat = gpd.GeoDataFrame(pd.concat([heat, random_district_with_colors]))
    for i, district in random_districts2.iterrows():
        random_district_with_colors = gpd.GeoDataFrame([[district["DISTRICT"], state.value, Mode.RANDOM2.value,
                                                         get_color_from_bins(bins, state, Race.WHITE,  Mode.RANDOM2, district[PopulationKey.WHITE.value]),
                                                         get_color_from_bins(bins, state, Race.BLACK,  Mode.RANDOM2, district[PopulationKey.BLACK.value]),
                                                         get_color_from_bins(bins, state, Race.HISPANIC,  Mode.RANDOM2, district[PopulationKey.HISPANIC.value]),
                                                         get_color_from_bins(bins, state, Race.ASIAN,  Mode.RANDOM2, district[PopulationKey.ASIAN.value]),
                                                         district["geometry"]]],
                                                      columns=cols)
        heat = gpd.GeoDataFrame(pd.concat([heat, random_district_with_colors]))
    for i, district in random_districts3.iterrows():
        random_district_with_colors = gpd.GeoDataFrame([[district["DISTRICT"], state.value, Mode.RANDOM3.value,
                                                         get_color_from_bins(bins, state, Race.WHITE,  Mode.RANDOM3, district[PopulationKey.WHITE.value]),
                                                         get_color_from_bins(bins, state, Race.BLACK,  Mode.RANDOM3, district[PopulationKey.BLACK.value]),
                                                         get_color_from_bins(bins, state, Race.HISPANIC,  Mode.RANDOM3, district[PopulationKey.HISPANIC.value]),
                                                         get_color_from_bins(bins, state, Race.ASIAN,  Mode.RANDOM3, district[PopulationKey.ASIAN.value]),
                                                         district["geometry"]]],
                                                      columns=cols)
        heat = gpd.GeoDataFrame(pd.concat([heat, random_district_with_colors]))
    heat.reset_index(drop=True, inplace=True)
    with open(f"charts/{state.value}_HEATMAP.geojson", "w") as f:
        f.write(heat.to_json(drop_id=True))
    return heat


if __name__ == "__main__":
    threads = []
    for state in State:
        thread = th.Thread(target=make_heat_map, args=(state,))
        thread.start()
        threads.append(thread)
    for thread in threads:
        thread.join()