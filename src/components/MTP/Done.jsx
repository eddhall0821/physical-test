import { Button, Result } from "antd";
import { useEffect } from "react";
export const COMPLETE_CODE = "C173SHNI";

const Done = () => {
  useEffect(() => {
    setTimeout(() => {
      window.location.replace(
        `https://app.prolific.com/submissions/complete?cc=${COMPLETE_CODE}`
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
          Your Completion Code is{" "}
          <b style={{ color: "#1677ff" }}>{COMPLETE_CODE}</b>
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
