import moment from "moment";
import { useState, useEffect } from "react";
import apiClient from "../../service/api/api";
import { useHistory } from "react-router-dom";

const CalendarLogic = ({
  toast,
  setIsLoading,
  // currentDate,
  // setCurrentDate,
}) => {
  const history = useHistory();
  const todaysDate = moment().startOf("isoWeek");
  const [currentDate, setCurrentDate] = useState(() => {
    return todaysDate;
  });
  const [numberOfDays, setNumberOfDays] = useState(() => {
    return 7;
  });
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [dateFormat, setDateFormat] = useState("YYYY-MM-DD");
  // modal
  const [modalData, setModalData] = useState({
    new_booking: false,
    booked_date_time: null,
  });
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // useEffect(() => {
  //   console.log(moment(currentDate).format("YYYY-MM-DD 00:01"));
  // }, [currentDate]);

  // Loading calendar from api when currentDate changes
  useEffect(() => {
    const url =
      "/api/v1/events?days=" +
      numberOfDays +
      "&from=" +
      moment(currentDate).format("YYYY-MM-DD 00:01") +
      "&format=grid";

    // console.log('RELAODING ??');

    setIsLoading(true);

    apiClient
      .get(url)
      .then((response) => {
        setIsLoading(false);
        console.log("CalendarLogic: currentDate changed useState???");
        console.log(response);

        setTableData([...response.data.data]);
      })

      .catch((error) => {
        setIsLoading(false);
      });
    // setSilentReload(false);
  }, [currentDate]);

  const siletReload = (current_Date) => {
    console.log("silent reload calendar...");
    console.log("currentDate: " + moment(current_Date).format("D-M-yyyy"));

    const url =
      "/api/v1/events?days=" +
      numberOfDays +
      "&from=" +
      moment(current_Date).format("YYYY-MM-DD 00:01") +
      "&format=grid";

    // console.log('RELAODING ??');

    console.log("URL: " + url);

    // silentReload ? setIsLoading(false) : setIsLoading(true);

    apiClient
      .get(url)
      .then((response) => {
        // console.log(response);
        setIsLoading(false);
        setTableData(response.data.data);
      })

      .catch((error) => {
        setIsLoading(false);
      });
  };

  // Modal handler
  const handleModalOpen = (date, eventId) => {
    setIsLoading(true);

    if (!date) {
      let url = "/api/v1/events/" + eventId;

      apiClient
        .get(url)
        .then((response) => {
          // setTableData(response.data.data);
          // console.log(response.data);
          setModalData(response.data.data);
          setShowModal(true);
          setIsLoading(false);
        })
        .catch((err) => {
          // console.log("UUU...");
          setIsLoading(false);
          toast.error("Error: " + err.data.message);
          history.push("/login");
        });
    } else {
      setModalData({
        new_booking: true,
        booked_date_time: date,
      });
      setShowModal(true);
      setIsLoading(false);
    }
  };

  function reloadCalendar() {
    // console.log("reloading calendar!");
    // setCurrentDate(moment(currentDate, "DD-MM-YYYY"));
    const url =
      "/api/v1/events?days=" +
      numberOfDays +
      "&from=" +
      moment(currentDate).format("YYYY-MM-DD 00:01") +
      "&format=grid";

    // console.log('RELAODING ??');

    // silentReload ? setIsLoading(false) : setIsLoading(true);
    setIsLoading(true);

    apiClient
      .get(url)
      .then((response) => {
        setIsLoading(false);
        setTableData([...response.data.data]);
      })

      .catch((error) => {
        setIsLoading(false);
      });
  }

  return {
    currentDate,
    setCurrentDate,
    searchQuery,
    setSearchQuery,
    handleModalOpen,
    showModal,
    handleCloseModal,
    tableData,
    numberOfDays,
    setNumberOfDays,
    isCalendarLoading,
    modalData,
    setModalData,
    reloadCalendar,
    siletReload,
  };
};

export default CalendarLogic;
