import { getWdithByIDAndDistance, shuffle } from "../../utils";
import { INCH_24_HEIGHT } from "./MTPCanvas";

export const BALL_POINTS = [0, 50, 150];
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
        const distance = random * (maxDistance - minDistance) + minDistance;
        const width = getWdithByIDAndDistance(randId, distance);
        randomDesignArray.push({
          random: random,
          id: randId,
          d: distance,
          w: width,
          reward: design.reward[i],
        });
      }
    }
    this.randomDesignArray = shuffle(randomDesignArray);
    // this.randomDesignArray = randomDesignArray;
  };

  getRandomDesignArray = function () {
    console.log(this.randomDesignArray);
    if (this.randomDesignArray.length !== 0) return this.randomDesignArray;
    else return [];
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

  init = function ({ groupCount, stepSize, startStep, totalCount }) {
    this.designs = [];
    for (let i = 0; i < groupCount; i++) {
      const reward = this.createRewardArray(totalCount / groupCount);
      this.designs.push({
        index: i,
        cnt: totalCount / groupCount,
        idStart: startStep + i * stepSize,
        idStep: stepSize,
        // reward,
        reward: shuffle(reward),
      });
    }
  };
}
