import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import linregress

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
# df = pd.read_csv(path)
df = combined_df[combined_df["reaction_time"] < 3000]
df = df[df["reaction_time"] > 0]

plt.figure(figsize=(10, 6))

# target_p 값에 따라 다른 색상과 선형 회귀선
colors = {0: "red", 10: "green", 50: "blue"}
for target_value in [0, 10, 50]:
    subset = df[df["target_p"] == target_value]
    plt.scatter(
        subset["id"],
        subset["reaction_time"],
        color=colors[target_value],
        label=f"Target pence: {target_value / 10}",
        alpha=0.7,
    )
    slope, intercept, r_value, p_value, std_err = linregress(
        subset["id"], subset["reaction_time"]
    )
    plt.plot(subset["id"], intercept + slope * subset["id"], color=colors[target_value])
plt.title("Reaction Time vs ID with Linear Regression by Target P")
plt.xlabel("ID")
plt.ylabel("Reaction Time")
plt.legend()
plt.grid(True)

plt.savefig(fname="img.png", bbox_inches="tight", pad_inches=0, dpi=300)
plt.show()
