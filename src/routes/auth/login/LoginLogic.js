import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import apiClient from "../../../service/api/api";
import IsLoggedIn from "../../../components/CheckIfLoggedIn";

const LoginLogic = ({ setLoggedIn }) => {
  const [username, setUsername] = useState("admin@gmail.com");
  const [password, setPassword] = useState("password");

//   IsLoggedIn(); 

  const history = useHistory();

//   useEffect(() => {
//     if (sessionStorage.getItem("loggedIn") == "true") {
//       history.push("/dashboard");
//     } else {
//       history.push("/login");
//     }
//   }, []);

  const sendGetRequest = (e) => {
    e.preventDefault();
    apiClient.get("/sanctum/csrf-cookie").then((response) => {
      apiClient
        .post("/login", {
          email: username,
          password: password,
        })
        .then((response) => {
          setLoggedIn(true);
          sessionStorage.setItem("loggedIn", true);
          console.log(response);
          history.push("/dashboard");
        })
        .catch((err) => {
          console.log("Error: ", err);
        });
    });
  };
  return { username, password, sendGetRequest, setUsername, setPassword };
};

export default LoginLogic;
