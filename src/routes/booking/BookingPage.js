import { useEffect, useState, Fragment, forwardRef } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Spinner,
  Card,
  Stack,
  Collapse,
} from "react-bootstrap";
import apiClient from "../../service/api/api";
import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import { Formik } from "formik";
import { Typeahead } from "react-bootstrap-typeahead";
import DatePicker from "react-datepicker";
import moment from "moment";
import { getDay, setHours, setMinutes, isDate, parse } from "date-fns";
import HistoryListItem from "../../components/modals/components/HistoryListItem";
import * as yup from "yup";

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
  const [expandHistory, setExpandHistory] = useState(false);

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
        actions.setSubmitting(false);
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

  // Form validation
  const reviewShema = yup.object({
    asset_id: yup
      .number(
        "You must select vehicle reg from the list, if not present please create asset first"
      )
      .moreThan(
        0,
        "You must select vehicle reg from the list, if not present please create asset first"
      ),
    customer_id: yup
      .number(
        "You must select vehicle reg from the list, if not present please create asset first"
      )
      .moreThan(
        0,
        "You must select customer from the list, if not present please create one first"
      ),
    description: yup
      .string()
      .min(3, "You must enter at least 3 characters")
      .required(),
    allowed_time: yup
      .number()
      .moreThan(0, "Allocated time need to be more then 0"),
    booked_date_time: yup
      .string()
      .matches(
        /^(\d{4})-(\d{2})-(\d{2}) (\d{1,2}):(\d{2})/,
        "Invalid date format,  'DD-MM-YYYY HH:MM'"
      ),
    allowed_time: yup.number().moreThan(0, "Selected time can't be 0"),
    others: yup.string().nullable().max(30, "Max 30 characters"),
    status: yup.string().required(),
    arrived_date: yup
      .string()
      .nullable()
      .matches(
        /^(\d{4})-(\d{2})-(\d{2}) (\d{1,2}):(\d{2})/,
        "Invalid date format,  'DD-MM-YYYY HH:MM'"
      ),
  });

  return initialValues ? (
    <Formik
      initialValues={initialValues}
      validationSchema={reviewShema}
      onSubmit={(values, actions) => {
        console.log("RUNNING SUBMIT!");
        actions.setSubmitting(true);
        handleSubmit(values, actions);
      }}
    >
      {(props) => (
        <div className="scroll">
          <Container>
            <Form onSubmit={props.handleSubmit}>
              <Row>
                <Container className=" py-3" style={{ maxheight: "100rem" }}>
                  <div className="sticky-top mb-3 top-0 start-0 bg-background-color">
                    <Stack direction="horizontal" gap={3}>
                      <h2>Booking details:</h2>
                      <div className="ms-auto">
                        <Row className="text-end">
                          <Col md="12">
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
                                className={`me-2 ${
                                  props.isSubmitting ? "" : "d-none"
                                }`}
                                role="status"
                                aria-hidden="true"
                              />
                              {!editToggled
                                ? "Edit"
                                : props.dirty
                                ? "Save"
                                : "Cancel"}
                            </Button>
                          </Col>
                          <Col>
                            <Form.Text className="text-danger">
                              {!props.isValid ? "Error in the form, review form!" : ""}
                            </Form.Text>
                          </Col>
                        </Row>
                      </div>
                    </Stack>
                    {/* NOTIFICATION */}
                    <Stack direction="horizontal">
                      <div className="ms-auto me-2">
                        <i
                          className={`fas ${
                            props.values.notification
                              ? "fa-bell text-success"
                              : "fa-bell-slash"
                          }`}
                        ></i>
                      </div>
                      <Form.Group controlId="formNotification">
                        <Form.Check
                          className="disable-select mt-0"
                          type="checkbox"
                          disabled={!editToggled}
                          label={<span>Send notification email</span>}
                          title="Check this to send notification email to customer about new booking"
                          name="notification"
                          checked={props.values.notification}
                          onChange={() => {
                            // change notification only if form changed....
                            if (props.dirty) {
                              props.setFieldValue(
                                "notification",
                                !props.values.notification
                              );
                            }
                          }}
                        />
                      </Form.Group>
                    </Stack>
                  </div>

                  <Card className="px-0">
                    <Card.Header>
                      <Stack direction="horizontal" gap={3}>
                        <h3>General</h3>
                        <div className="ms-auto">
                          Created date:{" "}
                          <span className="text-info">
                            {moment(props.values.created_at).format(
                              "DD-MM-YYYY H:mm"
                            )}
                          </span>
                        </div>
                      </Stack>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        {/* Job ID */}
                        <Form.Group as={Col} md="2">
                          <Form.Label column className="text-md-end">
                            Job ID
                          </Form.Label>
                          <Form.Control
                            name="id"
                            placeholder="Job ID"
                            readOnly={true}
                            // disabled={!editToggled}
                            disabled={true}
                            type="text"
                            title="Job ID, not editable data"
                            onChange={props.handleChange("others")}
                            defaultValue={props.values.id}
                            isInvalid={!!props.errors.id}
                          />
                        </Form.Group>

                        {/* Reg */}
                        <Form.Group as={Col} md="2" controlId="formReg">
                          <Form.Label column className="text-md-end">
                            Reg:
                          </Form.Label>

                          <Typeahead
                            id="asset-typeahead"
                            labelKey="reg"
                            disabled={!editToggled}
                            onChange={(selected) => {
                              // check if selection made, if not update formik to throw error.
                              if (selected.length > 0) {
                                props.setFieldValue(
                                  "asset_id",
                                  selected[0].asset_id
                                );
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
                        <Form.Group as={Col} md="5" controlId="formCustomer">
                          <Form.Label column className="text-md-end">
                            Customer:
                          </Form.Label>

                          <Typeahead
                            id="customer-typeahead"
                            labelKey="customer_name"
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
                            {props.touched.customer_id &&
                              props.errors.customer_id}
                          </Form.Text>
                        </Form.Group>

                        {/* STATUS */}
                        <Form.Group as={Col} md="3">
                          <Form.Label column className="text-md-end">
                            Status
                          </Form.Label>
                          <Form.Control
                            required
                            as="select"
                            type="select"
                            disabled={!editToggled}
                            defaultValue={props.values.status}
                            onChange={props.handleChange("status")}
                            isInvalid={!!props.errors.status}
                          >
                            <option disabled>-- select status --</option>
                            <option value="booked">Booked</option>
                            <option value="awaiting_labour">
                              Awaiting Labour
                            </option>
                            <option value="planned">Planned</option>
                            <option value="work_in_progress">
                              Work in Progress
                            </option>
                            <option value="awaiting_estimates">
                              Awaiting Estimates
                            </option>
                            <option value="awaiting_part">
                              Awaiting Parts
                            </option>
                            <option value="awaiting_authorisation">
                              Awaiting Authorisation
                            </option>
                            <option value="awaiting_qc">Awaiting QC</option>
                            <option value="at_3rd_party">At 3rd party</option>
                            <option value="completed">Completed</option>
                          </Form.Control>
                          <Form.Text className="text-danger ms-2">
                            {props.touched.status && props.errors.status}
                          </Form.Text>
                        </Form.Group>

                        <Col md="12">
                          <Row>
                            {/* Description */}
                            <Form.Group as={Col} md="8" className="mb-3">
                              <Form.Label column className="text-md-end">
                                Job Description
                              </Form.Label>
                              <Form.Control
                                className="mb-3d"
                                name="description"
                                placeholder="Enter description of the booking. (eg. PMI)"
                                disabled={!editToggled}
                                as="textarea"
                                rows={5}
                                onChange={props.handleChange("description")}
                                defaultValue={props.values.description}
                                isInvalid={!!props.errors.description}
                              />
                              <Form.Text className="text-danger">
                                {props.touched.description &&
                                  props.errors.description}
                              </Form.Text>
                            </Form.Group>

                            <Col md="4">
                              <Card className="px-0 mt-3">
                                <Card.Header>
                                  <h4>Job Type</h4>
                                </Card.Header>
                                <Card.Body className="">
                                  <Row>
                                    <Col md="12">
                                      {/* WAITING */}
                                      <Form.Group
                                        as={Row}
                                        controlId="formWaiting"
                                      >
                                        <Form.Label
                                          column
                                          className="text-md-end col-1"
                                        >
                                          <i
                                            className={`fas fa-clock ${
                                              props.values.waiting
                                                ? "text-info"
                                                : ""
                                            }`}
                                          ></i>
                                        </Form.Label>
                                        <Col className="col-10">
                                          <Form.Check
                                            className="disable-select mt-1 ms-2"
                                            type="checkbox"
                                            disabled={!editToggled}
                                            label="Waiting appointment"
                                            name="waiting"
                                            checked={props.values.waiting}
                                            onChange={() =>
                                              props.setFieldValue(
                                                "waiting",
                                                !props.values.waiting
                                              )
                                            }
                                          />
                                        </Col>
                                      </Form.Group>
                                    </Col>

                                    <Col md="12">
                                      {/* BREAKDOWN */}
                                      <Form.Group
                                        as={Row}
                                        controlId="formBreakdown"
                                      >
                                        <Form.Label
                                          column
                                          className="text-md-end col-1"
                                        >
                                          <i
                                            className={`fas fa-car-crash ${
                                              props.values.breakdown
                                                ? "text-danger"
                                                : ""
                                            }`}
                                          ></i>
                                        </Form.Label>
                                        <Col className="col-10 ms-2">
                                          <Form.Check
                                            className={`disable-select mt-1 ${
                                              props.values.breakdown
                                                ? "text-danger"
                                                : "text-info"
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
                                    </Col>
                                  </Row>
                                </Card.Body>
                              </Card>
                            </Col>

                            <Row className="m-0 p-0">
                              {/* OTHERS */}
                              <Form.Group as={Col} md="4">
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
                                  Booked date
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
                                  minTime={setHours(
                                    setMinutes(new Date(), 30),
                                    7
                                  )}
                                  maxTime={setHours(
                                    setMinutes(new Date(), 0),
                                    20
                                  )}
                                  highlightDates={[new Date()]}
                                  selected={
                                    new Date(props.values.booked_date_time)
                                  }
                                  onChange={(selected) => {
                                    console.log(selected);

                                    var newDate =
                                      moment(selected).format(
                                        "YYYY-MM-DD H:mm"
                                      );
                                    props.setFieldValue(
                                      "booked_date_time",
                                      newDate
                                    );
                                    setSelectedBookedDate(newDate);
                                  }}
                                />
                                <Form.Text className="text-danger ms-2">
                                  {props.touched.booked_date_time &&
                                    props.errors.booked_date_time}
                                </Form.Text>
                              </Form.Group>

                              {/* ALLOWED TIME */}
                              <Form.Group
                                as={Col}
                                md="4"
                                controlId="formAllowedTime"
                              >
                                <Form.Label column className="text-md-end">
                                  Allowed Time
                                </Form.Label>
                                <Row>
                                  <Col className="text-md-end col-2 col-sm-2">
                                    <Form.Label
                                      className={`text-${
                                        props.values.allowed_time > 0
                                          ? "success"
                                          : "danger"
                                      }`}
                                    >
                                      {props.values.allowed_time > 0
                                        ? props.values.allowed_time + " h"
                                        : 0 + " h"}
                                    </Form.Label>
                                  </Col>
                                  <Col>
                                    <Form.Range
                                      disabled={!editToggled}
                                      defaultValue={props.values.allowed_time}
                                      onChange={props.handleChange(
                                        "allowed_time"
                                      )}
                                      max={20}
                                    />
                                  </Col>
                                </Row>
                                <Form.Text className="text-danger ms-2">
                                  {props.touched.allowed_time &&
                                    props.errors.allowed_time}
                                </Form.Text>
                              </Form.Group>
                            </Row>
                          </Row>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Card className="px-0 mt-3">
                    <Card.Header>
                      <h3>Additional</h3>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        {/* SPECIAL INSTRUCTIONS */}
                        <Form.Group as={Col} md="12">
                          <Form.Label column className="text-md-end">
                            Special Instructions on drop off
                          </Form.Label>
                          <Form.Control
                            name="others"
                            placeholder="Additional informations regarding booking provided when vehicle received from customer"
                            onChange={props.handleChange("others")}
                            disabled={!editToggled}
                            defaultValue={props.values.special_instructions}
                            isInvalid={!!props.errors.special_instructions}
                          />
                          <Form.Text className="text-danger ms-2">
                            {props.touched.special_instructions &&
                              props.errors.special_instructions}
                          </Form.Text>
                        </Form.Group>

                        <Row className="p-0 m-0">
                          {/* KEY LOCATION */}
                          <Form.Group as={Col} md="3">
                            <Form.Label column className="text-md-end">
                              Key location
                            </Form.Label>
                            <Form.Control
                              name="others"
                              placeholder="Peg number"
                              onChange={props.handleChange("others")}
                              disabled={!editToggled}
                              defaultValue={props.values.key_location}
                              isInvalid={!!props.errors.key_location}
                            />
                            <Form.Text className="text-danger ms-2">
                              {props.touched.key_location &&
                                props.errors.key_location}
                            </Form.Text>
                          </Form.Group>
                        </Row>

                        {/* UUID */}
                        <Form.Group as={Col} md="6">
                          <Form.Label column className="text-md-end">
                            Job UUID
                          </Form.Label>
                          <Form.Control
                            name="others"
                            placeholder="Uniqal ID for a job."
                            title="Job UUID, not editable data"
                            readOnly={true}
                            disabled={true}
                            defaultValue={props.values.uuid}
                            isInvalid={!!props.errors.uuid}
                          />
                          <Form.Text className="text-danger ms-2">
                            {props.touched.uuid && props.errors.uuid}
                          </Form.Text>
                        </Form.Group>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Card className="px-0 mt-3">
                    <Card.Header>
                      <h3>Job Notes</h3>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Form.Group as={Col} md="8">
                          <Form.Label column className="text-md-end">
                            Free text
                          </Form.Label>
                          <Form.Control
                            className="mb-3d"
                            name="free_text"
                            placeholder="Job description text"
                            disabled={!editToggled}
                            as="textarea"
                            rows={5}
                            onChange={props.handleChange("free_text")}
                            defaultValue={props.values.free_text}
                            isInvalid={!!props.errors.free_text}
                          />
                          <Form.Text className="text-danger">
                            {props.touched.free_text && props.errors.free_text}
                          </Form.Text>
                        </Form.Group>

                        <Form.Group as={Col} md="4">
                          <Form.Label column className="text-md-end">
                            Arrived date
                          </Form.Label>
                          <Form.Control
                            name="arrived_date"
                            placeholder="Date and time when vehilce arrived"
                            onChange={props.handleChange("arrived_date")}
                            disabled={!editToggled}
                            defaultValue={
                              props.values.arrived_date
                                ? moment(props.values.arrived_date).format(
                                    "DD-MM-Y HH:mm:ss "
                                  )
                                : ""
                            }
                            isInvalid={!!props.errors.arrived_date}
                          />
                          <Form.Text className="text-danger ms-2">
                            {props.touched.arrived_date &&
                              props.errors.arrived_date}
                          </Form.Text>
                        </Form.Group>
                        <Form.Label column className="text-md-end"></Form.Label>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Card className="px-0 my-3">
                    <Card.Header>
                      <Stack direction="horizontal">
                        <h3>Job History</h3>
                        <i
                          className={`cursor-pointer ms-auto fa-lg fas ${
                            expandHistory ? "fa-compress-alt" : "fa-expand-alt"
                          }`}
                          // className="cursor-pointer ms-auto fas fa-expand-arrows-alt"
                          onClick={() => setExpandHistory(!expandHistory)}
                        ></i>
                      </Stack>
                    </Card.Header>
                    <Card.Body>
                      <Container className="px-0" fluid>
                        <Collapse in={true}>
                          <div
                            id="example-collapse-text"
                            className="overflow-auto"
                            style={expandHistory ? {} : { maxHeight: "12rem" }}
                            // style={{ maxHeight: "12rem" }}
                          >
                            {initialValues.activities.map((element, i) => {
                              return (
                                <HistoryListItem
                                  key={i}
                                  date={moment(element.updated_at).format(
                                    "HH:mm:ss DD-MM-Y"
                                  )}
                                  description={element.description}
                                  properties={element.properties}
                                />
                              );
                            })}
                          </div>
                        </Collapse>
                      </Container>
                    </Card.Body>
                  </Card>
                </Container>
              </Row>
            </Form>
          </Container>
        </div>
      )}
    </Formik>
  ) : (
    <span>loading...</span>
  );
};

export default BookingPage;
