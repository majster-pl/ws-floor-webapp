import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import Cookies from "js-cookie";
import "./scss/main.scss";
// import apiClient from "./service/api/api";

import Header from "./components/header/Header";
import Home from "./routes/home/Home";
import Login from "./routes/auth/login/Login";
import Calendar from "./routes/calendar/Calendar";
import Dashboard from "./routes/dashboard/Dashboard";
import Workshop from "./routes/workshop/Workshop";
import Page404 from "./routes/page404/Page404";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(
    // localStorage.getItem("loggedIn") == "true" || false
    Cookies.get("logged-in") === "true" || false
  );

  return (
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
          <Dashboard setLoggedIn={setLoggedIn} />
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
  );
};

export default App;
