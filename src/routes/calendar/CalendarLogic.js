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
  const [modalEditData, setModalEditData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => {
    setModalEditData([]);
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
    const url = "/api/v1/events?days="+numberOfDays+"&from="+moment(currentDate).format('YYYY-MM-DD') +"&format=grid";

    apiClient.get(url).then((response) => {
      setTableData(response.data.data);
      console.log(response.data);
    });
  }, [currentDate, numberOfDays, dateFormat]);

  // Modal handler
  const handleModalOpen = (date) => {
    console.log("add new pressed");
    const initialFormData = Object.freeze({
      id: undefined,
      veh_id: "",
      customer_id: "",
      description: "",
      others: "",
      allowed_time: "",
      booked_date: date,
      status: "",
    });
    // console.log(initialFormData);
    setModalEditData(initialFormData);
    // showModal();
    setShowModal(true);
    // console.log('show modal here?');
  };

  return {
    currentDate,
    setCurrentDate,
    searchQuery,
    setSearchQuery,
    handleModalOpen,
    showModal,
    setModalEditData,
    handleCloseModal,
    tableData,
    numberOfDays,
    setNumberOfDays,
    isCalendarLoading,
  };
};

export default CalendarLogic;
