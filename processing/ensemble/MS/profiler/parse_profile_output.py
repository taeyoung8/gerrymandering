import pandas as pd

df = pd.read_csv('seawulf_output.txt', sep='    ')
df.columns = ["ncalls", "tottime", "percall", "cumtime", "percall2", "filename:lineno(function)"]
# df.sort_values("cumtime", axis=1, inplace=True)
df.sort_values(by="cumtime", inplace=True, ascending=False)
print(df)
df.to_csv('MS_profile.csv', index=False)