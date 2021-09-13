import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import TableHeader from "./components/TableHeader";
import CalendarNavbar from "./components/CalendarNavbar";
import Modal from "./components/Modal";
import TableBody from "./components/TableBody";
import "./Calendar.css";
import CalendarSpinner from "./components/CalendarSpinner";
import { useEffect } from "react";
import moment from "moment";

const Calendar = ({
  setIsLoading,
  setLoggedIn,
  toast,
  setLoginErrorMsg,
  handleShowMainModal,
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
}) => {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setIsLoading,
    setLoggedIn
  );

  const todaysDate = moment().startOf("isoWeek");
  useEffect(() => {
    reloadCalendar();
    setCurrentDate(todaysDate);
  }, []);

  return (
    <div className="calendar-main scroll">
      <CalendarNavbar
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        numberOfDays={numberOfDays}
        setNumberOfDays={setNumberOfDays}
      />
      <table className="calendar-table">
        <TableHeader
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          handleModalOpen={handleModalOpen}
          numberOfDays={numberOfDays}
          setNumberOfDays={setNumberOfDays}
        />

        {isCalendarLoading ? (
          <CalendarSpinner numberOfDays={numberOfDays} />
        ) : (
          <TableBody
            tableData={tableData}
            handleModalOpen={handleModalOpen}
            query={searchQuery}
            setIsLoading={setIsLoading}
            handleShowMainModal={handleShowMainModal}
          />
        )}
      </table>
      {showModal == true && (
        <Modal
          showModal={showModal}
          handleCloseModal={handleCloseModal}
          modalData={modalData}
          setModalData={setModalData}
          reloadCalendar={reloadCalendar}
          toast={toast}
        />
      )}
    </div>
  );
};

export default Calendar;
