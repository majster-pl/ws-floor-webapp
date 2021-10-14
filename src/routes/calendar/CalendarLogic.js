import moment from "moment";
import { useState, useEffect } from "react";
import apiClient from "../../service/api/api";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

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
  // const [dateFormat, setDateFormat] = useState("YYYY-MM-DD");
  // const depot = useSelector((state) => state.depot);

  // useEffect(() => {
  //   console.log(moment(currentDate).format("YYYY-MM-DD 00:01"));
  // }, [currentDate]);

  // Loading calendar from api when currentDate changes
  const url =
    "/api/v1/events?days=" +
    numberOfDays +
    "&from=" +
    moment(currentDate).format("YYYY-MM-DD 00:01") +
    "&format=grid" +
    (sessionStorage.getItem("selected_depot")
      ? "&depot=" + sessionStorage.getItem("selected_depot")
      : "");

  useEffect(() => {
    // console.log('RELAODING ??');

    setIsLoading(true);

    apiClient
      .get(url)
      .then((response) => {
        setIsLoading(false);
        // console.log("CalendarLogic: currentDate changed useState???");
        console.log(response);

        setTableData([...response.data.data]);
      })

      .catch((error) => {
        setIsLoading(false);
      });
    // setSilentReload(false);
  }, [currentDate]);

  const siletReload = (current_Date) => {
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

  function reloadCalendar() {
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
    tableData,
    numberOfDays,
    setNumberOfDays,
    isCalendarLoading,
    reloadCalendar,
    siletReload,
    setTableData,
  };
};

export default CalendarLogic;
