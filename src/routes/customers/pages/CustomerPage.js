import { useParams } from "react-router-dom";
import { Container, Button, Tabs, Tab, Form, Row, Col } from "react-bootstrap";
import IsLoggedInLogic from "../../../components/IsLoggedInLogic";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import apiClient from "../../../service/api/api";
import moment from "moment";
import { Formik } from "formik";

function CustomerPage({ setLoggedIn, setLoginErrorMsg, showToast }) {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setLoggedIn
  );
  const { id } = useParams(); // parameter from url

  const [formGeneral, setFormGeneral] = useState({
    customer_name: "",
    status: "",
  });
  const [toggleEditForm, setToggleEditForm] = useState(true); // state of edit/save button
  const [key, setKey] = useState("general"); // current tab state

  // function to update customer
  const updateCustomer = (values) => {
    let url = "/api/v1/customer/" + id;
    apiClient
      .patch(url, values)
      .then((response) => {
        setToggleEditForm(!toggleEditForm)
        showToast("success", "Saved", "Event saved.");
      })
      .catch((err) => {
        showToast("danger", "Error", "Changes not saved. " + err.data.message, false);
      });
  };

  // fech data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const result = await apiClient.get(
        "/api/v1/customer/" + id,
      );
      setFormGeneral(result.data.data)
    };
    fetchData();
  }, []);


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
          <Tab eventKey="general" title="General" className="bg-darker">
            <Container className="py-3">
              <Formik initialValues={formGeneral}
                validateOnChange={true}
                enableReinitialize={true} onSubmit={(values) => {
                  updateCustomer(values);
                  // console.log(values);
                }}>
                {(props) => (
                  <>
                    <Row className="justify-content-end">
                      <Col className="col-auto">
                        <Button
                          variant={toggleEditForm ? "lime" : "success"}
                          onClick={() => {
                            !toggleEditForm ? props.submitForm() : setToggleEditForm(false);
                          }}
                        >
                          {toggleEditForm ? "Edit" : "Save"}
                        </Button>
                      </Col>
                    </Row>
                    <Row className="">
                      <Form.Group as={Col} controlId="formName">
                        <Form.Label>Customer Name</Form.Label>
                        <Form.Control
                          plaintext={toggleEditForm}
                          disabled={toggleEditForm}
                          type="text"
                          placeholder="Enter customer name"
                          onChange={props.handleChange('customer_name')}
                          value={props.values.customer_name}
                        />
                      </Form.Group>

                      <Form.Group as={Col} controlId="formContact">
                        <Form.Label>Contact Number</Form.Label>
                        <Form.Control
                          plaintext={toggleEditForm}
                          disabled={toggleEditForm}
                          onChange={props.handleChange('customer_contact')}
                          value={props.values.customer_contact}
                          type="text"
                          placeholder="Contact number"
                        />
                      </Form.Group>
                    </Row>
                  </>

                )}
              </Formik>
            </Container>
          </Tab>
          <Tab eventKey="assets" title="Assets" className="bg-darker">
            <p>tab 2</p>
          </Tab>
          <Tab eventKey="others" title="Others" className="bg-darker">
            <p>tab 3</p>
          </Tab>
        </Tabs>
      </Container>
    </div >
  );
}

export default CustomerPage;
