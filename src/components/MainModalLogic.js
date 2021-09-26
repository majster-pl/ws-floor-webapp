//racfe
import { useState } from "react";
import apiClient from "../service/api/api";
import CheckIn from "./modals/CheckIn";
import UpdateStatus from "./modals/UpdateStatus";

const MainModalLogic = ({ setIsLoading, toast, reloadCalendar }) => {
  const [showMainModal, setShowMainModal] = useState(false);
  const [mainModalData, setMainModalData] = useState();
  const [status, setStatus] = useState();

  const handleShowMainModal = (id, status, data) => {
    setIsLoading(true);
    setStatus(status);

    // setTimeout(pullDataFromAPI, 0);

    let url = "/api/v1/events/" + id;
    // function pullDataFromAPI() {
    apiClient
      .get(url)
      .then((response) => {
        setMainModalData(response.data.data);
        setShowMainModal(true);
        setIsLoading(false);
        //   window.location.reload();
      })
      .catch((err) => {
        console.log("UUU...");
        setShowMainModal(true);
        setIsLoading(false);
      });
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
