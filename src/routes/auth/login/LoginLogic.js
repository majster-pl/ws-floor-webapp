import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import apiClient from "../../../service/api/api";
import * as EmailValidator from "email-validator";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginLogic = ({ setLoggedIn }, setIsLoading, setLoginErrorMsg, toast) => {
  const [username, setUsername] = useState("admin@gmail.com");
  const [password, setPassword] = useState("password");
  const [isSpinning, setIsSpinning] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const history = useHistory();

  // console.log("eee? -- " + setLoginErrorMsg);

  const goToLastPage = () => {
    console.log("checking history", window.history.length);

    console.log("CURRENT PATH:", window.location.pathname);

    // for (var i = 0; i > window.history.length; i++) {
    //   // console.log(window.history[i]);
    //   console.log(window.history[3]);
    // }
  };
  if (sessionStorage.getItem("redirect_path") === null) {
    sessionStorage.setItem("redirect_path", "/dashboard");
  }
  // goToLastPage();

  useEffect(() => {
    apiClient
      .get("/api/v1/logged-in")
      .then(() => {
        // history.push("/dashboard");
        history.push(sessionStorage.getItem("redirect_path"));
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, []);

  const sendGetRequest = (e) => {
    e.preventDefault();
    setIsEmailValid(true);
    setIsPasswordValid(true);
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
    // sessionStorage.setItem("apiError", "");
    setIsSpinning(true);
    apiClient
      .get("/sanctum/csrf-cookie")
      .then((res) => {
        // console.log(res);
        console.log("HEERE I AM!");
        apiClient
          .post("/login", {
            email: username,
            password: password,
          })
          .then((response) => {
            setLoggedIn(true);
            console.log("response: " + response);
            // sessionStorage.setItem("isLoggedIn", "true");
            sessionStorage.setItem("loginStatus", "true");

            history.push(sessionStorage.getItem("redirect_path"));
            // history.go(-2);
          })
          .catch((err) => {
            // history.push("/dashboard");
            // WORKAROUND: when user logged in, server throwing empty response until
            // next request from server, check if looged in then redirect
            setIsSpinning(false);
            apiClient
              .get("/api/v1/logged-in")
              .then((response) => {
                sessionStorage.setItem("loginStatus", "true");
                toast.success("Welcome back " + response.data.name + "!");
                // history.push("/dashboard");
                history.push(sessionStorage.getItem("redirect_path"));
              })
              .catch((err) => {
                if (typeof err.data.errors === "object") {
                  // check if email error present
                  if (typeof err.data.errors.email === "object") {
                    setLoginErrorMsg(err.data.errors.email);
                  }
                  // check if password error message present
                  if (typeof err.data.errors.password === "object") {
                    setLoginErrorMsg(err.data.errors.password);
                  }
                } else {
                  // any other error
                  setLoginErrorMsg(err.data.message);
                }
                console.log("Error2 is: " + JSON.stringify(err));
              });
          });
      })
      .catch(() => {
        setIsSpinning(false);
        setLoginErrorMsg("API connection error, try again later.");
      });
  };
  return {
    username,
    password,
    sendGetRequest,
    setUsername,
    setPassword,
    isSpinning,
    isEmailValid,
    isPasswordValid,
  };
};

export default LoginLogic;
