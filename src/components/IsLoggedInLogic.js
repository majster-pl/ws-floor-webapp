//racfe
import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Spinner } from "react-bootstrap";
import apiClient from "../service/api/api";
// import Cookies from "js-cookie";

const IsLoggedIn = ({setLoggedIn}) => {
  const [isLoading, setLoading] = useState(true);
  // const [_isLoggedIn, _setIsLoggedIn] = useState(true);
  const history = useHistory();

  useEffect(() => {
    apiClient
      .get("/api/v1/logged-in", { withCredentials: true })
      .then(() => {
        setLoading(false);
        // _setIsLoggedIn(true);
        setLoggedIn(true);
      })
      .catch(() => {
        // setLoading(false);
        setLoggedIn(false);
        // history.push("/login");
        // _setIsLoggedIn(false);
      });
  }, []);

  // if (!_isLoggedIn) {
  //   history.push("/login");
  // }

  // useEffect(() => {
  //   setLoggedIn(_isLoggedIn);
  // }, [_isLoggedIn]);

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
