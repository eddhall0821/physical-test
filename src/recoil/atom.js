import { atom, selector } from "recoil";
import { INCH_24_HEIGHT, INCH_24_WIDTH } from "../components/MTP/MTPCanvas";

//recoil state 생성

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
    userInput: 1000,
    measurement: 1000,
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

    //width < screen width
    //height < screen height
    //screened out
    const top = (window.screen.height - height) / 2;
    const left = (window.screen.width - width) / 2;

    return {
      width,
      height,
      top,
      left,
    };
  },
});
