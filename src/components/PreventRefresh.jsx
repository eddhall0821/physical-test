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

  const onPopState = () => {};

  useEffect(() => {
    (() => {
      window.addEventListener("onpopstate ", onPopState);
      window.addEventListener("beforeunload", preventClose);
    })();

    return () => {
      window.addEventListener("onpopstate ", onPopState);
      window.removeEventListener("beforeunload", preventClose);
    };
  });
};

export default usePreventRefresh;
