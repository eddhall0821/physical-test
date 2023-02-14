import { Text } from "react-konva";

const TIME = 5;
const Rest = ({ time = TIME }) => {
  return (
    <Text
      fontSize={50}
      text={`RESTING.... ${time}`}
      x={window.innerWidth / 3}
      y={window.innerHeight / 2}
    />
  );
};

export default Rest;
