import { Steps } from "antd";

const TaskSteps = ({ children, current }) => {
  return (
    <Steps
      style={{
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 30,
        paddingBottom: 30,
      }}
      current={current}
      items={[
        { title: "Monitor Size Measurement" },
        { title: "Mouse Sensitivity Measurement" },
        { title: "Calibration Study" },
        { title: "Preliminary Survey" },
        { title: "Main Stidy" },
      ]}
    >
      {children}
    </Steps>
  );
};

export default TaskSteps;
