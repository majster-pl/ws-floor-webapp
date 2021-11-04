import { useEffect, useState, Fragment, forwardRef } from "react";
import { useParams } from "react-router-dom";
import { Container, Form, Row, Col, Button, Spinner, ToggleButton } from "react-bootstrap";
import apiClient from "../../service/api/api";
import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import { Formik } from "formik";
import { Typeahead } from "react-bootstrap-typeahead";
import DatePicker from "react-datepicker";
import moment from "moment";
import { getDay, setHours, setMinutes, isDate, parse } from "date-fns";

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
  const [selectedBookedDate, setSelectedBookedDate] = useState();

  // when page oppened check if user logged in, if not redirect to login page
  const {} = IsLoggedInLogic(setLoginErrorMsg, setIsLoading, setLoggedIn);

  const isWeekday = (date) => {
    const day = getDay(date);
    return day !== 0 && day !== 6;
  };

  //get assets
  const getEventData = () => {
    let url = "/api/v1/event_uuid/" + uuid;
    apiClient
      .get(url)
      .then((response) => {
        console.log(response.data.event);
        setInitialValues(response.data.event);
        setSelectedBookedDate(
          moment(response.data.event.booked_date_time).format("YYYY-MM-DD H:mm")
        );
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
      .then((response) => {
        setEditToggled(false);
        toast.success("Booking updated successfully");
        setInitialValues(null);
        setInitialValues(response.data.event);
        actions.setSubmitting(false);
        // actions.resetForm();
      })
      .catch((err) => {
        console.log("error:", err);
        // setWaitingResponse(false);
        toast.error(err.statusText + " - Event NOT updated!");
      });
  };

  // Date picker
  const CustomDateInput = forwardRef(
    ({ onClick, disabled_, selected }, ref) => (
      <Form.Control
        name="booked_at"
        onClick={onClick}
        disabled={disabled_}
        placeholder="Booked date"
        defaultValue={moment(selected).format("DD-MM-YYYY H:mm")}
        readOnly
      />
    )
  );

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
        <Container className="scroll">
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

              {/* Description */}
              <Form.Group as={Col} md="8">
                <Form.Label column className="text-md-end">
                  Job Description
                </Form.Label>
                <Form.Control
                  name="description"
                  placeholder="Enter description of the booking. (eg. PMI)"
                  // plaintext={!editToggled}
                  disabled={!editToggled}
                  // type="text"
                  as="textarea"
                  rows={4}
                  onChange={props.handleChange("description")}
                  defaultValue={props.values.description}
                  isInvalid={!!props.errors.description}
                />
                <Form.Text className="text-danger">
                  {props.touched.description && props.errors.description}
                </Form.Text>
              </Form.Group>

              <Col md="4">
                <Form.Label column className="text-md-end">
                  Additional
                </Form.Label>
                <Row>
                  {/* WAITING */}
                  <Form.Group as={Row} controlId="formWaiting">
                    <Form.Label column className="text-md-end col-1 col-sm-3">
                      <i
                        className={`fas fa-clock ${
                          props.values.waiting ? "text-info" : ""
                        }`}
                      ></i>
                    </Form.Label>
                    <Col className="col-11 col-sm-9">
                      <Form.Check
                        className="disable-select mt-1"
                        type="checkbox"
                        disabled={!editToggled}
                        label="Waiting appointment"
                        name="waiting"
                        checked={props.values.waiting}
                        onChange={() =>
                          props.setFieldValue("waiting", !props.values.waiting)
                        }
                      />
                    </Col>
                  </Form.Group>

                  {/* BREAKDOWN */}
                  <Form.Group as={Row} controlId="formBreakdown">
                    <Form.Label column className="text-md-end col-1 col-sm-3">
                      <i
                        className={`fas fa-car-crash ${
                          props.values.breakdown ? "text-danger" : ""
                        }`}
                      ></i>
                    </Form.Label>
                    <Col className="col-11 col-sm-9">
                      <Form.Check
                        className={`disable-select mt-1 ${
                          props.values.breakdown ? "text-danger" : "text-info"
                        }`}
                        type="checkbox"
                        disabled={!editToggled}
                        label={<span>Breakdown</span>}
                        name="waiting"
                        checked={props.values.breakdown}
                        onChange={() =>
                          props.setFieldValue(
                            "breakdown",
                            !props.values.breakdown
                          )
                        }
                      />
                    </Col>
                  </Form.Group>

                  {/* NOTIFICATION */}
                  <Form.Group as={Row} controlId="formNotification">
                    <Form.Label column className="text-md-end col-1 col-sm-3">
                      <i
                        className={`fas ${
                          props.values.notification
                            ? "fa-bell text-success"
                            : "fa-bell-slash"
                        }`}
                      ></i>
                    </Form.Label>
                    <Col className="col-11 col-sm-9">
                      <Form.Check
                        className="disable-select mt-1"
                        type="checkbox"
                        disabled={!editToggled}
                        label={<span>Send confirmation email</span>}
                        title="Check this to send notification email to customer about new booking"
                        name="notification"
                        checked={props.values.notification}
                        onChange={() =>
                          props.setFieldValue(
                            "notification",
                            !props.values.notification
                          )
                        }
                      />
                    </Col>
                  </Form.Group>
                </Row>
              </Col>

              {/* OTHERS */}
              <Form.Group as={Col} md="8">
                <Form.Label column className="text-md-end">
                  Others
                </Form.Label>
                <Form.Control
                  name="others"
                  placeholder="Additional informations (eg. C+D, CV)"
                  onChange={props.handleChange("others")}
                  disabled={!editToggled}
                  defaultValue={props.values.others}
                  isInvalid={!!props.errors.others}
                />
                <Form.Text className="text-danger ms-2">
                  {props.touched.others && props.errors.others}
                </Form.Text>
              </Form.Group>

              {/* BOOKED DATE */}
              <Form.Group as={Col} md="4">
                <Form.Label column className="text-md-end">
                  Booked date:
                </Form.Label>
                <DatePicker
                  style={{ display: "revert" }}
                  dateFormat="dd-MM-yyyy H:mm"
                  calendarStartDay={1}
                  // disabled={!editToggled}
                  showTimeSelect
                  customInput={
                    <CustomDateInput
                      disabled_={!editToggled}
                      selected={selectedBookedDate}
                    />
                  }
                  closeOnScroll={true}
                  // todayButton="This Week"
                  filterDate={isWeekday}
                  // TODO: enable posibility to adjust opening times
                  minTime={setHours(setMinutes(new Date(), 30), 7)}
                  maxTime={setHours(setMinutes(new Date(), 0), 20)}
                  highlightDates={[new Date()]}
                  selected={new Date(props.values.booked_date_time)}
                  onChange={(selected) => {
                    console.log(selected);

                    var newDate = moment(selected).format("YYYY-MM-DD H:mm");
                    props.setFieldValue("booked_date_time", newDate);
                    setSelectedBookedDate(newDate);
                  }}
                />
                <Form.Text className="text-danger ms-2">
                  {props.touched.booked_date_time &&
                    props.errors.booked_date_time}
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
