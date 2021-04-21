import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import CalendarLogic from "./CalendarLogic";
import TableHeader from "./components/TableHeader";
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
    setModalEventId,
    handleCloseModal,
    handleShowModal,
    tableData,
    numberOfDays,
    setNumberOfDays,
    isCalendarLoading,
    modalData,
  } = CalendarLogic();
  //   const { Header } = CalendarHeader();
  //if still waiting response from server then display spinner
  if (isLoading) {
    return <SpinnerComponent />;
  }

  return (
    <div className="calendar-main">
      <table className="calendar-table">
        <TableHeader
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleModalOpen={handleModalOpen}
          numberOfDays={numberOfDays}
          setNumberOfDays={setNumberOfDays}
        />

        {isCalendarLoading ? (
          <CalendarSpinner numberOfDays={numberOfDays} />
        ) : (
          <TableBody
            tableData={tableData}
            setModalEditData={setModalEventId}
            handleModalOpen={handleModalOpen}
            handleShowModal={handleShowModal}
            handleCloseModal={handleCloseModal}
            query={searchQuery}
          />
        )}
      </table>
      <Modal showModal={showModal} handleCloseModal={handleCloseModal} modalData={modalData} />
    </div>
  );
};

export default Calendar;
