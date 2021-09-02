import { useHistory } from "react-router";
import { useEffect } from "react";
import apiClient from "../service/api/api";
import Cookies from "js-cookie";

const CheckIfLoggedIn = ({ setLoggedIn }) => {
  const history = useHistory();

  useEffect(() => {
    function logout() {
      setLoggedIn(false);
      history.push("/login");
      Cookies.remove("logged-in", { path: "" });
    }

    apiClient
      .get("/api/v1/logged-in", { withCredentials: true })
      .catch((err) => {
        logout();
      });

    if (Cookies.get("looged-in") === "false") {
      logout();
    }
  }, []);
};

export default CheckIfLoggedIn;
