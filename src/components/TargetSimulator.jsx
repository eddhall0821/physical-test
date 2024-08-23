import { useEffect, useState } from "react";
import { Balls } from "./MTP/Balls";
import { fittsLaw } from "../utils";
import { Bar } from "react-chartjs-2";
const TOTAL_COUNT = 300;
const TargetSimulator = () => {
  useEffect(() => {
    let currentDesign;
    const balls = new Balls();
    balls.init({
      groupCount: 3,
      stepSize: 1.33333,
      startStep: 3,
      totalCount: TOTAL_COUNT,
    });

    balls.generateRandomDesigns();
    currentDesign = balls.popStack();

    const arr = [["id", "id", "w", "d", "reward"]];
    for (let i = 0; i < TOTAL_COUNT; i++) {
      // console.log(currentDesign);
      const id = fittsLaw(currentDesign.w * 2, currentDesign.d);
      arr.push([
        currentDesign.id,
        id,
        currentDesign.w,
        currentDesign.d,
        currentDesign.reward,
      ]);
      currentDesign = balls.popStack();
    }
    let summaryContent = arr
      .map((e) => {
        return e.join(",");
      })
      .join("\n");

    var encodedUri = encodeURI(`data:text/csv;charset=utf-8,${summaryContent}`);

    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ttttaaaaaaddfsfasdffew.csv`);

    document.body.appendChild(link);
    // link.click();
  }, []);

  return <></>;
};

export default TargetSimulator;
