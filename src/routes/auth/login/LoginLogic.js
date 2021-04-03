import { useState } from "react";
import { useHistory } from "react-router";
import apiClient from "../../../service/api/api";
// import IsLoggedIn from "../../../components/CheckIfLoggedIn";
import Cookies from "js-cookie";

const LoginLogic = ({ setLoggedIn }) => {
  const [username, setUsername] = useState("admin@gmail.com");
  const [password, setPassword] = useState("password");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setLoading] = useState(false);

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
    setErrorMessage("");
    setLoading(true);
    apiClient.get("/sanctum/csrf-cookie").then((response) => {
      apiClient
        .post("/login", {
          email: username,
          password: password,
        })
        .then((response) => {
          setLoggedIn(true);
          localStorage.setItem("loggedIn", true);
          console.log(response);
          Cookies.set("logged-in", "true", { path: "" });
          history.push("/dashboard");
        })
        .catch((err) => {
          setLoading(false);
          // console.log("Error: ", err.response.data);
          // console.log("Message: ", err.response.data.message);
          // console.log("Error: ", err.response.status);
          // console.log("Email Error: ", err.response.data.errors.email);
          // console.log("Password Error: ", err.response.data.errors.password);
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
  };
};

export default LoginLogic;
