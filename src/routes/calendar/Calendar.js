import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import CalendarLogic from "./CalendarLogic";
import Header from "./components/Header";
import Modal from "./components/Modal";
import TableBody from "./components/TableBody";
import "./Calendar.css";
import CalendarSpinner from "./components/CalendarSpinner";

const Calendar = (setLoggedIn) => {
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(setLoggedIn);
  const {
    currentDate,
    setCurrentDate,
    searchQuery,
    setSearchQuery,
    handleModalOpen,
    showModal,
    setModalEditData,
    handleCloseModal,
    handleShowModal,
    tableData,
    numberOfDays,
    setNumberOfDays,
    isCalendarLoading,
  } = CalendarLogic();
  //   const { Header } = CalendarHeader();
  //if still waiting response from server then display spinner
  if (isLoading) {
    return <SpinnerComponent />;
  }

  return (
    <div className="calendar-main">
      <table className="calendar-table">
        <Header
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleModalOpen={handleModalOpen}
          numberOfDays={numberOfDays}
          setNumberOfDays={setNumberOfDays}
        />

        {isCalendarLoading ? (
          <CalendarSpinner />
        ) : (
          <TableBody
            data={tableData}
            setModalEditData={setModalEditData}
            handleShowModal={handleShowModal}
            handleCloseModal={handleCloseModal}
            query={searchQuery}
          />
        )}
      </table>
      <Modal showModal={showModal} handleCloseModal={handleCloseModal} />
    </div>
  );
};

export default Calendar;
