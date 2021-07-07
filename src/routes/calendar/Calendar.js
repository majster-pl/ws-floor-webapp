import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import CalendarLogic from "./CalendarLogic";
import TableHeader from "./components/TableHeader";
import CalendarNavbar from "./components/CalendarNavbar";
import Modal from "./components/Modal";
import TableBody from "./components/TableBody";
import "./Calendar.css";
import CalendarSpinner from "./components/CalendarSpinner";

const Calendar = ({ setIsLoading, setLoggedIn, toast, setLoginErrorMsg }) => {
  const {
    currentDate,
    setCurrentDate,
    searchQuery,
    setSearchQuery,
    handleModalOpen,
    showModal,
    setModalEventId,
    handleCloseModal,
    handleShowModal,
    tableData,
    numberOfDays,
    setNumberOfDays,
    isCalendarLoading,
    modalData,
    setModalData,
    reloadCalendar,
  } = CalendarLogic({ toast, setIsLoading });

  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setIsLoading,
    setLoggedIn
  );

  // console.log("rendering calendar.js");

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
          // setCurrentDate={setCurrentDate}
          // searchQuery={searchQuery}
          // setSearchQuery={setSearchQuery}
          handleModalOpen={handleModalOpen}
          numberOfDays={numberOfDays}
          // setNumberOfDays={setNumberOfDays}
        />

        {isCalendarLoading ? (
          <CalendarSpinner numberOfDays={numberOfDays} />
        ) : (
          <TableBody
            setIsLoading={setIsLoading}
            tableData={tableData}
            setModalEditData={setModalEventId}
            handleModalOpen={handleModalOpen}
            handleShowModal={handleShowModal}
            handleCloseModal={handleCloseModal}
            query={searchQuery}
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
