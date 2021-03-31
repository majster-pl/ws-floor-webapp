import { useHistory } from "react-router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import apiClient from "../service/api/api";

const CheckIfLoggedIn = ({ setLoggedIn }) => {
  const history = useHistory();

  const isUserLoggedIn = () => {
    apiClient
      .get("/api/v1/logged-in", { withCredentials: true })
      .catch((err) => {
        setLoggedIn(false);
        history.push("/login");
      });
  };
  useEffect(() => {
    isUserLoggedIn();
    if (sessionStorage.getItem("loggedIn") == "false") {
      // setLoggedIn(false);
      history.push("/login");
    }
  }, []);
};

export default CheckIfLoggedIn;
