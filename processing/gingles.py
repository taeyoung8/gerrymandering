from enums import *
import geopandas as gpd
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from scipy.optimize import curve_fit


def non_linear_regression(x, a, b, c):
    return a / (1 + np.exp(-b * (x - c)))


def non_linear_regression_2(x, a, b):
    return a * np.exp(-b * x)


def get_scatter_points(precincts):
    points = {}
    for race in Race:
        points[race] = {}
        points[race][PoliticalParty.DEMOCRATIC] = []
        points[race][PoliticalParty.REPUBLICAN] = []
    # Calculate demographic percentages
    for race in Race:
        precincts[f"{race_to_key(race)}_PCT"] = (precincts[race_to_population_key(race).value] / precincts[PopulationKey.TOTAL.value])
        precincts[f"{race_to_key(race)}_PCT"] = precincts[f"{race_to_key(race)}_PCT"].fillna(0).astype(float)
    for party in PoliticalParty:
        precincts[f"{party_to_key(party)}_PCT"] = (precincts[party_to_election_key(party).value] / precincts[ElectionKey.TOTAL2020.value])
        precincts[f"{party_to_key(party)}_PCT"] = precincts[f"{party_to_key(party)}_PCT"].fillna(0).astype(float)
    # Calculate points per race per party
    for i, precinct in precincts.iterrows():
        for race in Race:
            for party in PoliticalParty:
                points[race][party].append((precinct[f"{race_to_key(race)}_PCT"], precinct[f"{party_to_key(party)}_PCT"], i))
    # Sort points
    for race in Race:
        for party in PoliticalParty:
            points[race][party] = sorted(points[race][party], key=lambda x: x[2])
    return points


def get_non_linear_points(scatter_points):
    points = {}
    for race in Race:
        points[race] = {}
        for party in PoliticalParty:
            x_points = [point[0] for point in scatter_points[race][party]]
            y_points = [point[1] for point in scatter_points[race][party]]
            if race == Race.WHITE or race == Race.BLACK:
                popt, _ = curve_fit(non_linear_regression, x_points, y_points, maxfev=10000)
            else:
                popt, _ = curve_fit(non_linear_regression_2, x_points, y_points)
            points[race][party] = popt
    return points


def process_state(state):
    precincts = gpd.read_file(f"shapes/{state.value}_PRECINCTS_FINAL.geojson")
    scatter_points = get_scatter_points(precincts)
    non_linear_points = get_non_linear_points(scatter_points)
    # Plot each race
    for race in Race:
        for party in PoliticalParty:
            # Plot scatter points
            plt.scatter([point[0] for point in scatter_points[race][party]], [point[1] for point in scatter_points[race][party]], color=('blue' if party == PoliticalParty.DEMOCRATIC else 'red'), label=party.value)
            # Plot non-linear regression
            x_points = np.linspace(0, 1, 100)
            if race == Race.WHITE or race == Race.BLACK:
                y_points = non_linear_regression(x_points, *non_linear_points[race][party])
            else:
                y_points = non_linear_regression_2(x_points, *non_linear_points[race][party])
            plt.plot(x_points, y_points, color=('orange' if party == PoliticalParty.DEMOCRATIC else 'purple'), label=party.value)
        # Set plot options
        plt.title(f"{state.value} - {race.value}")
        plt.xlabel(f"Percent {race.value}")
        plt.ylabel("Vote Share")
        plt.legend()
        plt.show()
    # Export data
    non_linear_df = pd.DataFrame(columns=["STATE", "RACE", "PARTY", "SCATTER_X", "SCATTER_Y", "SCATTER_PRE", "SCATTER_LEN", "NON_LINEAR_A", "NON_LINEAR_B", "NON_LINEAR_C"])
    i = 0
    for race in Race:
        for party in PoliticalParty:
            non_linear_df.loc[i] = [state.value, race.value, party.value,
                                    [point[0] for point in scatter_points[race][party]],
                                    [point[1] for point in scatter_points[race][party]],
                                    [point[2] for point in scatter_points[race][party]],
                                    len(scatter_points[race][party]),
                                    non_linear_points[race][party][0],
                                    non_linear_points[race][party][1],
                                    non_linear_points[race][party][2] if non_linear_points[race][party].size == 3 else 0]
            i += 1
        i += 1
    non_linear_df.to_json(f"charts/{state.value}_GINGLES.json")
    print(non_linear_df)


if __name__ == "__main__":
    for state in State:
        process_state(state)