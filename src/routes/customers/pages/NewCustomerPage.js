// import { useParams } from "react-router-dom";
import {
  Container,
  Button,
  Card,
  Spinner,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import IsLoggedInLogic from "../../../components/IsLoggedInLogic";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import apiClient from "../../../service/api/api";
import moment from "moment";
import { Formik } from "formik";
import { useHistory } from "react-router-dom";

function NewCustomerPage({ setLoggedIn, setLoginErrorMsg, toast }) {
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

  // function to add new customer
  function handleSubmit(values, { setSubmitting }) {
    async function saveCustomer() {
      let url = "/api/v1/customer";
      try {
        const resp = await apiClient.post(url, values);
        console.log(resp.data);
        toast.success("New customer added.");
        setSubmitting(false);
        history.push("/customers/" + resp.data.id);
      } catch (err) {
        // Handle Error Here
        toast.warn(
          "New Customer not saved! " + JSON.stringify(err.data.message)
        );
        console.error(err);
        setSubmitting(false);
      }
    }
    saveCustomer();
  }

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
          onSubmit={handleSubmit}
        >
          {(props) => (
            <>
              <Container className="my-2 mb-4">
                <div className="row justify-content-between">
                  <div className="col-12 col-md-4 mb-3">
                    <Button
                      className="mt-1"
                      variant="light"
                      onClick={() => history.goBack()}
                    >
                      Back
                    </Button>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="row mx-auto my-2">
                      <div className="col-auto my-auto">
                        <div className="number-circle-large fs-2 text-pink text-uppercase">
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

              <Container>
                <Card.Title>Add New Customer</Card.Title>

                <Row className="mb-4 mt-2 g-3">
                  <Form.Group
                    as={Col}
                    className="col-12 col-md-6"
                    controlId="formName"
                  >
                    <Form.Label>Customer Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter customer name"
                      onChange={props.handleChange("customer_name")}
                      value={props.values.customer_name}
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    className="col-12 col-md-6"
                    controlId="formContact"
                  >
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control
                      onChange={props.handleChange("customer_contact")}
                      value={props.values.customer_contact}
                      type="text"
                      placeholder="Contact number"
                    />
                  </Form.Group>
                </Row>
                <Row className="justify-content-end">
                  <div className="col-12 col-md-3 align-self-end text-end">
                    <div className="d-grid">
                      <Button
                        variant="success"
                        disabled={props.isSubmitting}
                        onClick={() => props.submitForm()}
                      >
                        {props.isSubmitting ? (
                          <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        ) : (
                          ""
                        )}
                        Save
                      </Button>
                    </div>
                  </div>
                </Row>
              </Container>
            </>
          )}
        </Formik>
      </Container>
    </div>
  );
}

export default NewCustomerPage;
