import * as Comlink from "comlink";

const worker = {
  x: 50,
  y: 50,
  weight: 1,

  updateCoord(pos, delta, weight) {
    return pos + delta * weight;
  },

  updatePosition(
    movementX,
    movementY,
    monitorBound,
    screenWidth,
    screenHeight
  ) {
    this.x = this.updateCoord(this.x, movementX, this.weight);
    this.y = this.updateCoord(this.y, movementY, this.weight);

    // Mouse confinement logic
    if (this.x > screenWidth - monitorBound.right) {
      this.x = screenWidth - monitorBound.right;
    }
    if (this.y > screenHeight - monitorBound.bottom) {
      this.y = screenHeight - monitorBound.bottom;
    }
    if (this.x < monitorBound.left) {
      this.x = monitorBound.left;
    }
    if (this.y < monitorBound.top) {
      this.y = monitorBound.top;
    }

    return { x: this.x, y: this.y };
  },

  setWeight(weight) {
    this.weight = weight;
  },
};

Comlink.expose(worker);
