import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import apiClient from "../service/api/api";
import { useHistory } from "react-router-dom";
import React from "react";

const MainModal = ({ show, handleClose, form, setLoginErrorMsg, toast }) => {
  const history = useHistory();
  const [authenticated, setAuthenticated] = useState(true);
  const toastId = React.useRef(null);
  const customId = "toast-main-modal";

  useEffect(() => {
    const notify = (msg) => {
      toast.error(msg, {
        toastId: customId,
      });
    };

    //check if user still logged in
    const checkIfAuthenticated = () => {
      apiClient
        .get("/api/v1/logged-in", { withCredentials: true })
        .then(() => {
          setAuthenticated(true);
        })
        .catch((error) => {
          setAuthenticated(false);
          setLoginErrorMsg("You are no longer logged in, please log in again.");
          sessionStorage.setItem("loginStatus", "false");
          notify("Error message: " + error.data.message);
          history.push("/login");
        });
    };
    if (show) checkIfAuthenticated();
  }, [show, handleClose]);

  if (authenticated) {
    return (
      <Modal show={show} onHide={handleClose}>
        {form}
      </Modal>
    );
  } else {
    return <></>;
  }
};

export default MainModal;
