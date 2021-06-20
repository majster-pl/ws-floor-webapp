import moment from "moment";
// import {apiClient} from "../../../service/api/api";

const TableHeaderLogic = (
  currentDate,
  setCurrentDate,
  numberOfDays,
  setNumberOfDays
) => {
  // disable all days enable only mondays to be selected on calendar picker
  const isMonday = (date) => {
    const day = moment(date).day();
    return day === 1;
  };

  // When new date selected from date picker
  const handleDateChange = (currentDate) => {
    setCurrentDate(moment(currentDate, "DD-MM-YYYY").startOf("isoWeek"));
  };
  // Date navigation buttons
  const handleClickNext = () => {
    setCurrentDate(moment(currentDate, "DD-MM-YYYY").add(numberOfDays, "days"));
  };
  const handleClickPrevious = () => {
    setCurrentDate(
      moment(currentDate, "DD-MM-YYYY").subtract(numberOfDays, "days")
    );
  };

  // when user change numebr of days in a calendars header
  const handleNumberOfDaysChange = (param) => {
    setNumberOfDays(param);
  };

  return {
    isMonday,
    handleDateChange,
    handleClickNext,
    handleClickPrevious,
    handleNumberOfDaysChange,
  };
};

export default TableHeaderLogic;
