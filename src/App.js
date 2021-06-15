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
import ToastComponent from "./components/Toast";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showToast, setShowToast] = useState(false);
  // const [toastVariant, setToastVariant] = useState("Info");
  // const [toastTitle, setToastTitle] = useState("");
  // const [toastBody, setToastBody] = useState("");
  const [toastData, setToastData] = useState({
    variant: "info",
    title: "test",
    body: "Toast body",
  });

  return (
    <>
      <ToastComponent
        setShowToast={setShowToast}
        showToast={showToast}
        toastData={toastData}
      />
      <Router>
        <Header isLoggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route path="/login">
            <Login setLoggedIn={setLoggedIn} />
          </Route>

          <Route path="/dashboard">
            <Dashboard
              setLoggedIn={setLoggedIn}
              setShowToast={setShowToast}
              // setToastVariant={setToastVariant}
              // setToastTitle={setToastTitle}
              // setToastBody={setToastBody}
              setToastData={setToastData}
            />
          </Route>

          <Route path="/calendar">
            <Calendar setLoggedIn={setLoggedIn} />
          </Route>

          <Route path="/workshop">
            <Workshop setLoggedIn={setLoggedIn} />
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
