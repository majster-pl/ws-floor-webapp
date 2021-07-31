//racfe
import { useState, useEffect } from "react";
import { Form, Modal, Row, Col, Button } from "react-bootstrap";
import apiClient from "../service/api/api";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import CheckIn from "./modals/CheckIn";

const MainModalLogic = ({ setIsLoading }) => {
  const [showMainModal, setShowMainModal] = useState(false);
  const [mainModalData, setMainModalData] = useState();
  const [status, setStatus] = useState();

  const handleShowMainModal = (id, status, data) => {
    setIsLoading(true);
    setMainModalData(data);
    setStatus(status);
    setShowMainModal(true);
    setIsLoading(false);

    console.log(id, status);
    // console.log(data);

    // let url = "/api/v1/events/" + id;

    // setTimeout(doSomething, 10);

    // function doSomething() {
    //   apiClient
    //     .get(url)
    //     .then((response) => {
    //       // setTableData(response.data.data);
    //       //   console.log(response.data);
    //       setMainModalData(response.data.data);
    //       // setShowModal(true);
    //       setIsLoading(false);
    //     })
    //     .catch((err) => {
    //       console.log("UUU...");
    //       // setIsLoading(false);
    //       // toast.error("Error" + JSON.stringify(err));
    //       // history.push("/login");
    //     });

    // }
  };

  const handleCloseMainModal = () => {
    setShowMainModal(false);
  };

  const CheckInModal = () => {
    switch (status) {
      case "booked":
        return (
          <CheckIn
            data={mainModalData}
            handleCloseMainModal={handleCloseMainModal}
          />
        );
        break;

      case "awaiting_labour":
        return <h3>awaiting_labour</h3>;

      default:
        break;
    }
  };

  return {
    handleShowMainModal,
    handleCloseMainModal,
    showMainModal,
    CheckInModal,
  };
};

export default MainModalLogic;
