import moment from "moment";
import { useState, useEffect } from "react";
import apiClient from "../../service/api/api";

const CalendarLogic = () => {
  const todaysDate = moment().startOf("isoweek");
  const [currentDate, setCurrentDate] = useState(todaysDate);
  const [numberOfDays, setNumberOfDays] = useState(7);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);
  const [dateFormat, setDateFormat] = useState("YYYY-MM-DD");
  // modal
  const [modalData, setModalData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => {
    setModalData([]);
    setShowModal(false);
  };

  // function to turn off spinner
  useEffect(() => {
    setIsCalendarLoading(false);
  }, [tableData]);

  // useEffect(() => {
  //   console.log("=====================================================");
  //   console.log("todaysDate:", new Date(moment(todaysDate)));
  //   console.log("currentDate:", new Date(moment(currentDate)));
  //   console.log("searchQuery:", searchQuery);
  //   console.log("showModal:", showModal);
  //   console.log("modalEditData:", modalEditData);
  //   // console.log('searchQuery:', searchQuery);
  // }, []);

  // Loading calendar from api when currentDate changes
  useEffect(() => {
    setIsCalendarLoading(true);
    const url =
      "/api/v1/events?days=" +
      numberOfDays +
      "&from=" +
      moment(currentDate).format("YYYY-MM-DD") +
      "&format=grid";

    apiClient.get(url).then((response) => {
      setTableData(response.data.data);
      // console.log(response.data);
    });
  }, [currentDate, numberOfDays, dateFormat]);

  // Modal handler
  const handleModalOpen = (date, eventId) => {
    if (!date) {
      let url = "/api/v1/events/" + eventId;

      apiClient.get(url).then((response) => {
        // setTableData(response.data.data);
        // console.log(response.data);
        setModalData(response.data.data);
        setShowModal(true);
      });
    } else {
      setModalData({
        new_booking: true,
        booked_date: date,
      });
      setShowModal(true);
    }

    // console.log(initialFormData);
    // setModalEventId(initialFormData);
    // showModal();
    // setShowModal(true);
    // console.log('show modal here?');
  };

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
  };
};

export default CalendarLogic;
