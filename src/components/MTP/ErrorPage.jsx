import { Result } from "antd";
import { COMPLETE_CODE } from "./Done";

const ErrorPage = () => {
  return (
    <Result
      status="warning"
      title="There are some problems in uploading."
      subTitle={
        <p>
          An error occurred during the upload. The data file will be downloaded
          directly to your PC. please send the two downloaded files to{" "}
          <b>eddhall0821@yonsei.ac.kr</b> and we will process them. your
          completion code is {COMPLETE_CODE}.
        </p>
      }
    ></Result>
  );
};

export default ErrorPage;
