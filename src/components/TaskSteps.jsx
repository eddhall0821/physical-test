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
        { title: "Pre-task" },
        { title: "Preliminary Survey" },
        { title: "Main Task" },
      ]}
    >
      {children}
    </Steps>
  );
};

export default TaskSteps;
