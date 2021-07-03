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
import NewCustomerPage from "./routes/customers/pages/NewCustomerPage";
import Page404 from "./routes/page404/Page404";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
sessionStorage.setItem("loginStatus", "false");

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState("");

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
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
              setLoggedIn={setAuthenticated}
              toast={toast}
              setLoginErrorMsg={setLoginErrorMsg}
              loginErrorMsg={loginErrorMsg}
            />
          </Route>

          <Route path="/dashboard">
            <Dashboard
              setLoggedIn={setAuthenticated}
              toast={toast}
              setLoginErrorMsg={setLoginErrorMsg}
            />
          </Route>

          <Route path="/calendar">
            <Calendar
              setLoggedIn={setAuthenticated}
              setLoginErrorMsg={setLoginErrorMsg}
              toast={toast}
            />
          </Route>

          <Route path="/workshop">
            <Workshop
              setLoggedIn={setAuthenticated}
              setLoginErrorMsg={setLoginErrorMsg}
              toast={toast}
            />
          </Route>

          <Route path="/customers/new">
            <NewCustomerPage
              setLoggedIn={setAuthenticated}
              setLoginErrorMsg={setLoginErrorMsg}
              toast={toast}
            />
          </Route>
          <Route path="/customers/:id">
            <CustomerPage
              setLoggedIn={setAuthenticated}
              setLoginErrorMsg={setLoginErrorMsg}
              toast={toast}
            />
          </Route>
          <Route exact path="/customers">
            <Customers
              setLoggedIn={setAuthenticated}
              setLoginErrorMsg={setLoginErrorMsg}
              toast={toast}
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
