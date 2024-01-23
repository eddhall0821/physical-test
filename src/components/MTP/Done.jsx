import { Button, Result } from "antd";
import { useEffect } from "react";

const Done = () => {
  useEffect(() => {
    setTimeout(() => {
      window.location.replace(
        "https://app.prolific.com/submissions/complete?cc=CSE63DRO"
      );
    }, 5000);
  }, []);
  return (
    <Result
      status="success"
      title={
        <>
          Study Done!
          <br />
          Your Completion Code is <b style={{ color: "#1677ff" }}>CSE63DRO</b>
        </>
      }
      subTitle="The study will automatically complete in 5 seconds."
      extra={[
        <Button type="primary" key="console">
          Finish Task
        </Button>,
      ]}
    ></Result>
  );
};

export default Done;
