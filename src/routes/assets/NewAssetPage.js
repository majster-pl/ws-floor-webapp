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
import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import { useState } from "react";
import apiClient from "../../service/api/api";
import { Formik } from "formik";
import { useHistory } from "react-router-dom";

function NewAssetPage({ setIsLoading, setLoggedIn, setLoginErrorMsg, toast }) {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setIsLoading,
    setLoggedIn
  );
  const history = useHistory();

  const [formGeneral, setFormGeneral] = useState({
    reg: "",
    make: "",
    model: "",
    created_at: "",
    status: "",
  });
  const [key, setKey] = useState("general"); // current tab state

  // function to add new customer
  function handleSubmit(values, { setSubmitting }) {
    async function saveCustomer() {
      let url = "/api/v1/assets";
      try {
        const resp = await apiClient.post(url, values);
        console.log(resp.data);
        toast.success("New asset added.");
        setSubmitting(false);
        history.push("/assets/" + resp.data.id);
      } catch (err) {
        // Handle Error Here
        toast.error("New Asset not saved! " + JSON.stringify(err.data.message));
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
                      {/* <div className="col-auto my-auto">
                        <div className="number-circle-large fs-2 text-pink text-uppercase">
                          {props.values.reg !== ""
                            ? props.values.reg
                                .match(/\b(\w)/g)
                                .join("")
                                .substring(0, 2)
                            : "..."}
                        </div>
                      </div> */}
                      <div className="col text-start">
                        <div className="fs-4 text-uppercase">
                          {props.values.reg}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Container>

              <Container>
                <Card.Title>Add Asset</Card.Title>

                <Row className="mb-4 mt-2 g-3">
                  <Form.Group
                    as={Col}
                    className="col-12 col-md-6"
                    controlId="formName"
                  >
                    <Form.Label>Reg</Form.Label>
                    <Form.Control
                      maxLength={7}
                      type="text"
                      placeholder="Vehicle Reg"
                      onChange={props.handleChange("reg")}
                      value={props.values.reg.toUpperCase()}
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    className="col-12 col-md-6"
                    controlId="formContact"
                  >
                    <Form.Label>Make</Form.Label>
                    <Form.Control
                      onChange={props.handleChange("make")}
                      value={props.values.make}
                      type="text"
                      placeholder="Vehicle Make"
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    className="col-12 col-md-6"
                    controlId="formContact"
                  >
                    <Form.Label>Model</Form.Label>
                    <Form.Control
                      onChange={props.handleChange("model")}
                      value={props.values.model}
                      type="text"
                      placeholder="Vehicel Model"
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    className="col-12 col-md-6"
                    controlId="formStatus"
                  >
                    <Form.Label>Status:</Form.Label>
                    <Form.Control
                      as="select"
                      onChange={props.handleChange("status")}
                    >
                      <option disabled selected></option>
                      <option
                        value="active"
                        selected={"active" == props.values.status}
                      >
                        Active
                      </option>
                      <option
                        value="key_fleet"
                        selected={"key_fleet" == props.values.status}
                      >
                        Key Fleet
                      </option>
                      <option
                        value="on_hold"
                        selected={"on_hold" == props.values.status}
                      >
                        On Hold
                      </option>
                    </Form.Control>
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

export default NewAssetPage;
