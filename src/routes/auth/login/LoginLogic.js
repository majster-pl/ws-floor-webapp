import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import apiClient from "../../../service/api/api";
import Cookies from "js-cookie";
import * as EmailValidator from "email-validator";

const LoginLogic = ({ setLoggedIn }) => {
  const [username, setUsername] = useState("admin@gmail.com");
  const [password, setPassword] = useState("password");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const history = useHistory();

  useEffect(() => {
    apiClient.get("/api/v1/logged-in", { withCredentials: true }).then(() => {
      history.push("/dashboard");
    });
  }, []);

  const sendGetRequest = (e) => {
    e.preventDefault();
    setIsEmailValid(true);
    setIsPasswordValid(true);
    setErrorMessage("");
    let err = false;
    if (!EmailValidator.validate(username)) {
      setIsEmailValid(false);
      err = true;
    }
    if (password.length < 1) {
      setIsPasswordValid(false);
      err = true;
    }
    if(err) {
      return false;
    }
    setLoading(true);
    apiClient.get("/sanctum/csrf-cookie").then((response) => {
      apiClient
        .post("/login", {
          email: username,
          password: password,
        })
        .then((response) => {
          setLoggedIn(true);
          console.log(response);
          Cookies.set("logged-in", "true", { path: "" });
          history.push("/dashboard");
        })
        .catch((err) => {
          setLoading(false);
          if (err.response.data.errors.email !== undefined) {
            setErrorMessage(err.response.data.errors.email);
          }
          if (err.response.data.errors.password !== undefined) {
            setErrorMessage(err.response.data.errors.password);
          }
        });
    });
  };
  return {
    username,
    password,
    sendGetRequest,
    setUsername,
    setPassword,
    errorMessage,
    isLoading,
    isEmailValid,
    isPasswordValid,
  };
};

export default LoginLogic;
