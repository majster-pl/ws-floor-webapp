import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import React, { useState, useEffect } from "react";
// import ReactDOM from "react-dom";
import moment, { weekdays } from "moment";
import CalendarHead from "./CalendarHead";
import CalendarBody from "./components/CalendarBody";
import CalendarSpinner from "./components/CalendarSpinner";
import CalendarModal from "./CalendarModal";
import apiClient from "../../service/api/api";
import "./Calendar.css";

const Calendar = (setLoggedIn) => {
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(setLoggedIn);

  
  

  const todaysDate = moment().startOf("isoweek");
  const [currentDate, setDate] = useState(todaysDate);
  const [dateFormat, setDateFormat] = useState("YYYY-MM-DD");
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [q, setQ] = useState("");

  // modal
  const [modalEditData, setModalEditData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setModalEditData([]);
    setShowModal(false);
  };
  const [assetsOptions, setAssetsOptions] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);

  // get all assets list
  const getAssets = () => {
    var url = "/api/v1/assets/";
    // console.log(url);
    apiClient
      .get(url, { headers: { "Content-Type": "application/json" } })
      .then((res) => {
        // console.log(res.data.map((e) => e.asset_name));
        setAssetsOptions(res.data.map((e) => e.asset_name));
      })
      .catch((err) => {
        console.log(err);
      });
    // console.log("assetOptions:", assetsOptions);
  };

  // get all assets list
  const getCustomers = () => {
    var url = "http://127.0.0.1:8001/api/customers/";
    // console.log(url);
    apiClient
      .get(url, { headers: { "Content-Type": "application/json" } })
      .then((res) => {
        setCustomerOptions(
          res.data.map((e) => {
            var cust = {
              id: e.id,
              name: e.customer_name,
            };
            return cust;
          })
          // [
          // {
          //     id: 1,
          //     name: "itemName1",
          // },
          // {
          //     id: 2,
          //     name: "itemNam2",
          // },
          // {
          //     id: 3,
          //     name: "itemName3",
          // },]
        );
      })
      .catch((err) => {
        console.log(err);
      });
    // console.log("OOO:", customerOptions);
  };

  // function to turn off spinner
  useEffect(() => {
    setIsCalendarLoading(false);
    getAssets();
    getCustomers();
  }, [tableData]);

  // Loading calendar from api when currentDate changes
  useEffect(() => {
    setIsCalendarLoading(true);
    const from = moment(currentDate).format(dateFormat);
    const to = moment(currentDate).add(6, "days").format(dateFormat);
    const url = "http://127.0.0.1:8001/api/list/" + from + "/" + to;

    // create object with all dates in rage
    const weekMap = [];
    for (var i = 0; i < 7; i++) {
      weekMap[moment(currentDate).add(i, "days").format(dateFormat)] = [];
    }

    const currentWeekData = [];
    for (var i = 0; i < 7; i++) {
      currentWeekData.push([
        moment(currentDate).add(i, "days").format(dateFormat),
      ]);
    }

    apiClient.get(url).then((response) => {
      response.data.map((event) => {
        weekMap[event.booked_at].push(event);
      });
      renderTableRow(weekMap, currentWeekData);
    });
  }, [currentDate]);

  // render table
  const renderTableRow = (weekMap, currentWeekData) => {
    const rowArray = [];
    for (let i = 0; i < 6; i++) {
      var row = [];
      currentWeekData.forEach((element, e) => {
        if (weekMap[element][i] !== undefined) {
          row[e] = [weekMap[element][i]];
        } else {
          row[e] = [{ isUsed: false }];
        }
      });
      rowArray.push(row);
    }
    setTableData(rowArray);
  };

  // Loading calendar from api
  const getEvents = (newDate) => {
    setDate(newDate);
  };

  function reloadCalendar() {
    setDate(moment(currentDate, "DD-MM-YYYY"));
  }

  //if still waiting response from server then display spinner
  if (isLoading) {
    return <SpinnerComponent />;
  }

  return (
    <div id="calendar">
      <table className="calendar-table">
        <CalendarHead
          setDate={setDate}
          currentDate={currentDate}
          getEvents={getEvents}
          q={q}
          setQ={setQ}
          setModalEditData={setModalEditData}
          modalEditData={modalEditData}
          handleShowModal={handleShowModal}
          showModal={handleShowModal}
        />
        {isCalendarLoading ? (
          <CalendarSpinner />
        ) : (
          <CalendarBody
            data={tableData}
            setModalEditData={setModalEditData}
            handleShowModal={handleShowModal}
            handleCloseModal={handleCloseModal}
            query={q}
            // handleShow={handleShow}
          />
        )}
      </table>
      <CalendarModal
        setModalEditData={setModalEditData}
        modalEditData={modalEditData}
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        reloadCalendar={reloadCalendar}
        assetsOptions={assetsOptions}
        customerOptions={customerOptions}
      />
    </div>
  );
};

export default Calendar;

// if (document.getElementById("calendar")) {
//     ReactDOM.render(<Calendar />, document.getElementById("calendar"));
// }
