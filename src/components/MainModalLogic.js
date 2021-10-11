//racfe
import { useState } from "react";
import apiClient from "../service/api/api";
import CheckIn from "./modals/CheckIn";
import EditEvent from "./modals/EditEvent";
import NewEvent from "./modals/NewEvent";
import UpdateStatus from "./modals/UpdateStatus";
import { useSelector, useDispatch } from "react-redux";
// import { setModal } from "../actions";
// import { useSelector } from "react-redux";

const MainModalLogic = ({ setIsLoading, toast, reloadCalendar }) => {
  const [showMainModal, setShowMainModal] = useState(false);
  const [mainModalData, setMainModalData] = useState();
  const [status, setStatus] = useState();
  const modal = useSelector((state) => state.modal);
  // const dispatch = useDispatch();
  const selectedDepot = useSelector((state) => state.depot);

  const handleShowMainModal = (id, status, date) => {
    setIsLoading(true);
    setStatus(status);

    // setTimeout(pullDataFromAPI, 0);

    // check if new event, if so set defaut data values
    if (id === 0) {
      setMainModalData({
        asset_id: 0,
        customer_id: 0,
        description: " ",
        allowed_time: 0,
        booked_date_time: date,
        others: "",
        status: "booked",
        waiting: 0,
        depot: selectedDepot,
      });
      setShowMainModal(true);
      setIsLoading(false);
    } else {
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
    }
    // }
  };

  const handleCloseMainModal = () => {
    setShowMainModal(false);
  };

  const CheckInModal = () => {
    // console.log(modal);
    if (modal === "edit") {
      return (
        <EditEvent
          data={mainModalData}
          handleCloseMainModal={handleCloseMainModal}
          toast={toast}
          reloadCalendar={reloadCalendar}
        />
      );
    } else if (modal === "new") {
      return (
        <NewEvent
          data={mainModalData}
          handleCloseMainModal={handleCloseMainModal}
          toast={toast}
          reloadCalendar={reloadCalendar}
        />
      );
    }
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
