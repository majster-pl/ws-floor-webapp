// import { useParams } from "react-router-dom";
import { Container, Button, Card, Tab, Form, Row, Col } from "react-bootstrap";
import IsLoggedInLogic from "../../../components/IsLoggedInLogic";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import apiClient from "../../../service/api/api";
import moment from "moment";
import { Formik } from "formik";
import { useHistory } from "react-router-dom";

function NewCustomerPage({ setLoggedIn, setLoginErrorMsg, showToast }) {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setLoggedIn
  );
  const history = useHistory();

  const [formGeneral, setFormGeneral] = useState({
    customer_name: "",
    status: "",
    assets_total: "",
    created_at: "",
    customer_contact: "",
  });
  const [key, setKey] = useState("general"); // current tab state

  // function to update customer
  const saveCustomer = (values) => {
    let url = "/api/v1/customer/";
    apiClient
      .post(url, values)
      .then((response) => {
        console.log(response);

        showToast("success", "Saved", "New customer added.");
        history.push("/customers");
      })
      .catch((err) => {
        showToast(
          "danger",
          "Error",
          "New Customer not saved! " + err.data.message,
          false
        );
      });
  };

  //if still waiting response from server then display spinner
  if (isLoading) {
    return <SpinnerComponent />;
  }

  return (
    <div className="scroll">
      <Container className="py-3">
        <Formik
          initialValues={formGeneral}
          validateOnChange={true}
          enableReinitialize={true}
          onSubmit={(values) => {
            saveCustomer(values);
            // console.log(values);
          }}
        >
          {(props) => (
            <>
              <Container className="my-1 mb-5">
                <div className="row justify-content-between">
                  <div className="col-4 px-0">
                    <Button
                      className="my-auto"
                      variant="light"
                      as={Link}
                      to={"/customers"}
                    >
                      Back
                    </Button>
                  </div>
                  <div className="col-6">
                    <div className="row">
                      <div className="col-auto my-auto">
                        <div className="numberCircle fs-3 text-pink text-uppercase">
                          {props.values.customer_name !== ""
                            ? props.values.customer_name
                                .match(/\b(\w)/g)
                                .join("")
                                .substring(0, 2)
                            : "..."}
                        </div>
                      </div>
                      <div className="col text-start">
                        <div className="fs-4">{props.values.customer_name}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Container>

              <Card.Title>Add New Customer</Card.Title>

              <Row className="my-4">
                <Form.Group as={Col} controlId="formName">
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter customer name"
                    onChange={props.handleChange("customer_name")}
                    value={props.values.customer_name}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formContact">
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                    onChange={props.handleChange("customer_contact")}
                    value={props.values.customer_contact}
                    type="text"
                    placeholder="Contact number"
                  />
                </Form.Group>
              </Row>

              <Button variant="success" onClick={() => props.submitForm()}>
                Save
              </Button>
            </>
          )}
        </Formik>
      </Container>
    </div>
  );
}

export default NewCustomerPage;
