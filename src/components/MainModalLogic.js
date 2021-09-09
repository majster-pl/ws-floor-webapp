//racfe
import { useState, useEffect } from "react";
import { Form, Modal, Row, Col, Button } from "react-bootstrap";
import apiClient from "../service/api/api";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import CheckIn from "./modals/CheckIn";
import UpdateStatus from "./modals/UpdateStatus";

const MainModalLogic = ({
  setIsLoading,
  toast,
  // handleSuccess,
  reloadCalendar,
  // handleReloadCalendar,
}) => {
  const [showMainModal, setShowMainModal] = useState(false);
  const [mainModalData, setMainModalData] = useState();
  const [status, setStatus] = useState();

  const handleShowMainModal = (id, status, data) => {
    setIsLoading(true);
    // setMainModalData(data);
    setStatus(status);
    // setShowMainModal(true);
    // setIsLoading(false);

    console.log(id, status);
    // console.log(data);

    setTimeout(doSomething, 10);

    let url = "/api/v1/events/" + id;
    function doSomething() {
      apiClient
        .get(url)
        .then((response) => {
          // setTableData(response.data.data);
          //   console.log(response.data);
          setMainModalData(response.data.data);
          setShowMainModal(true);
          // setShowModal(true);
          setIsLoading(false);
          //   window.location.reload();
        })
        .catch((err) => {
          console.log("UUU...");
          setIsLoading(false);
          toast.error("Error" + JSON.stringify(err));
          // history.push("/login");
        });
    }
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
            toast={toast}
            reloadCalendar={reloadCalendar}
          />
        );
        break;

      // case "awaiting_labour":
      //   return (
      //     <UpdateStatus
      //       data={mainModalData}
      //       handleCloseMainModal={handleCloseMainModal}
      //       toast={toast}
      //       reloadCalendar={reloadCalendar}
      //     />
      //   );
      //   break;

      default:
        return (
          <UpdateStatus
            data={mainModalData}
            handleCloseMainModal={handleCloseMainModal}
            toast={toast}
            reloadCalendar={reloadCalendar}
          />
        );

        break;
    }
  };

  return {
    handleShowMainModal,
    handleCloseMainModal,
    showMainModal,
    reloadCalendar,
    CheckInModal,
  };
};

export default MainModalLogic;
