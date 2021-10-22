//racfe
import { useState } from "react";
import apiClient from "../service/api/api";
import CheckIn from "./modals/CheckIn";
import EditEvent from "./modals/EditEvent";
import NewEvent from "./modals/NewEvent";
import UpdateStatus from "./modals/UpdateStatus";
import UpdateNotes from "./modals/UpdateNotes";
import Info from "./modals/Info";
import { useSelector, useDispatch } from "react-redux";
// import { reloadWorkshop } from "../actions";
// import { useSelector } from "react-redux";

const MainModalLogic = ({ setIsLoading, toast, reloadCalendar }) => {
  const [showMainModal, setShowMainModal] = useState(false);
  const [mainModalData, setMainModalData] = useState();
  const [status, setStatus] = useState();
  const modal = useSelector((state) => state.modal);
  const dispatch = useDispatch();
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
        breakdown: 0,
        waiting: 0,
        depot: selectedDepot,
        notification: 1,
      });
      setShowMainModal(true);
      setIsLoading(false);
    } else {
      let url = "/api/v1/events/" + id;
      // function pullDataFromAPI() {
      apiClient
        .get(url)
        .then((response) => {
          let data = response.data.data;
          // add/set notification to true
          data.notification = true;
          data.status = status;
          setMainModalData(data);
          setShowMainModal(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log("UUU...");
          console.log(err);

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
    switch (modal) {
      case "edit":
        return (
          <EditEvent
            data={mainModalData}
            handleCloseMainModal={handleCloseMainModal}
            toast={toast}
            reloadCalendar={reloadCalendar}
          />
        );

      case "new":
        return (
          <NewEvent
            data={mainModalData}
            handleCloseMainModal={handleCloseMainModal}
            toast={toast}
            reloadCalendar={reloadCalendar}
          />
        );

      case "update":
        return (
          <UpdateNotes
            data={mainModalData}
            handleCloseMainModal={handleCloseMainModal}
            toast={toast}
            reloadCalendar={reloadCalendar}
          />
        );

      case "info":
        return (
          <Info
            data={mainModalData}
            handleCloseMainModal={handleCloseMainModal}
            toast={toast}
            reloadCalendar={reloadCalendar}
          />
        );

      default:
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

          default:
            return (
              <UpdateStatus
                data={mainModalData}
                handleCloseMainModal={handleCloseMainModal}
                toast={toast}
                reloadCalendar={reloadCalendar}
              />
            );
        }
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
