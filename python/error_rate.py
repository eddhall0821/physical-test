import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import linregress
import numpy as np

filenames = [
    # "s60f06a479c4f3ec0a536d40a_65b0c816f1a0063d97444363_1706087803561",
    # "s60fc189df1dcc953f098ab5e_65b0bd847e8310dc03e1da0e_1706087495184",  # 0 거르는애
    # "s610d42ce297f0c4f3542f0c8_65b0be3085ee685874c28b8c_1706086330675", #dpi 오류
    # "s614dc3a3eb1768cb811daeae_65b0bd955fabdb2f869173a4_1706089464234",
    # "s61743b31d0f9de288cc272e6_65b0bf1e5fabdb2f869173f1_1706086255010",
    ####2차####
    # "s5f51587f36e91f38fbf34c23_65b33fb1f2d71e32a9c89fb2_1706249456679",
    # "s58bef6fd31de840001e84ba0_65b3468fda5b722e3b0c057b_1706251355218",
    "s5daa50967776b10016e1bc9b_65b34c204096e2e85ec37254_1706253560814",
    # "s63fe16762b4c19bea77a0904_65b35e5e8eb5426eaf325fa9_1706263232846",
    # "s65492662e16ad03ea732fd62_65b35f91ce60d65be69f50fd_1706259834523",
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


full_file_paths = makeFullFilePaths(filenames)

df = pd.concat([pd.read_csv(f) for f in full_file_paths], ignore_index=True)


# graph1 함수
def plot_graph1(df):
    # df = df[df["reaction_time"] < 5000]
    colors = {10: "red", 50: "green", 100: "blue"}
    for target_value in [10, 50, 100]:
        subset = df[df["target_p"] == target_value]
        plt.scatter(
            subset["id"],
            subset["reaction_time"],
            color=colors[target_value],
            label=f"Target pence: {target_value / 10}",
            alpha=0.7,
        )
        slope, intercept, _, _, _ = linregress(subset["id"], subset["reaction_time"])
        plt.plot(
            subset["id"], intercept + slope * subset["id"], color=colors[target_value]
        )
    plt.title("Trial Completion Time vs ID with Linear Regression by Target Reward")
    plt.xlabel("ID")
    plt.ylabel("Trial Completion Time")
    plt.legend()
    plt.grid(True)


# graph2 함수
def plot_graph2(df):
    df["target_p_scaled"] = df["target_p"] / 10
    error_rates_by_target_p = df.groupby("target_p_scaled")["success"].apply(
        lambda x: 1 - x.mean()
    )
    bin_size = 1
    df["id_bin"] = pd.cut(
        df["id"], bins=np.arange(0, df["id"].max() + bin_size, bin_size), right=False
    )
    plt.xlabel("ID")
    plt.ylabel("Error Rate")
    for target_p_val in [10, 50, 100]:
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
    plt.legend()
    plt.tight_layout()


# 두 그래프를 나란히 표시
plt.figure(figsize=(20, 8))
plt.subplot(1, 2, 1)
plot_graph1(df)

plt.subplot(1, 2, 2)
plot_graph2(df)

plt.show()
