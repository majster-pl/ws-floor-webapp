import Header from "./components/header/Header";
import Home from "./routes/home/Home";
import Login from "./routes/auth/login/Login";
import Calendar from "./routes/calendar/Calendar";
import Page404 from "./routes/page404/Page404";
import { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(
    sessionStorage.getItem("loggedIn") == "true" || false
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

        <Route path="/calendar">
          <Calendar setLoggedIn={setLoggedIn} />
        </Route>

        <Route path="/*">
          <Page404 />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
