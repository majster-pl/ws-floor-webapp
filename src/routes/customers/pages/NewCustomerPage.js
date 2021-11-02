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
import { useState } from "react";
import apiClient from "../../../service/api/api";
import { Formik } from "formik";
import { useHistory } from "react-router-dom";
import * as yup from "yup";

function NewCustomerPage({
  setIsLoading,
  setLoggedIn,
  setLoginErrorMsg,
  toast,
}) {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setIsLoading,
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

    const phoneRegExp =
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const reviewSchema = yup.object({
      customer_contact: yup
        .string()
        .required()
        .matches(phoneRegExp, "Phone number is not valid"),
      customer_name: yup
        .string()
        .min(3, "Customer name must be at least 3 characters"),
      email: yup.string().email(),
    });


  // function to add new customer
  function handleSubmit(values, { setSubmitting }) {
    async function saveCustomer() {
      let url = "/api/v1/customers";
      try {
        const resp = await apiClient.post(url, values);
        console.log(resp.data);
        toast.success("New customer added.");
        setSubmitting(false);
        history.push("/customers/" + resp.data.uuid);
      } catch (err) {
        // Handle Error Here
        console.log(err.data);
        
        toast.error(
          "New Customer not saved! " + JSON.stringify(err.data.message)
        );
        console.error(err);
        setSubmitting(false);
      }
    }
    saveCustomer();
  }

  return (
    <div className="scroll">
      <Container className="py-3">
        <Formik
          initialValues={formGeneral}
          validateOnChange={true}
          validationSchema={reviewSchema}
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
                      // //plaintext={toggleEditForm}
                      //disabled={toggleEditForm}
                      type="text"
                      isInvalid={
                        props.touched.customer_name &&
                        props.errors.customer_name
                      }
                      placeholder="Enter customer name"
                      onChange={props.handleChange("customer_name")}
                      value={props.values.customer_name}
                    />
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {props.touched.customer_name &&
                        props.errors.customer_name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    className="col-12 col-md-6"
                    controlId="formContact"
                  >
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control
                      //plaintext={toggleEditForm}
                      //disabled={toggleEditForm}
                      isInvalid={
                        props.touched.customer_contact &&
                        props.errors.customer_contact
                      }
                      onChange={props.handleChange("customer_contact")}
                      value={props.values.customer_contact}
                      type="text"
                      placeholder="Contact number"
                    />
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {props.touched.customer_contact &&
                        props.errors.customer_contact}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    className="col-12 col-md-6"
                    controlId="formMail"
                  >
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      //plaintext={toggleEditForm}
                      //disabled={toggleEditForm}
                      onChange={props.handleChange("email")}
                      value={props.values.email}
                      isInvalid={props.touched.email && props.errors.email}
                      type="text"
                      placeholder="Contact email"
                    />
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {props.touched.email && props.errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="justify-content-end">
                  <div className="col-12 col-md-3 align-self-end text-end">
                    <div className="d-grid">
                      <Button
                        variant="success"
                        disabled={props.isSubmitting || !props.dirty}
                        onClick={() => props.submitForm()}
                      >
                        {props.isSubmitting ? (
                          <>
                            <Spinner
                              className="mx-2"
                              as="span"
                              animation="grow"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                            Saving...
                          </>
                        ) : (
                          "Save"
                        )}
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
