import { useState, useEffect, Fragment, forwardRef } from "react";
import {
  Row,
  Col,
  Modal,
  Form,
  Button,
  Container,
  Collapse,
} from "react-bootstrap";
import { Formik } from "formik";
import apiClient from "../../service/api/api";
import * as yup from "yup";
import moment from "moment";
import { Typeahead } from "react-bootstrap-typeahead";
import DatePicker from "react-datepicker";
import { getDay, setHours, setMinutes, isDate, parse } from "date-fns";
import HistoryListItem from "./components/HistoryListItem";

const UpdateStatus = ({
  data,
  handleCloseMainModal,
  toast,
  reloadCalendar,
}) => {
  const [assets, setAssets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedBookedDate, setSelectedBookedDate] = useState(() => {
    return moment(data.booked_date_time).format("YYYY-MM-DD H:mm");
  });
  const [open, setOpen] = useState(false);

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
    description: yup.string().min(3, "You must enter at least 3 characters"),
    allowed_time: yup
      .number()
      .moreThan(0, "Allocated time need to be more then 0"),
    booked_date_time: yup
      .string()
      .matches(
        /^(\d{4})-(\d{2})-(\d{2}) (\d{1,2}):(\d{2})/,
        "Invalid date format,  'DD-MM-YYYY HH:MM'"
      ),
    others: yup.string().nullable().max(30, "Max 30 characters"),
    status: yup.string().required(),
  });

  // Submit function
  const handleSubmit = (values) => {
    let url = "/api/v1/events/" + data.event_id;
    console.log("VALUES: ", values);

    apiClient
      .patch(url, values)
      .then((response) => {
        console.log(response.data);
        handleCloseMainModal();
        reloadCalendar();
        toast.success("Event saved.");
      })
      .catch((err) => {
        console.log("error:", err);
        toast.error(err.statusText + " - Event NOT saved!");
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
        setCustomers(response.data.data);
      })
      .catch((err) => {
        console.log("error:", err);
      });
  };
  function formatDate(date) {
    return new Date(date).toLocaleDateString();
  }
  const isWeekday = (date) => {
    const day = getDay(date);
    return day !== 0 && day !== 6;
  };

  useEffect(() => {
    // console.log("DATA:", data);
    getAssets();
    getCustomers();
  }, []);

  //// components:
  // Date picker
  const CustomDateInput = forwardRef(({ onClick, selected }, ref) => (
    <Form.Control
      name="booked_at"
      onClick={onClick}
      placeholder="Booked date"
      defaultValue={moment(selected).format("DD-MM-YYYY H:mm")}
      readOnly
    />
  ));

  return (
    <>
      <Formik
        initialValues={{ ...data }}
        validationSchema={reviewShema}
        onSubmit={(values, actions) => {
          console.log("RUNNING SUBMIT!");
          handleSubmit(values);
          actions.setSubmitting(false);
        }}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <Modal.Header>
              <Modal.Title>
                <h3 className="my-auto">Edit Booking</h3>
              </Modal.Title>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleCloseMainModal}
              ></button>
            </Modal.Header>
            <Modal.Body>
              {/* Reg */}
              <Form.Group className="" as={Row} controlId="formReg">
                <Form.Label column sm="3" className="text-md-end">
                  Reg:
                </Form.Label>
                <Col sm="9">
                  <Fragment>
                    <Form.Group>
                      <Typeahead
                        id="asset-typeahead"
                        labelKey="reg"
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
                        value={props.values.reg || ""}
                        placeholder="Choose vehicle reg from the list"
                        defaultSelected={[props.values.reg]}
                      />
                    </Form.Group>
                  </Fragment>
                  <Form.Text className="text-danger ms-2">
                    {props.touched.asset_id && props.errors.asset_id}
                  </Form.Text>
                </Col>
              </Form.Group>

              {/* Customer */}
              <Form.Group className="" as={Row} controlId="formCustomer">
                <Form.Label column sm="3" className="text-md-end">
                  Customer:
                </Form.Label>
                <Col sm="9">
                  <Fragment>
                    <Form.Group>
                      <Typeahead
                        id="customer-typeahead"
                        labelKey="customer_name"
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
                        value={props.values.customer_name || ""}
                        placeholder="Select customer from the list"
                        defaultSelected={[props.values.customer_name]}
                      />
                    </Form.Group>
                  </Fragment>
                  <Form.Text className="text-danger ms-2">
                    {props.touched.customer_id && props.errors.customer_id}
                  </Form.Text>
                </Col>
              </Form.Group>

              {/* DESCRIPTION */}
              <Form.Group as={Row} controlId="formDescription">
                <Form.Label column sm="3" className="text-md-end ">
                  Description:
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    placeholder="Enter description of the booking. (eg. PMI)"
                    onChange={props.handleChange("description")}
                    isInvalid={!!props.errors.description}
                    value={props.values.description || ""}
                  />
                  <Form.Text className="text-danger ms-2">
                    {props.touched.description && props.errors.description}
                  </Form.Text>
                </Col>
              </Form.Group>

              {/* ALLOWED TIME */}
              <Form.Group as={Row} controlId="formAllowedTime">
                <Form.Label column sm="3" className="text-md-end">
                  Allowed time:
                </Form.Label>
                <Col sm="9">
                  <Row>
                    <Col className="col-md-2">
                      <Form.Label
                        className={`text-${
                          props.values.allowed_time > 0 ? "success" : "danger"
                        }`}
                      >
                        {props.values.allowed_time + " h"}
                      </Form.Label>
                    </Col>
                    <Col>
                      <Form.Range
                        defaultValue={props.values.allowed_time || 1}
                        onChange={props.handleChange("allowed_time")}
                        max={20}
                      />
                    </Col>
                  </Row>
                  <Form.Text className="text-danger ms-2">
                    {props.touched.allowed_time && props.errors.allowed_time}
                  </Form.Text>
                </Col>
              </Form.Group>

              {/* BOOKED DATE */}
              <Form.Group as={Row}>
                <Form.Label column sm="3" className="text-md-end">
                  Booked date:
                </Form.Label>
                <Col sm="9">
                  <DatePicker
                    style={{ display: "revert" }}
                    dateFormat="dd-MM-yyyy H:mm"
                    calendarStartDay={1}
                    showTimeSelect
                    customInput={
                      <CustomDateInput selected={selectedBookedDate} />
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
                </Col>
              </Form.Group>

              {/* OTHERS */}
              <Form.Group as={Row}>
                <Form.Label column sm="3" className="text-md-end">
                  Others:
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    name="others"
                    placeholder="Additional informations (eg. C+D, CV)"
                    onChange={props.handleChange("others")}
                    defaultValue={props.values.others}
                    isInvalid={!!props.errors.others}
                  />
                  <Form.Text className="text-danger ms-2">
                    {props.touched.others && props.errors.others}
                  </Form.Text>
                </Col>
              </Form.Group>

              {/* STATUS */}
              <Form.Group as={Row}>
                <Form.Label column sm="3" className="text-md-end">
                  Status:
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    required
                    as="select"
                    type="select"
                    defaultValue={props.values.status}
                    onChange={props.handleChange("status")}
                    isInvalid={!!props.errors.status}
                  >
                    <option disabled>-- select status --</option>
                    <option value="booked">Booked</option>
                    <option value="arrived">Arrived</option>
                    <option value="awaiting_workshop">Awaiting Workshop</option>
                    <option value="work_in_progress">Work in Progress</option>
                    <option value="awaiting_estimates">
                      Awaiting Estimates
                    </option>
                    <option value="awaiting_part">Awaiting Parts</option>
                    <option value="awaiting_authorisation">
                      Awaiting Authorisation
                    </option>
                    <option value="completed">Completed</option>
                  </Form.Control>
                  <Form.Text className="text-danger ms-2">
                    {props.touched.status && props.errors.status}
                  </Form.Text>
                </Col>
              </Form.Group>

              {/* WAITING */}
              <Form.Group as={Row} controlId="formWaiting">
                <Form.Label column sm="3" className="text-md-end">
                  Appointment:
                </Form.Label>
                <Col sm="9">
                  <Form.Check
                    className="disable-select mt-1"
                    type="checkbox"
                    label="Customer waiting"
                    name="waiting"
                    checked={props.values.waiting}
                    onChange={() =>
                      props.setFieldValue("waiting", !props.values.waiting)
                    }
                  />
                  <Form.Text className="text-danger ms-2">
                    {props.touched.status && props.errors.status}
                  </Form.Text>
                </Col>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Container className="px-0" fluid>
                <Collapse in={open}>
                  <div
                    id="example-collapse-text"
                    className="overflow-auto"
                    style={{ maxHeight: "6rem" }}
                  >
                    {data.activities.map((element, i) => {
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
                <div className="row justify-content-between pt-1">
                  <div className="col-4">
                    <Button
                      className="fas fa-history text-decoration-none link-success"
                      variant="link"
                      onClick={() => setOpen(!open)}
                    ></Button>
                  </div>
                  <div className="col-6 text-end">
                    <Button
                      className="mx-1"
                      variant="secondary"
                      onClick={handleCloseMainModal}
                    >
                      Close
                    </Button>
                    <Button className="mx-1" variant="success" type="submit">
                      Save
                    </Button>
                  </div>
                </div>
              </Container>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </>
  );
};
export default UpdateStatus;
