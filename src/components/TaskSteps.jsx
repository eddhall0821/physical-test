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
        { title: "Monitor Measure" },
        { title: "Mouse Measure" },
        { title: "Pre-Task" },
        { title: "Preliminary Survey" },
        { title: "Main Task" },
      ]}
    >
      {children}
    </Steps>
  );
};

export default TaskSteps;
