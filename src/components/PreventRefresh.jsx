import QueryString from "qs";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { prolificUserState } from "../recoil/atom";

const usePreventRefresh = () => {
  const location = useLocation();
  const prolificUser = useRecoilValue(prolificUserState);

  const preventClose = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  useEffect(() => {
    (() => {
      window.addEventListener("beforeunload", preventClose);
    })();

    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  });
};

export default usePreventRefresh;
