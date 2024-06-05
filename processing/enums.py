from enum import Enum


class Race(Enum):
    WHITE = "White"
    BLACK = "Black"
    HISPANIC = "Hispanic"
    ASIAN = "Asian"


class State(Enum):
    NEWYORK = "NY"
    MISSISSIPPI = "MS"


class PoliticalParty(Enum):
    DEMOCRATIC = "Democratic"
    REPUBLICAN = "Republican"


class Candidate(Enum):
    DEMOCRATIC2020 = "Biden"
    REPUBLICAN2020 = "Trump"


class PopulationKey(Enum):
    WHITE = "WHITE_POP"
    BLACK = "BLACK_POP"
    HISPANIC = "HISP_POP"
    ASIAN = "ASIAN_POP"
    TOTAL = "TOT_POP"


class ElectionKey(Enum):
    DEMOCRATIC2020 = "2020_DEMOCRATIC"
    REPUBLICAN2020 = "2020_REPUBLICAN"
    TOTAL2020 = "2020_TOTAL"
    WINNER2020 = "2020_WINNER"


class DatabaseKey(Enum):
    UI_COLORS = "ui_colors"
    DISTRICTS = "districts"
    PRECINCTS = "precincts"
    COORDINATES = "coordinates"
    STATE_ETHNICITIES = "state_ethnicities"
    COLOR_BINS = "color_bins"
    HEATMAP = "heatmap"
    SORTED_DISTRICTS = "sorted_districts"
    BOX_AND_WHISKER = "box_and_whisker"
    GINGLES = "gingles"
    OPPORTUNITIES = "opportunities"
    SPLITS = "splits"
    ECOLOGICAL_INFERENCE = "ecological_inference"


class Mode(Enum):
    DISTRICT = "District"
    PRECINCT = "Precinct"
    RANDOM1 = "Random1"
    RANDOM2 = "Random2"
    RANDOM3 = "Random3"


class EnsembleSize(Enum):
    LARGE = 5000
    SMALL = 250


class OpportunityThresholds(Enum):
    LOW = 0.37
    MEDIUM = 0.44
    HIGH = 0.50


def race_to_population_key(race):
    if race == Race.WHITE:
        return PopulationKey.WHITE
    if race == Race.BLACK:
        return PopulationKey.BLACK
    if race == Race.HISPANIC:
        return PopulationKey.HISPANIC
    if race == Race.ASIAN:
        return PopulationKey.ASIAN


def race_to_key(race):
    if race == Race.WHITE:
        return "WHITE"
    if race == Race.BLACK:
        return "BLACK"
    if race == Race.HISPANIC:
        return "HISP"
    if race == Race.ASIAN:
        return "ASIAN"


def party_to_election_key(party):
    if party == PoliticalParty.DEMOCRATIC:
        return ElectionKey.DEMOCRATIC2020
    if party == PoliticalParty.REPUBLICAN:
        return ElectionKey.REPUBLICAN2020


def party_to_key(party):
    if party == PoliticalParty.DEMOCRATIC:
        return "DEM"
    if party == PoliticalParty.REPUBLICAN:
        return "REP"


def party_to_candidate(party):
    if party == PoliticalParty.DEMOCRATIC:
        return Candidate.DEMOCRATIC2020
    if party == PoliticalParty.REPUBLICAN:
        return Candidate.REPUBLICAN2020
