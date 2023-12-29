import { getWdithByIDAndDistance, shuffle } from "../../utils";
import { INCH_24_HEIGHT } from "./MTPCanvas";

export class Balls {
  designs = [];
  randomDesignArray = [];

  generateRandomDesigns = function () {
    let randomDesignArray = [];
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
        });
      }
    }
    this.randomDesignArray = shuffle(randomDesignArray);
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

  init = function ({ groupCount, stepSize, startStep, totalCount }) {
    this.designs = [];
    for (let i = 0; i < groupCount; i++) {
      this.designs.push({
        index: i,
        cnt: totalCount / groupCount,
        idStart: startStep + i * stepSize,
        idStep: stepSize,
      });
    }
  };
}
