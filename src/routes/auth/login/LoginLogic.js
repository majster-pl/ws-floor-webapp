import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import apiClient from "../../../service/api/api";
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
    apiClient.get("/api/v1/logged-in").then(() => {
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
    if (err) {
      return false;
    }
    sessionStorage.setItem("loginError", "");
    setLoading(true);
    apiClient
      .get("/sanctum/csrf-cookie")
      .then(() => {
        apiClient
          .post("/login", {
            email: username,
            password: password,
          })
          .then((response) => {
            setLoggedIn(true);
            console.log(response);
            sessionStorage.setItem("isLoggedIn", "true");
            history.push("/dashboard");
          })
          .catch((err) => {
            setLoading(false);
            if (typeof err.response.data.errors === "object") {
              // check if email error present
              if (typeof err.response.data.errors.email === "object") {
                setErrorMessage(err.response.data.errors.email);
              }
              // check if password error message present
              if (typeof err.response.data.errors.password === "object") {
                setErrorMessage(err.response.data.errors.password);
              }
            } else {
              // any other error
              setErrorMessage(err.response.data.message);
            }
          });
      })
      .catch(() => {
        setLoading(false);
        setErrorMessage("ERR_CONNECTION_REFUSED");
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
