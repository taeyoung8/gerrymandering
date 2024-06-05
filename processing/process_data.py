from enums import *
import geopandas as gpd
import math
import maup
import numpy as np
import os
import pandas as pd
import threading as th


def fix_geometry(gdf):
    gdf = gdf.to_crs(gdf.estimate_utm_crs())
    gdf = maup.smart_repair(gdf)
    return gdf


def get_adjacencies_frame(precincts):
    adjacencies = maup.adjacencies(precincts, output_type="geodataframe")
    adjacencies[["PRECINCT", "NEIGHBOR"]] = pd.DataFrame(adjacencies["neighbors"].tolist(), index=adjacencies.index)
    # Ensure adjacencies are bidirectional
    adjacencies_bi = pd.concat([adjacencies, adjacencies.rename(columns={"PRECINCT": "NEIGHBOR", "NEIGHBOR": "PRECINCT"})])
    return adjacencies_bi[["PRECINCT", "NEIGHBOR"]]


def get_blocks_frame(state):
    if os.path.exists(f"shapes/{state.value}_CENSUS_BLOCKS.geojson"):
        return gpd.read_file(f"shapes/{state.value}_CENSUS_BLOCKS.geojson")
    # Load files
    blocks = gpd.read_file(f"shapes/{state.value}_CENSUS_BLOCKS.zip")
    block_demographics = pd.read_csv(f"shapes/{state.value}_CENSUS_DEMOGRAPHICS.csv")
    # Merge demographic data with blocks
    blocks["GEOID20"] = blocks["GEOID20"].astype(str)
    block_demographics["GEOID20"] = block_demographics["GEOID20"].astype(str)
    block_demographics.rename(columns={"Total_Population": PopulationKey.TOTAL.value,
                                "White_alone": PopulationKey.WHITE.value,
                                "Black_or_African_American_alone": PopulationKey.BLACK.value,
                                "Hispanic_or_Latino": PopulationKey.HISPANIC.value,
                                "Asian_alone": PopulationKey.ASIAN.value}, inplace=True)
    blocks = blocks.merge(block_demographics, on="GEOID20")
    # Fix NaN values
    for population_key in PopulationKey:
        blocks[population_key.value] = blocks[population_key.value].fillna(0).astype(int)
    # Fix precinct column
    blocks["PRECINCTID"] = blocks["PRECINCTID"].astype(str)
    if state == "NY":
        blocks["PRECINCTID"] = blocks["PRECINCTID"].apply(lambda x: x.split(" - ")[0])
    blocks.rename(columns={"PRECINCTID": "PRECINCT"}, inplace=True)
    blocks["PRECINCT"] = blocks["PRECINCT"].astype(str)
    # Save
    blocks.to_file(f"shapes/{state.value}_CENSUS_BLOCKS.geojson", driver="GeoJSON")
    return blocks


def get_precincts_frame(state):
    if os.path.exists(f"shapes/{state.value}_PRECINCTS.geojson"):
        return gpd.read_file(f"shapes/{state.value}_PRECINCTS.geojson")
    # Load files
    precincts = gpd.read_file(f"shapes/{state.value}_PRECINCTS.zip")
    # Add state column
    precincts['STATE'] = state.value
    # Fix precinct column
    if state == State.MISSISSIPPI:
        precincts.rename(columns={"GEOID20": "PRECINCT"}, inplace=True)
    precincts["PRECINCT"] = precincts["PRECINCT"].astype(str)
    # Calculate 2020 votes in precincts
    precincts[ElectionKey.TOTAL2020.value] = precincts.filter(like="G20PRE").sum(axis=1).astype(int)
    precincts[ElectionKey.WINNER2020.value] = np.where(precincts['G20PREDBID'] > precincts['G20PRERTRU'],
                                                       PoliticalParty.DEMOCRATIC.value, PoliticalParty.REPUBLICAN.value)
    precincts.rename(columns={"G20PREDBID": ElectionKey.DEMOCRATIC2020.value,
                              "G20PRERTRU": ElectionKey.REPUBLICAN2020.value}, inplace=True)
    # Fix geometry
    precincts = fix_geometry(precincts)
    # Get precinct neighbors
    precincts["NEIGHBORS"] = get_adjacencies_frame(precincts).groupby("PRECINCT")["NEIGHBOR"].apply(lambda x: ",".join(map(str, set(x)))).reset_index()["NEIGHBOR"]
    # Save
    precincts.to_file(f"shapes/{state.value}_PRECINCTS.geojson", driver="GeoJSON")
    return precincts


def get_districts_frame(state):
    if os.path.exists(f"shapes/{state.value}_DISTRICTS.geojson"):
        return gpd.read_file(f"shapes/{state.value}_DISTRICTS.geojson")
    # Load files
    districts = gpd.read_file(f"shapes/{state.value}_DISTRICTS.zip")
    districts_reps = pd.read_csv(f"shapes/{state.value}_REPS.csv")
    # Add state columns
    districts["STATE"] = state.value
    # Fix district column
    if state == State.MISSISSIPPI:
        districts.drop(columns=["ID", "DISTRICT"], inplace=True)
        districts.rename(columns={"Distnum": "ID"}, inplace=True)
    # Merge representative info with districts
    districts_reps.rename(columns={"District": "DISTRICT", "Member": "REP_NAME",
                                "Party": "REP_PARTY", "Race": "REP_RACE",
                                "Image Link": "REP_PIC",
                                "Voter Margin": "REP_VOTE_MARGIN"}, inplace=True)
    districts = districts.merge(districts_reps, left_on="ID", right_on="DISTRICT")
    # Make new GeoDataFrame
    districts = gpd.GeoDataFrame(districts, columns=["DISTRICT", "STATE",
                                                "REP_NAME", "REP_PARTY",
                                                "REP_RACE", "REP_PIC",
                                                "REP_VOTE_MARGIN", "geometry"])
    districts.sort_values("DISTRICT", inplace=True)
    # Fix geometry
    districts = fix_geometry(districts)
    # Save
    districts.to_file(f"shapes/{state.value}_DISTRICTS.geojson", driver="GeoJSON")
    return districts


def process_state(state):
    # Load files
    blocks = get_blocks_frame(state)
    precincts = get_precincts_frame(state)
    districts = get_districts_frame(state)
    # Merge blocks data with precincts
    grouped_blocks = blocks.groupby("PRECINCT")[[PopulationKey.TOTAL.value, PopulationKey.WHITE.value,
                                                 PopulationKey.BLACK.value, PopulationKey.HISPANIC.value, PopulationKey.ASIAN.value]].sum().reset_index()
    precincts = precincts.merge(grouped_blocks[['PRECINCT', PopulationKey.TOTAL.value, PopulationKey.WHITE.value,
                                                PopulationKey.BLACK.value, PopulationKey.HISPANIC.value, PopulationKey.ASIAN.value]], on="PRECINCT", how="left")
    precincts["PRECINCT"] = precincts.index
    precincts = gpd.GeoDataFrame(precincts, columns=["PRECINCT", "STATE",
                                                     "DISTRICT", PopulationKey.TOTAL.value,
                                                     PopulationKey.WHITE.value, PopulationKey.BLACK.value,
                                                     PopulationKey.HISPANIC.value, PopulationKey.ASIAN.value,
                                                     ElectionKey.DEMOCRATIC2020.value, ElectionKey.REPUBLICAN2020.value,
                                                     ElectionKey.TOTAL2020.value, ElectionKey.WINNER2020.value,
                                                     "NEIGHBORS", "geometry"])
    # Assign precincts to districts
    precincts_to_districts = maup.assign(precincts, districts)
    precincts["DISTRICT"] = precincts_to_districts.apply(lambda x: int(x + 1)) # Add 1 as maup assign uses index of district and not true district number (which we need for merge)
    # Fill NaN values
    for population_key in PopulationKey:
        precincts[population_key.value] = precincts[population_key.value].fillna(0).astype(int)
    precincts["NEIGHBORS"] = precincts["NEIGHBORS"].fillna("").astype(str)
    # Merge precinct data with districts
    grouped_precincts = precincts.groupby("DISTRICT")[[PopulationKey.TOTAL.value, PopulationKey.WHITE.value, PopulationKey.BLACK.value,
                                                       PopulationKey.HISPANIC.value, PopulationKey.ASIAN.value,
                                                       ElectionKey.DEMOCRATIC2020.value, ElectionKey.REPUBLICAN2020.value, ElectionKey.TOTAL2020.value]].sum().reset_index()
    districts = districts.merge(grouped_precincts[['DISTRICT', PopulationKey.TOTAL.value, PopulationKey.WHITE.value,
                                                   PopulationKey.BLACK.value, PopulationKey.HISPANIC.value, PopulationKey.ASIAN.value,
                                                   ElectionKey.DEMOCRATIC2020.value, ElectionKey.REPUBLICAN2020.value, ElectionKey.TOTAL2020.value]], on="DISTRICT", how="left")
    districts[ElectionKey.WINNER2020.value] = np.where(districts[ElectionKey.DEMOCRATIC2020.value] > districts[ElectionKey.REPUBLICAN2020.value], PoliticalParty.DEMOCRATIC.value, PoliticalParty.REPUBLICAN.value)
    districts['PRECINCTS'] = precincts.groupby("DISTRICT")["PRECINCT"].apply(lambda x: ",".join(map(str, set(x)))).reset_index()["PRECINCT"]
    districts = districts[["DISTRICT", "STATE", "REP_NAME", "REP_PARTY", "REP_RACE", "REP_PIC", "REP_VOTE_MARGIN",
                           PopulationKey.TOTAL.value, PopulationKey.WHITE.value, PopulationKey.BLACK.value,
                           PopulationKey.HISPANIC.value, PopulationKey.ASIAN.value,
                           ElectionKey.DEMOCRATIC2020.value, ElectionKey.REPUBLICAN2020.value,
                           ElectionKey.TOTAL2020.value, ElectionKey.WINNER2020.value,
                           "PRECINCTS", "geometry"]]
    # Simplify geometries
    precincts["geometry"] = precincts["geometry"].simplify(.001)
    districts["geometry"] = districts["geometry"].simplify(.001)
    # Save
    with open(f"shapes/{state.value}_PRECINCTS_FINAL.geojson", "w") as f:
        f.write(precincts.to_json(drop_id=True, to_wgs84=True))
    with open(f"shapes/{state.value}_DISTRICTS_FINAL.geojson", "w") as f:
        f.write(districts.to_json(drop_id=True, to_wgs84=True))


if __name__ == "__main__":
    threads = []
    for state in State:
        thread = th.Thread(target=process_state, args=(state,))
        thread.start()
    for thread in threads:
        thread.join()