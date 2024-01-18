import { atom, selector } from "recoil";
import { INCH_24_HEIGHT, INCH_24_WIDTH } from "../components/MTP/MTPCanvas";
import { findLargest16by9Rectangle } from "../utils";

//recoil state 생성
export const prolificUserState = atom({
  key: "prolificUserState",
  default: {
    PROLIFIC_PID: "",
    SESSION_ID: "",
    STUDY_ID: "",
  },
});
export const monitorState = atom({
  key: "monitorState",
  default: {
    scale: 1,
    ppi: 96,
  },
});

export const monitorWidthInState = selector({
  key: "monitorWidthInState",
  get: ({ get }) => {
    const monitor = get(monitorState);
    return window.screen.width / 96 / monitor.scale;
  },
});

export const monitorHeightInState = selector({
  key: "monitorHeightInState",
  get: ({ get }) => {
    const monitor = get(monitorState);
    return window.screen.height / 96 / monitor.scale;
  },
});

export const ppiState = selector({
  key: "ppiState",
  get: ({ get }) => {
    const width_in = get(monitorWidthInState);
    return Math.round(window.screen.width / width_in);
  },
});

export const ENUM = {
  IS_USER_KNOW: "isUserKnow",
  MEASUREMENT: "measurement",
  USER_INPUT: "userInput",
};

export const dpiState = atom({
  key: "dpiState",
  default: {
    isUserKnow: true,
    userInput: 0,
    measurement: 0,
    // measurement: 1000,
  },
});

export const pointerWeightState = selector({
  key: "pointerWeightState",
  get: ({ get }) => {
    const ppi = get(ppiState);
    const dpi = get(dpiState);
    return ppi / dpi.measurement / window.devicePixelRatio;
  },
});

export const mointorBoundState = selector({
  key: "mointorBoundState",
  get: ({ get }) => {
    const ppi = get(ppiState);
    const width = ppi * INCH_24_WIDTH;
    const height = ppi * INCH_24_HEIGHT;
    const top = (window.screen.height - height) / 2;
    const left = (window.screen.width - width) / 2;

    const smallMonitor = findLargest16by9Rectangle(
      window.screen.width,
      window.screen.height
    );
    if (
      width < window.screen.width &&
      height < window.screen.height &&
      top > 0 &&
      left > 0
    )
      return {
        width: Math.round(width),
        height: Math.round(height),
        top: Math.round(top),
        left: Math.round(left),
      };
    else {
      return smallMonitor;
    }
  },
});

export const skillTestState = atom({
  key: "skillTestState",
  default: {
    target_radius: 0.1,
    ball_distance: [
      0.1,
      0.3,
      0.7,
      1.5,
      3.1,
      6.2,
      12.7, //group1
      0.1,
      0.3,
      0.7,
      1.5,
      3.1,
      6.2,
      12.7, //group2
      0.1,
      0.3,
      0.7,
      1.5,
      3.1,
      6.2,
      12.7, //group3
    ],
    measurement: [],
  },
});

export const docIdState = atom({
  key: "docIdState",
  default: "",
});

export const behaviorLogState = atom({
  key: "behaviorLogState",
  default: {
    monitor: [],
  },
});
