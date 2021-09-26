import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Modal, Spinner } from "react-bootstrap";
import "./scss/main.scss";

import Header from "./components/header/Header";
import Home from "./routes/home/Home";
import Login from "./routes/auth/login/Login";
import Calendar from "./routes/calendar/Calendar";
import CalendarLogic from "./routes/calendar/CalendarLogic";
import Dashboard from "./routes/dashboard/Dashboard";
import Workshop from "./routes/workshop/Workshop";
import Customers from "./routes/customers/Customers";
import CustomerPage from "./routes/customers/pages/CustomerPage";
import NewCustomerPage from "./routes/customers/pages/NewCustomerPage";
import Assets from "./routes/assets/Assets";
import NewAssetPage from "./routes/assets/NewAssetPage";
import AssetPage from "./routes/assets/AssetPage";
import Page404 from "./routes/page404/Page404";
import MainModal from "./components/MainModal";
import MainModalLogic from "./components/MainModalLogic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const todaysDate = moment().startOf("isoWeek");
  // const [currentDate, setCurrentDate] = useState(() => {
  //   return todaysDate;
  // });
  const {
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
    siletReload,
  } = CalendarLogic({ toast, setIsLoading });

  const {
    handleShowMainModal,
    handleCloseMainModal,
    // reloadCalendar,
    showMainModal,
    CheckInModal,
  } = MainModalLogic({ setIsLoading, toast, reloadCalendar });

  useEffect(() => {
    // reloadCalendar();
    // setCurrentDate(todaysDate);
    console.log("APP: currentDate: " + moment(currentDate).format("D-M-yyyy"));
  }, [currentDate]);

  // useEffect(() => {
  //   Pusher.logToConsole = true;

  //   let PusherClient = new Pusher("7c76a1124748bac977da", {
  //     cluster: "eu",
  //     enabledTransports: ["ws"],
  //     forceTLS: false,
  //   });

  //   let echo = new Echo({
  //     broadcaster: "pusher",
  //     key: "7c76a1124748bac977da",
  //     cluster: "eu",
  //     forceTLS: true,
  //   });

  //   var channel = echo.channel("events");
  //   channel.listen(".events-updated", function (data) {
  //     alert(JSON.stringify(data));
  //   });

  //   // echo.channel("events").listen("events-updated", (e) => {
  //   //   console.log("KURWA COS JEST!!");

  //   // });
  // }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        // closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
        <Header
          isLoggedIn={authenticated}
          setLoggedIn={setAuthenticated}
          setLoginErrorMsg={setLoginErrorMsg}
        />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route path="/login">
            <Login
              setIsLoading={setIsLoading}
              setLoggedIn={setAuthenticated}
              toast={toast}
              setLoginErrorMsg={setLoginErrorMsg}
              loginErrorMsg={loginErrorMsg}
            />
          </Route>

          <Route path="/dashboard">
            <Dashboard
              setIsLoading={setIsLoading}
              setLoggedIn={setAuthenticated}
              toast={toast}
              setLoginErrorMsg={setLoginErrorMsg}
            />
          </Route>

          <Route path="/calendar">
            <Calendar
              setIsLoading={setIsLoading}
              setLoggedIn={setAuthenticated}
              setLoginErrorMsg={setLoginErrorMsg}
              toast={toast}
              handleShowMainModal={handleShowMainModal}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleModalOpen={handleModalOpen}
              showModal={showModal}
              handleCloseModal={handleCloseModal}
              tableData={tableData}
              numberOfDays={numberOfDays}
              setNumberOfDays={setNumberOfDays}
              isCalendarLoading={isCalendarLoading}
              modalData={modalData}
              setModalData={setModalData}
              reloadCalendar={reloadCalendar}
              siletReload={siletReload}
            />
          </Route>

          <Route path="/workshop">
            <Workshop
              setIsLoading={setIsLoading}
              setLoggedIn={setAuthenticated}
              setLoginErrorMsg={setLoginErrorMsg}
              toast={toast}
              reloadCalendar={reloadCalendar}
              siletReload={siletReload}
              currentDate={currentDate}
            />
          </Route>

          <Route path="/customers/new">
            <NewCustomerPage
              setIsLoading={setIsLoading}
              setLoggedIn={setAuthenticated}
              setLoginErrorMsg={setLoginErrorMsg}
              toast={toast}
            />
          </Route>
          <Route path="/customers/:id">
            <CustomerPage
              setIsLoading={setIsLoading}
              setLoggedIn={setAuthenticated}
              setLoginErrorMsg={setLoginErrorMsg}
              toast={toast}
            />
          </Route>
          <Route exact path="/customers">
            <Customers
              setIsLoading={setIsLoading}
              setLoggedIn={setAuthenticated}
              setLoginErrorMsg={setLoginErrorMsg}
              toast={toast}
            />
          </Route>

          <Route exact path="/assets">
            <Assets
              setIsLoading={setIsLoading}
              setLoggedIn={setAuthenticated}
              setLoginErrorMsg={setLoginErrorMsg}
              toast={toast}
            />
          </Route>

          <Route path="/assets/new">
            <NewAssetPage
              setIsLoading={setIsLoading}
              setLoggedIn={setAuthenticated}
              setLoginErrorMsg={setLoginErrorMsg}
              toast={toast}
            />
          </Route>

          <Route path="/assets/:id">
            <AssetPage
              setIsLoading={setIsLoading}
              setLoggedIn={setAuthenticated}
              setLoginErrorMsg={setLoginErrorMsg}
              toast={toast}
            />
          </Route>

          <Route path="/*">
            <Page404 />
          </Route>
        </Switch>
        <MainModal
          show={showMainModal}
          handleClose={() => handleCloseMainModal()}
          form={CheckInModal()}
          setLoginErrorMsg={setLoginErrorMsg}
          toast={toast}
        />
      </Router>
      <Modal
        show={isLoading}
        centered
        className="modal-dialog-loading text-center disable-select"
        animation={false}
        onHide={() => setIsLoading(false)}
        // backdrop="static"
        // keyboard={false}
      >
        <div>
          <div className="div-center">
            <Spinner
              className="mx-1"
              animation="grow"
              variant="primary"
              size="sm"
            />
            <Spinner className="mx-1" animation="grow" variant="success" />
            <Spinner
              className="mx-1"
              animation="grow"
              variant="danger"
              size="sm"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default App;
