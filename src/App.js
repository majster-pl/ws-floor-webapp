import { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import Cookies from "js-cookie";
import "./scss/main.scss";
// import apiClient from "./service/api/api";

import Header from "./components/header/Header";
import Home from "./routes/home/Home";
import Login from "./routes/auth/login/Login";
import Calendar from "./routes/calendar/Calendar";
import Dashboard from "./routes/dashboard/Dashboard";
import Workshop from "./routes/workshop/Workshop";
import Page404 from "./routes/page404/Page404";
import ToastComponent from "./components/ToastComponent";
import ToastLogic from "./components/ToastLogic";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  // const [showToast, setShowToast] = useState(false);
  // const [toastVariant, setToastVariant] = useState("Info");
  // const [toastTitle, setToastTitle] = useState("");
  // const [toastBody, setToastBody] = useState("");
  // const [toastData, setToastData] = useState({
  //   variant: "info",
  //   title: "test",
  //   body: "Toast body",
  // });

  // const {showToast, setShowToast, toastData} = ToastLogic();
  const { show, setShow, variant, title, body, showToast, autoHide } =
    ToastLogic();

  return (
    <>
      <ToastComponent
        variant={variant}
        title={title}
        body={body}
        show={show}
        setShow={setShow}
        autoHide={autoHide}
        // setShowToast={setShowToast}
        // showToast={showToast}
        // toastData={toastData}
      />
      <Router>
        <Header isLoggedIn={loggedIn} setLoggedIn={{ setLoggedIn }} />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route path="/login">
            <Login setLoggedIn={{ setLoggedIn }} />
          </Route>

          <Route path="/dashboard">
            <Dashboard
              setLoggedIn={{ setLoggedIn }}
              showToast={showToast}
              // setShowToast={setShowToast}
              // setToastVariant={setToastVariant}
              // setToastTitle={setToastTitle}
              // setToastBody={setToastBody}
              // setToastData={setToastData}
            />
          </Route>

          <Route path="/calendar">
            <Calendar setLoggedIn={{ setLoggedIn }} showToast={showToast} />
          </Route>

          <Route path="/workshop">
            <Workshop setLoggedIn={{ setLoggedIn }} />
          </Route>

          <Route path="/*">
            <Page404 />
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export default App;
