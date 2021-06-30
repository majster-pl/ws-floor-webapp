import { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./scss/main.scss";

import Header from "./components/header/Header";
import Home from "./routes/home/Home";
import Login from "./routes/auth/login/Login";
import Calendar from "./routes/calendar/Calendar";
import Dashboard from "./routes/dashboard/Dashboard";
import Workshop from "./routes/workshop/Workshop";
import Customers from "./routes/customers/Customers";
import CustomerPage from "./routes/customers/pages/CustomerPage";
import Page404 from "./routes/page404/Page404";
import ToastComponent from "./components/ToastComponent";
import ToastLogic from "./components/ToastLogic";
sessionStorage.setItem("loginStatus", "false");

const App = () => {
  const [Authenticated, setAuthenticated] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState("");
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
      />
      <Router>
        <Header
          isLoggedIn={Authenticated}
          setLoggedIn={setAuthenticated}
          setLoginErrorMsg={setLoginErrorMsg}
        />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route path="/login">
            <Login
              setLoggedIn={setAuthenticated}
              showToast={showToast}
              setLoginErrorMsg={setLoginErrorMsg}
              loginErrorMsg={loginErrorMsg}
            />
          </Route>

          <Route path="/dashboard">
            <Dashboard
              setLoggedIn={setAuthenticated}
              showToast={showToast}
              setLoginErrorMsg={setLoginErrorMsg}
            />
          </Route>

          <Route path="/calendar">
            <Calendar
              setLoggedIn={setAuthenticated}
              showToast={showToast}
              setLoginErrorMsg={setLoginErrorMsg}
            />
          </Route>

          <Route path="/workshop">
            <Workshop
              setLoggedIn={setAuthenticated}
              setLoginErrorMsg={setLoginErrorMsg}
            />
          </Route>

          <Route path="/customers/:id">
            <CustomerPage
              setLoggedIn={setAuthenticated}
              setLoginErrorMsg={setLoginErrorMsg}
            />
          </Route>

          <Route exact path="/customers">
            <Customers
              setLoggedIn={setAuthenticated}
              setLoginErrorMsg={setLoginErrorMsg}
            />
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
