import { useRecoilValue } from "recoil";
import { dpiState, ppiState } from "../../recoil/atom";
import { INCH_24_HEIGHT, INCH_24_WIDTH } from "../MTP/MTPCanvas";

const ScreenCheck = () => {
  const ppi = useRecoilValue(ppiState);
  const dpi = useRecoilValue(dpiState);

  return (
    <div
      style={{
        width: ppi * INCH_24_WIDTH,
        height: ppi * INCH_24_HEIGHT,
        position: "fixed",
        background: "#ababab",
      }}
    >
      {`PPI: ${ppi} DPI: ${dpi.measurement}`}
    </div>
  );
};

export default ScreenCheck;
