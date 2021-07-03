import { Container, Row, Col, Card } from "react-bootstrap";
import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import apiClient from "../../service/api/api";
import { useState, useEffect } from "react";
import "./Dashboard.css";
// import { Line } from "react-chartjs-2";
import ChartLine from "./components/ChartLine";

const Dashboard = ({ setLoggedIn, setLoginErrorMsg, toast }) => {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setLoggedIn
  );

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
              className="dashboard-card h-100"
              bg="secondary"
              onClick={() => toast.info("ELO!")}
            >
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
