from enums import *
import geopandas as gpd
import numpy as np
import os
import pandas as pd
import pyei as ei
import re

REGEX_MATCH = "(?:\\d+.\\d+(?:e-\\d+)?)"
MODEL_NAME = "king99_pareto_modification"
P_SCALE = 15
P_SHAPE = 2


def run_ei(precincts, race):
    # Calculate percentages
    precincts[f"PCT_{race_to_key(race)}"] = precincts[race_to_population_key(race).value] / precincts[PopulationKey.TOTAL.value]
    precincts[f"PCT_NON_{race_to_key(race)}"] = 1 - precincts[f"PCT_{race_to_key(race)}"]
    precincts["PCT_DEM"] = precincts[ElectionKey.DEMOCRATIC2020.value] / precincts[ElectionKey.TOTAL2020.value]
    precincts["PCT_REP"] = precincts[ElectionKey.REPUBLICAN2020.value] / precincts[ElectionKey.TOTAL2020.value]
    # Fix NaN values
    precincts[f"PCT_{race_to_key(race)}"] = precincts[f"PCT_{race_to_key(race)}"].fillna(0)
    precincts[f"PCT_NON_{race_to_key(race)}"] = precincts[f"PCT_NON_{race_to_key(race)}"].fillna(0)
    precincts["PCT_DEM"] = precincts["PCT_DEM"].fillna(0)
    precincts["PCT_REP"] = precincts["PCT_REP"].fillna(0)
    # Run EI
    group_fraction_2b2 = np.array(precincts[f"PCT_{race_to_key(race)}"])
    dem_votes_fraction_2b2 = np.array(precincts["PCT_DEM"])
    rep_votes_fraction_2b2 = np.array(precincts["PCT_REP"])
    total_votes_fraction_2b2 = np.array(precincts[ElectionKey.TOTAL2020.value])
    precinct_names = precincts["PRECINCT"]
    ei_dem = ei.two_by_two.TwoByTwoEI(model_name=MODEL_NAME, pareto_scale=P_SCALE, pareto_shape=P_SHAPE)
    ei_rep = ei.two_by_two.TwoByTwoEI(model_name=MODEL_NAME, pareto_scale=P_SCALE, pareto_shape=P_SHAPE)
    ei_dem.fit(group_fraction_2b2,
               dem_votes_fraction_2b2,
               total_votes_fraction_2b2,
               demographic_group_name=race.value,
               candidate_name=Candidate.DEMOCRATIC2020.value,
               precinct_names=precinct_names)
    ei_rep.fit(group_fraction_2b2,
               rep_votes_fraction_2b2,
               total_votes_fraction_2b2,
               demographic_group_name=race.value,
               candidate_name=Candidate.REPUBLICAN2020.value,
               precinct_names=precinct_names)
    return (ei_dem.summary(), ei_rep.summary())


def generate_ei_frame(ms_precincts, ny_precincts, race):
    ms = run_ei(ms_precincts, race)
    ny = run_ei(ny_precincts, race)
    cols = ["STATE", "RACE", "PARTY",
            "RACE_MEAN", "NON_RACE_MEAN",
            "RACE_LOW", "RACE_UP",
            "NON_RACE_LOW", "NON_RACE_UP"]
    ms_dem_numbers = pd.DataFrame([[State.MISSISSIPPI.value, race.value, PoliticalParty.DEMOCRATIC.value] + [float(x) for x in re.findall(REGEX_MATCH, ms[0])]], columns=cols)
    ms_rep_numbers = pd.DataFrame([[State.MISSISSIPPI.value, race.value, PoliticalParty.REPUBLICAN.value] + [float(x) for x in re.findall(REGEX_MATCH, ms[1])]], columns=cols)
    ny_dem_numbers = pd.DataFrame([[State.NEWYORK.value, race.value, PoliticalParty.DEMOCRATIC.value] + [float(x) for x in re.findall(REGEX_MATCH, ny[0])]], columns=cols)
    ny_rep_numbers = pd.DataFrame([[State.NEWYORK.value, race.value, PoliticalParty.REPUBLICAN.value] + [float(x) for x in re.findall(REGEX_MATCH, ny[1])]], columns=cols)
    frame = pd.concat([ms_dem_numbers, ms_rep_numbers, ny_dem_numbers, ny_rep_numbers]).reset_index()
    frame.drop(columns=["index"], inplace=True)
    return frame


def round_values(frame, dec):
    np.round(frame["RACE_MEAN"], dec)
    np.round(frame["NON_RACE_MEAN"], dec)
    np.round(frame["RACE_LOW"], dec)
    np.round(frame["RACE_UP"], dec)
    np.round(frame["NON_RACE_LOW"], dec)
    np.round(frame["NON_RACE_UP"], dec)
    return frame


if __name__ == "__main__":
    precincts_ms = gpd.read_file("shapes/MS_PRECINCTS_FINAL.geojson")
    precincts_ny = gpd.read_file("shapes/NY_PRECINCTS_FINAL.geojson")
    for race in Race:
        path = f"ei/{race_to_key(race)}_EI.json"
        if not os.path.exists(path):
            generate_ei_frame(precincts_ms, precincts_ny, race).to_json(path)
        frame = pd.read_json(path)
        round_values(frame, 10).to_json(f"ei/{race_to_key(race)}_EI_FINAL.json")
