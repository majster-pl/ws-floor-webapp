import {
  Button,
  Container,
  Row,
  Col,
  Card,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import apiClient from "../../service/api/api";
import { useState, useEffect } from "react";
import "./Dashboard.css";
import { Line } from "react-chartjs-2";

const Dashboard = ({ setLoggedIn, showToast, setLoginErrorMsg }) => {
  const [chartData, setChartData] = useState({});
  const [eventsPerDay, setEventsPerDay] = useState([]);
  const [eventsBooked, setEventsBooked] = useState([]);
  const [eventsCompleted, setEventsCompleted] = useState([]);
  const [numberOfSelectedDays, setNumberOfSelectedDays] = useState(7);
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setLoggedIn
  );

  const Chart = () => {
    setChartData({
      datasets: [
        {
          label: "Total booked jobs",
          data: eventsPerDay,
          borderColor: "#ffbb00",
          fill: false,
          cubicInterpolationMode: "monotone",
          tension: 0.4,
        },
        {
          label: "With status: booked",
          data: eventsBooked,
          borderColor: "#39a883",
          fill: false,
          tension: 0.4,
        },
        {
          label: "Completed Jobs",
          data: eventsCompleted,
          borderColor: "#f00fa6",
          tension: 0.4,
          fill: false,
        },
      ],
    });
  };

  const getAssets = () => {
    apiClient
      .get("/api/v1/stats?from=2021-06-01&days=" + numberOfSelectedDays)
      .then((response) => {
        setEventsPerDay(response.data.data);
      })
      .catch((err) => {
        console.log(err);
        // setLoggedIn(false);
        showToast("danger", "Error", err.statusText, false);
      });
  };

  const getEvents = () => {
    apiClient
      .get(
        "/api/v1/stats?from=2021-06-01&days=" +
          numberOfSelectedDays +
          "&status=booked"
      )
      .then((response) => {
        setEventsBooked(response.data.data);
        console.log(response.data.data);
      });
  };

  const getCompleted = () => {
    apiClient
      .get(
        "/api/v1/stats?from=2021-06-01&days=" +
          numberOfSelectedDays +
          "&status=completed"
      )
      .then((response) => {
        setEventsCompleted(response.data.data);
      })
      .catch((err) => {
        console.log(err);
        // setLoggedIn(false);
        showToast("danger", "Error", err.statusText, false);
      });
  };

  const getCustomer = () => {
    apiClient.get("/api/v1/customer").then((response) => {
      console.log(response.data);
    });
  };

  const getEvent = () => {
    apiClient.get("/api/v1/events/10").then((response) => {
      console.log(response.data);
    });
  };
  const saveEvent = () => {
    let url = "/api/v1/events/119";

    const data = {
      description: "lol",
      booked_date: "2021-05-29",
      allowed_time: 2,
      status: "booked",
    };

    apiClient
      .patch(url, data)
      .then((response) => {
        // setTableData(response.data.data);
        console.log(response.data);
        // setModalData(response.data.data);
        // setShowModal(true);
      })
      .catch((err) => {
        console.log("error:", err);
      });
  };
  useEffect(() => {
    // Chart.clear();
    getAssets();
    getEvents();
    getCompleted();
    // Chart();
  }, [numberOfSelectedDays]);

  useEffect(() => {
    Chart();
  }, [eventsBooked, eventsPerDay, eventsCompleted]);

  //if still waiting response from server then display spinner
  if (isLoading) {
    return <SpinnerComponent />;
  }

  const Canvas = () => {
    return (
      <Line
        key="canvas1"
        data={chartData}
        options={{
          interaction: {
            intersect: false,
            mode: "nearest",
          },
          plugins: {
            legend: {
              position: "right",
            },
          },
          responsive: true,
          title: { text: "THICCNESS SCALE", display: true },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        }}
      />
    );
  };

  return (
    <div className="scroll">
      <Container className="py-4">
        <Row className="g-3">
          <Col sm={4}>
            <Card className="dashboard-card h-100" bg="secondary">
              <Card.Body>
                <Row className="px-2">
                  <Col className="col-auto me-auto">
                    <Col>
                      <div className="fw-bold fs-3">12</div>
                      <div className="fw-light fs-5">Vehicles Due Today</div>
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
            <Card className="dashboard-card h-100" bg="secondary">
              <Card.Body>
                <Row className="px-2">
                  <Col className="col-auto me-auto">
                    <Col>
                      <div className="fw-bold fs-3">22</div>
                      <div className="fw-light fs-5">Customers</div>
                    </Col>
                  </Col>
                  <Col className="col-auto my-auto">
                    <i className="fas fa-users fa-2x text-lime"></i>
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
                      <div className="fw-bold fs-3">45</div>
                      <div className="fw-light fs-5">Assets</div>
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
                      <div className="fw-bold fs-3">4</div>
                      <div className="fw-light fs-5">PMIs Today</div>
                    </Col>
                  </Col>
                  <Col className="col-auto my-auto">
                    <i className="fas fa-notes-medical fa-2x text-lime"></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>{" "}
          </Col>
        </Row>
      </Container>
      <Container>
        <Row className="p-2 g-2">
          <Col className="col-auto me-auto">
            <Col>
              <div className="fw-bold fs-4">Workshop overview</div>
            </Col>
          </Col>
          <Col className="col-auto my-auto">
            <DropdownButton
              id="dropdown-basic-button"
              title="This month"
              variant="success"
            >
              <Dropdown.Item
                onClick={() => setNumberOfSelectedDays(7)}
                active={numberOfSelectedDays == 7}
              >
                This Week
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => setNumberOfSelectedDays(31)}
                active={numberOfSelectedDays == 31}
              >
                This Month
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => setNumberOfSelectedDays(365)}
                active={numberOfSelectedDays == 365}
              >
                This Year
              </Dropdown.Item>
            </DropdownButton>
          </Col>
        </Row>
      </Container>
      <Container style={{ minHeight: "25rem" }}>
        <Canvas />
      </Container>
      <Container className="mt-4">
        <Button onClick={getAssets}> Get this week </Button>
        <Button onClick={getEvents}> get events Booked </Button>
        <Button onClick={getCustomer}> get Customer </Button>
        <Button onClick={getEvent}> get event 10 </Button>
        <Button onClick={saveEvent}> Save events </Button>
      </Container>
    </div>
  );
};

export default Dashboard;
