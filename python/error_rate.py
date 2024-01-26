import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import linregress
import numpy as np

filenames = [
    "s60f06a479c4f3ec0a536d40a_65b0c816f1a0063d97444363_1706087803561",
    "s60fc189df1dcc953f098ab5e_65b0bd847e8310dc03e1da0e_1706087495184",  # 0 거르는애
    # "s610d42ce297f0c4f3542f0c8_65b0be3085ee685874c28b8c_1706086330675", #dpi 오류
    "s614dc3a3eb1768cb811daeae_65b0bd955fabdb2f869173a4_1706089464234",
    "s61743b31d0f9de288cc272e6_65b0bf1e5fabdb2f869173f1_1706086255010",
]


def makeFullFilePaths(filenames):
    fullFilePaths = []

    for name in filenames:
        fullFilePaths.append(
            "C:/Users/soomin/AppData/Local/Google/Cloud SDK/point-and-click-20d4c.appspot.com/summary/"
            + name
            + ".csv"
        )
    print(fullFilePaths)
    return fullFilePaths


fullFilePaths = makeFullFilePaths(filenames)

combined_df = pd.concat([pd.read_csv(f) for f in fullFilePaths], ignore_index=True)
df = combined_df[combined_df["reaction_time"] < 3000]
df = df[df["reaction_time"] > 0]
# 여기서부터
df["target_p_scaled"] = df["target_p"] / 10

# Calculate the error rate grouped by the new column (target_p_scaled)
error_rates_by_target_p = df.groupby("target_p_scaled")["success"].apply(
    lambda x: 1 - x.mean()
)

# Bin the 'id' values
bin_size = 1  # Adjust the bin size as needed
df["id_bin"] = pd.cut(
    df["id"], bins=np.arange(0, df["id"].max() + bin_size, bin_size), right=False
)

# Plotting
plt.figure(figsize=(12, 6))

# Plotting the error rate by target_p_scaled
# plt.bar(
#     error_rates_by_target_p.index,
#     error_rates_by_target_p.values,
#     alpha=0.6,
#     label="All target_p",
# )
plt.xlabel("ID")
plt.ylabel("Error Rate")

# Error rates by binned id for specific target_p values
for target_p_val in [0, 10, 50]:
    error_rates_by_id_bin = (
        df[df["target_p"] == target_p_val]
        .groupby("id_bin")["success"]
        .apply(lambda x: 1 - x.mean())
    )
    plt.plot(
        error_rates_by_id_bin.index.categories.mid,
        error_rates_by_id_bin.values,
        marker="o",
        label=f"target reward = {target_p_val / 10}",
    )

plt.title("")
plt.legend()
plt.tight_layout()
plt.show()
