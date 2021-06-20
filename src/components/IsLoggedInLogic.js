//racfe
import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import apiClient from "../service/api/api";
import { useHistory } from "react-router-dom";

const IsLoggedIn = (setLoginErrorMsg, setLoggedIn) => {
  const [isLoading, setLoading] = useState(true);
  const history = useHistory();

  //check if user still logged in
  const checkIfAuthenticated = () => {
    apiClient
      .get("/api/v1/logged-in", { withCredentials: true })
      .then(() => {
        sessionStorage.setItem("loginStatus", "true");
        setLoggedIn(true);
        setLoading(false);
      })
      .catch((error) => {
        setLoggedIn(false);
        history.push("/login");
        // if user was logged in return message that he is not
        // longer logged in, otherwise return server error.
        switch (sessionStorage.getItem("loginStatus")) {
          case "true":
            setLoginErrorMsg(
              "You are no longer logged in, please log in again."
            );
            break;

          default:
            setLoginErrorMsg(error.data.message);
            break;
        }
        sessionStorage.setItem("loginStatus", "false");
      });
  };

  // run below every time this component is mounted
  useEffect(() => {
    console.log("I'm running!!");

    checkIfAuthenticated();
  }, []);

  const SpinnerComponent = () => {
    return (
      <div className="div-center">
        <Spinner
          className="mx-1"
          animation="grow"
          variant="primary"
          size="sm"
        />
        <Spinner className="mx-1" animation="grow" variant="success" />
        <Spinner className="mx-1" animation="grow" variant="danger" size="sm" />
      </div>
    );
  };

  return {
    isLoading,
    SpinnerComponent,
  };
};

export default IsLoggedIn;
