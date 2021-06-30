import { useParams } from "react-router-dom";
import { Container, Button, Tabs, Tab, Form, Row, Col } from "react-bootstrap";
import IsLoggedInLogic from "../../../components/IsLoggedInLogic";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import apiClient from "../../../service/api/api";
import moment from "moment";

function CustomerPage({ setLoggedIn, setLoginErrorMsg }) {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setLoggedIn
  );

  const [formGeneral, setFormGeneral] = useState({
    customer_name: "",
    status: "",
  });

  const [toggleEditForm, setToggleEditForm] = useState(true);

  const { id } = useParams();
  const [key, setKey] = useState("home");

  const getCustomerData = () => {
    apiClient
      .get("/api/v1/customer/" + id)
      .then((response) => {
        // console.log(response.data.data);
        setFormGeneral(response.data.data);

        // setEventsPerDay(response.data.data);
      })
      .catch((err) => {
        console.log(err);

        // showToast("danger", "Error", err.statusText, false);
      });
  };

  useEffect(() => {
    getCustomerData();
  }, []);

  const loadedString = (string) => {
    if (typeof string !== "undefined") {
      return string;
    }
  };

  //if still waiting response from server then display spinner
  if (isLoading) {
    return <SpinnerComponent />;
  }

  return (
    <div className="scroll">
      <Container className="my-2">
        <div className="row justify-content-between">
          <div className="col-4">
            <Button
              className="mt-1"
              variant="light"
              as={Link}
              to={"/customers"}
            >
              Go Back
            </Button>
          </div>
          <div className="col-6">
            <div className="row">
              <div className="col-auto my-auto">
                <div className="numberCircle fs-3 text-pink text-uppercase">
                  {formGeneral.customer_name !== ""
                    ? formGeneral.customer_name
                        .match(/\b(\w)/g)
                        .join("")
                        .substring(0, 2)
                    : ""}
                </div>
              </div>
              <div className="col text-start">
                <div className="fs-4">{formGeneral.customer_name}</div>
                <div className="row ">
                  <div className="col-auto">
                    <div>
                      <span className="fs-5 me-2 text-success">
                        {formGeneral.assets_total}
                      </span>
                      Assets
                    </div>
                  </div>
                  <div className="col-auto">
                    <div>
                      Since
                      <span className="fs-5 mx-2 text-success">
                        {moment(formGeneral.created_at).format("MMM-YYYY")}
                      </span>
                    </div>
                  </div>
                  <div className="col-auto">
                    <span
                      className={
                        "fs-5 mx-2 text-capitalize " +
                        (formGeneral.status == "on_hold"
                          ? "text-info"
                          : "text-success")
                      }
                    >
                      {formGeneral.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className=""
        >
          <Tab eventKey="home" title="General" className="bg-darker">
            <Container className="py-3">
              <Row className="justify-content-end">
                <Col className="col-auto">
                  <Button
                    variant={toggleEditForm ? "lime" : "success"}
                    onClick={() => setToggleEditForm(!toggleEditForm)}
                  >
                    {toggleEditForm ? "Edit" : "Save"}
                  </Button>
                </Col>
              </Row>
              <Form>
                <Row className="">
                  <Form.Group as={Col} controlId="formName">
                    <Form.Label>Customer Name</Form.Label>
                    <Form.Control
                      plaintext={toggleEditForm}
                      disabled={toggleEditForm}
                      type="text"
                      placeholder="Enter customer name"
                      defaultValue={formGeneral.customer_name}
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formContact">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control
                      plaintext={toggleEditForm}
                      disabled={toggleEditForm}
                      defaultValue={formGeneral.customer_contact}
                      type="text"
                      placeholder="Contact number"
                    />
                  </Form.Group>
                </Row>
              </Form>
            </Container>
          </Tab>
          <Tab eventKey="assets" title="Assets" className="bg-darker">
            <p>tab 2</p>
          </Tab>
          <Tab eventKey="contact" title="Contact" className="bg-darker">
            <p>tab 3</p>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

export default CustomerPage;
