import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import TableHeader from "./components/TableHeader";
import CalendarNavbar from "./components/CalendarNavbar";
import TableBody from "./components/TableBody";
import "./Calendar.css";
import CalendarSpinner from "./components/CalendarSpinner";
import { useEffect, useState } from "react";
// import Pusher from "pusher-js";
import Echo from "laravel-echo";

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
  tableData,
  numberOfDays,
  setNumberOfDays,
  isCalendarLoading,
  reloadCalendar,
  siletReload,
}) => {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setIsLoading,
    setLoggedIn
  );

  // vaible to trigger silent calendar reload when changed
  const [triggerUpdate, setTriggerUpdate] = useState(0);

  useEffect(() => {
    // Pusher.logToConsole = true;

    let echo = new Echo({
      broadcaster: "pusher",
      key: "7c76a1124748bac977da",
      cluster: "eu",
      forceTLS: true,
    });

    var channel = echo.channel("events");
    channel.listen(".events-updated", function (data) {
      console.log("events-updated type: " + JSON.stringify(data));
      setTriggerUpdate(Math.random());
    });
  }, []);

  useEffect(() => {
    siletReload(currentDate);
  }, [triggerUpdate]);

  return (
    <div className="calendar-main scroll">
      <CalendarNavbar
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        numberOfDays={numberOfDays}
        setNumberOfDays={setNumberOfDays}
        reloadCalendar={reloadCalendar}
      />
      <table className="calendar-table">
        <TableHeader
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          handleShowMainModal={handleShowMainModal}
          numberOfDays={numberOfDays}
          setNumberOfDays={setNumberOfDays}
        />

        {isCalendarLoading ? (
          <CalendarSpinner numberOfDays={numberOfDays} />
        ) : (
          <TableBody
            tableData={tableData}
            query={searchQuery}
            setIsLoading={setIsLoading}
            handleShowMainModal={handleShowMainModal}
          />
        )}
      </table>
    </div>
  );
};

export default Calendar;
