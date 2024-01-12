import { Space, Steps } from "antd";
import { Content, Header } from "antd/es/layout/layout";

const TaskSteps = ({ children, current }) => {
  return (
    <Steps
      style={{
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 30,
      }}
      current={current}
      items={[
        { title: "Monitor Measure" },
        { title: "Mouse Measure" },
        { title: "Pre-Tasks" },
        { title: "User Survey" },
        { title: "Main Tasks" },
      ]}
    >
      {children}
    </Steps>
  );
};

export default TaskSteps;
