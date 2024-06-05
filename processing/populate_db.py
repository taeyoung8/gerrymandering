from enums import *
import geopandas as gpd
import json
import pandas as pd
import pymongo as mg
import shapely as sp

CONNECTION_STRING = "mongodb://localhost:27017/"


def insert_ui_colors(db):
    db[DatabaseKey.UI_COLORS.value].insert_one({
        "number": 0,
        "asian": "#dd1c77",
        "black": "#f03b20",
        "democratic": "#008ef3",
        "hispanic": "#2ca25f",
        "total": "#000000",
        "republican": "#e81b23",
        "white": "#045a8d"
    })


def insert_state(state, db):
    # Insert districts
    districts = gpd.read_file(f"shapes/{state.value}_DISTRICTS_FINAL.geojson")
    districts_jsons = []
    for i, district in districts.iterrows():
        districts_jsons.append({key.lower(): value if key != "geometry" else sp.to_geojson(value) for key, value in district.items()})
    db[DatabaseKey.DISTRICTS.value].insert_many(sorted(districts_jsons, key=lambda i: i["district"]))
    # Insert precincts
    precincts = gpd.read_file(f"shapes/{state.value}_PRECINCTS_FINAL.geojson")
    precincts_json = []
    for i, precinct in precincts.iterrows():
        precincts_json.append({key.lower(): value if key != "geometry" else sp.to_geojson(value) for key, value in precinct.items()})
    db[DatabaseKey.PRECINCTS.value].insert_many(sorted(precincts_json, key=lambda i: i["precinct"]))
    # Insert coordinates
    if state == State.MISSISSIPPI:
        db[DatabaseKey.COORDINATES.value].insert_one({
            "state": state.value,
            "lat": 32.4488,
            "long": -89.404
        })
    elif state == State.NEWYORK:
        db[DatabaseKey.COORDINATES.value].insert_one({
            "state": state.value,
            "lat": 42.90688,
            "long": -75.93544
        })
    # Insert state ethnicity
    with open(f"charts/{state.value}_STATE_ETHNICITY.json", "r") as file:
        db[DatabaseKey.STATE_ETHNICITIES.value].insert_one(json.load(file))
    # Insert color bins
    bins = pd.read_json(f"charts/{state.value}_BINS.json")
    bins_jsons = []
    for i, bin in bins.iterrows():
        bins_jsons.append({key.lower(): value for key, value in bin.items()})
    db[DatabaseKey.COLOR_BINS.value].insert_many(bins_jsons)
    # Insert heat map
    heatmap = gpd.read_file(f"charts/{state.value}_HEATMAP.geojson")
    heat_jsons = []
    for i, heat in heatmap.iterrows():
        heat_jsons.append({key.lower(): value if key != "geometry" else sp.to_geojson(value) for key, value in heat.items()})
    db[DatabaseKey.HEATMAP.value].insert_many(heat_jsons)
    # Insert sorted districts
    sorted_districts = pd.read_json(f"charts/{state.value}_SORTED_DISTRICTS_ETHNICITY.json")
    sorted_jsons = []
    for i, district in sorted_districts.iterrows():
        sorted_jsons.append({key.lower(): value for key, value in district.items()})
    db[DatabaseKey.SORTED_DISTRICTS.value].insert_many(sorted_jsons)
    # Insert box and whisker
    box_whisker = pd.read_json(f"charts/{state.value}_BOX_WHISKER.json")
    box_jsons = []
    for i, box in box_whisker.iterrows():
        box_jsons.append({key.lower(): value for key, value in box.items()})
    db[DatabaseKey.BOX_AND_WHISKER.value].insert_many(box_jsons)
    # Insert gingles
    gingles = pd.read_json(f"charts/{state.value}_GINGLES.json")
    gingles_jsons = []
    for i, gingle in gingles.iterrows():
        gingles_jsons.append({key.lower(): value for key, value in gingle.items()})
    db[DatabaseKey.GINGLES.value].insert_many(gingles_jsons)
    # Insert opportunity
    opportunities = pd.read_json(f"charts/{state.value}_OPPORTUNITY.json")
    opportunities_jsons = []
    for i, opp in opportunities.iterrows():
        opportunities_jsons.append({key.lower(): value for key, value in opp.items()})
    db[DatabaseKey.OPPORTUNITIES.value].insert_many(opportunities_jsons)
    # Insert splits
    splits = pd.read_json(f"charts/{state.value}_SPLITS.json")
    splits_jsons = []
    for i, split in splits.iterrows():
        splits_jsons.append({key.lower(): value for key, value in split.items()})
    db[DatabaseKey.SPLITS.value].insert_many(splits_jsons)


def insert_ei(db):
    ei_jsons = []
    for race in Race:
        ecological_inference = pd.read_json(f"ei/{race_to_key(race)}_EI_FINAL.json")
        for i, ei in ecological_inference.iterrows():
            ei_jsons.append({key.lower(): value for key, value in ei.items()})
    db[DatabaseKey.ECOLOGICAL_INFERENCE.value].insert_many(ei_jsons)


if __name__ == "__main__":
    mongo = mg.MongoClient(CONNECTION_STRING)
    print("Removing old database")
    mongo.drop_database("hornets")
    db = mongo["hornets"]
    insert_ui_colors(db)
    for state in State:
        insert_state(state, db)
    insert_ei(db)
    print("Done")
