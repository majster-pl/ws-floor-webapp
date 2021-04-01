import { useHistory } from "react-router";
import { useEffect, useState } from "react";
import apiClient from "../service/api/api";
import Cookies from "js-cookie";

const CheckIfLoggedIn = ({ setLoggedIn }) => {
  const history = useHistory();

  const logout = () => {
    setLoggedIn(false);
    history.push("/login");
    Cookies.remove("logged-in", { path: "" });
  }

  const isUserLoggedIn = () => {
    apiClient
      .get("/api/v1/logged-in", { withCredentials: true })
      .catch((err) => {
        logout();
      });
  };
  useEffect(() => {
    isUserLoggedIn();
    if (Cookies.get("looged-in") == "false") {
      logout();
    }
  }, []);
};

export default CheckIfLoggedIn;
