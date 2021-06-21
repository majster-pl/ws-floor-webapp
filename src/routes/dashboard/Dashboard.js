import { Button, Container, Row, Col, Card } from "react-bootstrap";
import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import apiClient from "../../service/api/api";
import "./Dashboard.css";

const Dashboard = ({ setLoggedIn, showToast, setLoginErrorMsg }) => {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setLoggedIn
  );
  //if still waiting response from server then display spinner
  if (isLoading) {
    return <SpinnerComponent />;
  }

  const getAssets = () => {
    apiClient
      .get("/api/v1/assets/2")
      .then((response) => {
        console.log(response);
        // setLoginErrorMsg(JSON.stringify(response.data));
        showToast("success", "Response", JSON.stringify(response.data));
        // showToast("success", "Response", JSON.stringify(response.data));
      })
      .catch((err) => {
        console.log(err);
        // setLoggedIn(false);
        showToast("danger", "Error", err.statusText, false);
      });
  };

  const getEvents = () => {
    apiClient
      .get("/api/v1/events?days=7&from=2021-06-1&format=grid")
      .then((response) => {
        console.log(response.data);
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

  return (
    <div className="scroll">
      <Container className="py-4">
        <Row>
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
                    <i class="fas fa-truck fa-2x text-primary"></i>
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
                    <i class="fas fa-users fa-2x text-primary"></i>
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
                    <i class="fas fa-car fa-2x text-primary"></i>
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
                    <i class="fas fa-notes-medical fa-2x text-primary"></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>{" "}
          </Col>
        </Row>
      </Container>
      <Button onClick={getAssets}> Assets </Button>
      <Button onClick={getEvents}> get events </Button>
      <Button onClick={getCustomer}> get Customer </Button>
      <Button onClick={getEvent}> get event 10 </Button>
      <Button onClick={saveEvent}> Save events </Button>
    </div>
  );
};

export default Dashboard;
