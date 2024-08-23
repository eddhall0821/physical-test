import {
  getDistanceByWidthAndId,
  getWidthByIDAndDistance,
  shuffle,
} from "../../utils";
import { INCH_24_HEIGHT } from "./MTPCanvas";

export const BALL_POINTS = [0, 4, 10];
export class Balls {
  designs = [];
  randomDesignArray = [];

  generateRandomDesigns = function () {
    const randomDesignArray = [];
    for (let design of this.designs) {
      for (let i = 0; i < design.cnt; i++) {
        const random = Math.random();
        const minDistance = 2;
        const maxDistance = INCH_24_HEIGHT / 2;
        const randId = random * design.idStep + design.idStart;

        let distance, width;
        // distance = random * (maxDistance - minDistance) + minDistance;
        // width = getWidthByIDAndDistance(randId, distance) / 2;

        if (randId <= this.startStep + this.stepSize) {
          width = 0.5;
        } else if (randId <= this.startStep + this.stepSize * 2) {
          width = 0.3;
        } else if (randId <= this.startStep + this.stepSize * 3) {
          width = 0.1;
        }

        distance = getDistanceByWidthAndId(randId, width);
        randomDesignArray.push({
          random: random,
          id: randId,
          d: distance,
          w: width / 2,
          reward: design.reward[i],
        });
      }
    }
    this.randomDesignArray = shuffle(randomDesignArray);
    this.randomDesignArray.sort((a, b) => a.reward - b.reward);

    const designArrayChunk = this.chunk(
      this.randomDesignArray,
      this.totalCount / this.num_sessions
    );
    this.randomDesignArray = shuffle(designArrayChunk).flat();
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

    for (let i = 0; i < n; i++) {
      switch (i % 3) {
        case 0:
          resultArray.push(BALL_POINTS[0]);
          break;
        case 1:
          resultArray.push(BALL_POINTS[1]);
          break;
        case 2:
          resultArray.push(BALL_POINTS[2]);
          break;
      }
    }
    return resultArray;
  };

  max_target_radius = 0.25;

  init = function ({
    groupCount,
    stepSize,
    startStep,
    totalCount,
    num_sessions = 0,
  }) {
    this.designs = [];
    this.stepSize = stepSize;
    this.startStep = startStep;
    this.totalCount = totalCount;
    this.num_sessions = num_sessions;
    this.sessions = [];

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
