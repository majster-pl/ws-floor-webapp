import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import apiClient from "../../../service/api/api";
import * as EmailValidator from "email-validator";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setDepotsList, setDepot, setUser } from "../../../actions";
import { useDispatch } from "react-redux";

const LoginLogic = ({ setLoggedIn }, setIsLoading, setLoginErrorMsg, toast) => {
  const [username, setUsername] = useState("admin@gmail.com");
  const [password, setPassword] = useState("password");
  const [isSpinning, setIsSpinning] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const dispatch = useDispatch();

  const history = useHistory();

  if (sessionStorage.getItem("redirect_path") === null) {
    sessionStorage.setItem("redirect_path", "/dashboard");
  }

  useEffect(() => {
    apiClient
      .get("/api/v1/logged-in")
      .then(() => {
        history.push(sessionStorage.getItem("redirect_path"));
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const getUserDepots = () => {
    apiClient
      .get("/api/v1/depot")
      .then((response) => {
        dispatch(setDepotsList(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const submitLoginForm = (e) => {
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
        // console.log("HEERE I AM!");
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
                // console.log(response.data);
                dispatch(setDepot(response.data.default_branch));
                dispatch(setUser(response.data));
                sessionStorage.setItem(
                  "selected_depot",
                  response.data.default_branch
                );

                toast.success("Welcome back " + response.data.name + "!");
                // history.push("/dashboard");
                history.push(sessionStorage.getItem("redirect_path"));
                getUserDepots();
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
                // console.log("Error: " + JSON.stringify(err));
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
    submitLoginForm,
    setUsername,
    setPassword,
    isSpinning,
    isEmailValid,
    isPasswordValid,
  };
};

export default LoginLogic;
