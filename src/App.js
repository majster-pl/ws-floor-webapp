import Home from "./routes/home/Home";
import Login from "./routes/login/Login";
import Calendar from "./routes/calendar/Calendar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        <Route path="/login">
          <Login />
        </Route>

        <Route path="/calendar">
          <Calendar />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
