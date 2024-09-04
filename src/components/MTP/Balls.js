import {
  getDistanceByWidthAndId,
  getRandomArbitrary,
  getWidthByIDAndDistance,
  shuffle,
} from "../../utils";
import { INCH_24_HEIGHT } from "./MTPCanvas";

export const BALL_POINTS = [0, 0.1, 1, 10];
export const BALL_COLORS = ["#ffffff", "#ABE7FF", "#57D0FF", "#00AAFF"];
export const BALL_COLOR_NAME = [
  "White",
  "This color",
  "This color",
  "This color",
];

export class Balls {
  designs = [];
  randomDesignArray = [];

  fisherYatesShuffle = function (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  generateRandomDesigns = function () {
    console.log(this.monitorBound);
    const randomDesignArray = [];
    for (let design of this.designs) {
      for (let i = 0; i < design.cnt; i++) {
        const random = Math.random();

        //랜덤한 id 값
        const randId = random * design.idStep + design.idStart;
        const randomWidth = getRandomArbitrary(0.1, 0.5);
        const randomDistance = getRandomArbitrary(3, this.monitorBound / 2 - 1);
        let distance, width;

        //이부분은 삭제하지말것
        // if (randId <= this.startStep + this.stepSize) {
        //   width = 0.5;
        // } else if (randId <= this.startStep + this.stepSize * 2) {
        //   width = 0.3;
        // } else if (randId <= this.startStep + this.stepSize * 3) {
        //   width = 0.1;
        // }

        // distance = getDistanceByWidthAndId(randId, width);
        distance = randomDistance;

        width = getWidthByIDAndDistance(randId, randomDistance);
        if (width < 0.1) {
          width = 0.1;
          distance = getDistanceByWidthAndId(randId, width);
        }

        randomDesignArray.push({
          random: random,
          id: randId,
          d: distance,
          w: width / 2,
          reward: design.reward[i],
        });
      }
    }

    //세션을 섞는거임
    if (this.shuffle) {
      this.randomDesignArray = shuffle(randomDesignArray);
      this.randomDesignArray.sort((a, b) => a.reward - b.reward);

      const designArrayChunk = this.chunk(
        this.randomDesignArray,
        this.totalCount / this.num_sessions
      );
      this.randomDesignArray = shuffle(designArrayChunk).flat();
    } else {
      //세션을 안섞는거임
      this.randomDesignArray = randomDesignArray;
      this.randomDesignArray.sort((a, b) => a.reward - b.reward);
    }

    //피셔 예이츠 셔플 하는거임
    if (this.num_sessions === 0) {
      this.randomDesignArray.sort((a, b) => a.reward - b.reward);
      this.randomDesignArray = this.fisherYatesShuffle(this.randomDesignArray);
      console.log(this.randomDesignArray);
    }
  };

  getRandomDesignArray = function () {
    if (this.randomDesignArray.length !== 0) return this.randomDesignArray;
    else return [];
  };

  chunk = function (data = [], size = 1) {
    const arr = [];

    for (let i = 0; i < data.length; i += size) {
      arr.push(data.slice(i, i + size));
    }

    return arr;
  };

  popStack = function () {
    if (this.randomDesignArray.length !== 0) {
      return this.randomDesignArray.pop();
    } else {
      console.log("done.");
    }
  };

  createRewardArray = function (n) {
    const resultArray = [];
    const length = BALL_POINTS.length;

    for (let i = 0; i < n; i++) {
      resultArray.push(BALL_POINTS[i % length]);
    }

    return resultArray;
  };

  max_target_radius = 0.25;

  init = function ({
    groupCount,
    stepSize,
    startStep,
    totalCount,
    monitorBound,
    num_sessions = 0,
    shuffle = true,
  }) {
    this.designs = [];
    this.stepSize = stepSize;
    this.startStep = startStep;
    this.totalCount = totalCount;
    this.num_sessions = num_sessions;
    this.sessions = [];
    this.shuffle = shuffle;
    this.monitorBound = monitorBound;

    const reward = this.createRewardArray(totalCount);

    const slicer = totalCount / groupCount;
    for (let i = 0; i < groupCount; i++) {
      this.designs.push({
        index: i,
        cnt: totalCount / groupCount,
        idStart: startStep + i * stepSize,
        idStep: stepSize,
        idEnd: startStep + i * stepSize + stepSize,
        reward: reward.slice(slicer * i, slicer * i + slicer),
      });
    }
    console.log(this.designs);
  };
}
