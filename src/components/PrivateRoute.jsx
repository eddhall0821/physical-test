import { useRecoilValue } from "recoil";
import { prolificUserState } from "../recoil/atom";
import { Navigate, redirect, useLocation, useNavigate } from "react-router-dom";
import QueryString from "qs";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const prolificUser = useRecoilValue(prolificUserState);
  const location = useLocation();

  if (prolificUser.PROLIFIC_PID !== "") {
    return <>{children}</>;
  } else {
    const qs = QueryString.parse(location.search, { ignoreQueryPrefix: true });
    return (
      <Navigate
        to={`/monitor?PROLIFIC_PID=${qs.PROLIFIC_PID}&STUDY_ID=${qs.STUDY_ID}&SESSION_ID=${qs.SESSION_ID}`}
      />
    );
  }
};

export default PrivateRoute;
