import { Container, Row, Col, Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import "./Dashboard.css";
import ChartLine from "./components/ChartLine";
import apiClient from "../../service/api/api";
import { useState, useEffect } from "react";
import moment from "moment";
import { useSelector, useDispatch, RootStateOrAny } from "react-redux";

const Dashboard = ({ setIsLoading, setLoggedIn, setLoginErrorMsg, toast }) => {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setIsLoading,
    setLoggedIn
  );
  const selectedDepot = useSelector((state) => state.depot);

  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalEventsToday, setTotalEventsToday] = useState(0);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalBreakdowns, setTotalBreakdowns] = useState(0);

  useEffect(() => {
    const getNumberOfCustomer = () => {
      apiClient
        .get("/api/v1/customers")
        .then((response) => {
          setTotalCustomers(Object.keys(response.data.data).length);
        })
        .catch((err) => {
          setTotalCustomers("n/a");
        });
    };

    const getNumberOfEvents = () => {
      apiClient
        .get(
          "/api/v1/events?date=" +
            moment(new Date()).format("YYYY-MM-DD") +
            "&depot=" +
            selectedDepot
        )
        .then((response) => {
          // console.log("response");
          // console.log(response);
          setTotalEventsToday(Object.keys(response.data).length);
        });
    };

    const getNumberOfAssets = () => {
      apiClient
        .get("/api/v1/assets")
        .then((response) => {
          setTotalAssets(Object.keys(response.data.data).length);
        })
        .catch((err) => {
          setTotalAssets("n/a");
        });
    };

    const getNumberOfBrakedowns = () => {
      apiClient
        .get("/api/v1/breakdown?" + "&depot=" + selectedDepot)
        .then((response) => {
          console.log(response);
          setTotalBreakdowns(response.data)
          // setTotalAssets(Object.keys(response.data.data).length);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getNumberOfCustomer();
    getNumberOfAssets();
    getNumberOfEvents();
    getNumberOfBrakedowns();
  }, [selectedDepot]);

  //if still waiting response from server then display spinner
  if (isLoading) {
    return <SpinnerComponent />;
  }

  return (
    <div className="scroll">
      <Container className="py-4">
        <Row className="g-3">
          <Col sm={4}>
            <Card
              className="dashboard-card h-100 text-white text-decoration-none"
              bg="secondary"
              // onClick={() => toast.info("ELO!")}
              // as={NavLink}
              // to="/calendar"
            >
              <Card.Body>
                <Row className="px-2">
                  <Col className="col-auto me-auto">
                    <Col>
                      <div className="fw-bold fs-3">{totalEventsToday}</div>
                      <div className="fw-light fs-4">Vehicles Due Today</div>
                    </Col>
                  </Col>
                  <Col className="col-auto my-auto">
                    <i className="fas fa-truck fa-2x text-lime"></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card
              className="dashboard-card h-100 text-white text-decoration-none"
              bg="secondary"
              as={NavLink}
              to="/customers"
            >
              <Card.Body>
                <Row className="px-2">
                  <Col className="col-auto me-auto">
                    <Col>
                      <div className="fw-bold fs-3">{totalCustomers}</div>
                      <div className="fw-light fs-4">Customers</div>
                    </Col>
                  </Col>
                  <Col className="col-auto my-auto">
                    <i className="fas fa-users fa-2x text-lime"></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card
              className="dashboard-card h-100 text-white text-decoration-none"
              bg="secondary"
              as={NavLink}
              to="/assets"
            >
              <Card.Body>
                <Row className="px-2">
                  <Col className="col-auto me-auto">
                    <Col>
                      <div className="fw-bold fs-3">{totalAssets}</div>
                      <div className="fw-light fs-4">Assets</div>
                    </Col>
                  </Col>
                  <Col className="col-auto my-auto">
                    <i className="fas fa-car fa-2x text-lime"></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>{" "}
          </Col>
          <Col>
            <Card className="dashboard-card h-100" bg="secondary">
              <Card.Body>
                <Row className="px-2">
                  <Col className="col-auto me-auto">
                    <Col>
                      <div className="fw-bold fs-3">{totalBreakdowns}</div>
                      <div className="fw-light fs-4">Breakdowns</div>
                    </Col>
                  </Col>
                  <Col className="col-auto my-auto">
                    <i className="fas fa-car-crash fa-2x text-lime"></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>{" "}
          </Col>
        </Row>
      </Container>
      <ChartLine />
      <Container className="mt-4">
        {/* <Button onClick={getBookedDays}> Get this week </Button> */}
        {/* <Button onClick={getWorkInProgess}> get events Booked </Button> */}
        {/* <Button onClick={getCustomer}> get Customer </Button> */}
        {/* <Button onClick={getEvent}> get event 10 </Button> */}
        {/* <Button onClick={saveEvent}> Save events </Button> */}
      </Container>
    </div>
  );
};

export default Dashboard;
