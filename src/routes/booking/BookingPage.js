import { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import { Container, Form, Row, Col, Button, Spinner } from "react-bootstrap";
import apiClient from "../../service/api/api";
import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import { Formik } from "formik";
import { Typeahead } from "react-bootstrap-typeahead";

const BookingPage = ({
  toast,
  setIsLoading,
  setLoggedIn,
  setLoginErrorMsg,
}) => {
  const { uuid } = useParams(); // parameter from url
  const [initialValues, setInitialValues] = useState();
  const [assets, setAssets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editToggled, setEditToggled] = useState(false);

  // when page oppened check if user logged in, if not redirect to login page
  const {} = IsLoggedInLogic(setLoginErrorMsg, setIsLoading, setLoggedIn);

  //get assets
  const getEventData = () => {
    let url = "/api/v1/event_uuid/" + uuid;
    apiClient
      .get(url)
      .then((response) => {
        console.log(response.data.event);
        setInitialValues(response.data.event);
      })
      .catch((err) => {
        toast.error(err.statusText);
        console.log("Error while loading booking data:", err);
      });
  };

  //get assets
  const getAssets = () => {
    let url = "/api/v1/assets";
    apiClient
      .get(url)
      .then((response) => {
        setAssets(response.data.data);
      })
      .catch((err) => {
        console.log("error:", err);
      });
  };
  //get customers
  const getCustomers = () => {
    let url = "/api/v1/customers";
    apiClient
      .get(url)
      .then((response) => {
        console.log(response.data.data);

        setCustomers(response.data.data);
      })
      .catch((err) => {
        console.log("error:", err);
      });
  };

  // Submit function
  const handleSubmit = (values, actions) => {
    let url = "/api/v1/event_uuid/" + initialValues.event_id;
    console.log("VALUES: ", values);
    // setWaitingResponse(true);

    apiClient
      .patch(url, values)
      .then(() => {
        setEditToggled(false);
        actions.resetForm();
        toast.success("Booking updated successfully");
      })
      .catch((err) => {
        console.log("error:", err);
        // setWaitingResponse(false);
        toast.error(err.statusText + " - Event NOT updated!");
      });
  };

  useEffect(() => {
    getEventData();
    getAssets();
    getCustomers();
  }, []);

  return initialValues ? (
    <Formik
      initialValues={initialValues}
      // validationSchema={reviewShema}
      onSubmit={(values, actions) => {
        console.log("RUNNING SUBMIT!");
        actions.setSubmitting(true);
        handleSubmit(values, actions);
      }}
    >
      {(props) => (
        <Container>
          <Form onSubmit={props.handleSubmit}>
            <Row className="row">
              <Container className="scroll py-3">
                <Row>
                  <Col className="col-8">
                    <h2>Booking details:</h2>
                  </Col>
                  <Col className="col-4 text-end">
                    <Button
                      disabled={props.isSubmitting}
                      variant={
                        !editToggled
                          ? "info"
                          : !props.dirty
                          ? "light"
                          : "success"
                      }
                      onClick={() => {
                        if (!editToggled) {
                          setEditToggled(true);
                        } else {
                          if (props.dirty) {
                            props.submitForm();
                          } else {
                            setEditToggled(false);
                          }
                        }
                      }}
                    >
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        className={`me-2 ${props.isSubmitting ? "" : "d-none"}`}
                        role="status"
                        aria-hidden="true"
                      />
                      {!editToggled ? "Edit" : props.dirty ? "Save" : "Cancel"}
                    </Button>
                  </Col>
                </Row>
                Booking page for event id: {uuid}
              </Container>

              {/* Job ID */}
              <Form.Group as={Col} md="4">
                <Form.Label column className="text-md-end">
                  Job ID
                </Form.Label>
                <Form.Control
                  name="id"
                  placeholder="Job ID"
                  readOnly={true}
                  plaintext={true}
                  disabled={!editToggled}
                  type="text"
                  title="Job ID, not editable data"
                  onChange={props.handleChange("others")}
                  defaultValue={props.values.id}
                  isInvalid={!!props.errors.id}
                />
              </Form.Group>

              {/* Reg */}
              <Form.Group as={Col} md="4" controlId="formReg">
                <Form.Label column className="text-md-end">
                  Reg:
                </Form.Label>

                <Typeahead
                  id="asset-typeahead"
                  labelKey="reg"
                  // disabled
                  plaintext={!editToggled}
                  disabled={!editToggled}
                  onChange={(selected) => {
                    // check if selection made, if not update formik to throw error.
                    if (selected.length > 0) {
                      props.setFieldValue("asset_id", selected[0].asset_id);
                    } else {
                      props.setFieldValue("asset_id", 0);
                    }
                  }}
                  options={assets}
                  isInvalid={!!props.errors.asset_id}
                  placeholder="Choose vehicle reg from the list"
                  defaultSelected={[props.values.reg]}
                />
                <Form.Text className="text-danger">
                  {props.touched.asset_id && props.errors.asset_id}
                </Form.Text>
              </Form.Group>

              {/* Customer */}
              <Form.Group as={Col} md="4" controlId="formCustomer">
                <Form.Label column className="text-md-end">
                  Customer:
                </Form.Label>

                <Typeahead
                  id="customer-typeahead"
                  labelKey="customer_name"
                  plaintext={!editToggled}
                  disabled={!editToggled}
                  onChange={(selected) => {
                    // check if selection made, if not update formik to throw error.
                    if (selected.length > 0) {
                      props.setFieldValue(
                        "customer_id",
                        selected[0].customer_id
                      );
                    } else {
                      props.setFieldValue("customer_id", 0);
                    }
                  }}
                  options={customers}
                  isInvalid={!!props.errors.customer_id}
                  // value={props.values.customer_name || ""}
                  placeholder="Select customer from the list"
                  defaultSelected={[props.values.customer_name]}
                />
                <Form.Text className="text-danger">
                  {props.touched.customer_id && props.errors.customer_id}
                </Form.Text>
              </Form.Group>
            </Row>
          </Form>
        </Container>
      )}
    </Formik>
  ) : (
    <span>loading...</span>
  );
};

export default BookingPage;
