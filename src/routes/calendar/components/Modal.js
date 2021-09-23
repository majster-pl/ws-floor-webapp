// import axios from "axios";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Container,
  Collapse,
  // Offcanvas,
} from "react-bootstrap";
import moment from "moment";
import React, { useState, useEffect, Fragment } from "react";
import DatePicker from "react-datepicker";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import apiClient from "../../../service/api/api";
import { addDays, subDays, getDay } from "date-fns";
import { Formik } from "formik";
import * as yup from "yup";
import HistoryListItem from "./HistoryListItem";

// const CalendarModal = ({ modalData, setmodalData, showModal, handleCloseModal, reloadCalendar, assetsOptions, customerOptions }) => {
const CalendarModal = ({
  showModal,
  handleCloseModal,
  modalData,
  setModalData,
  reloadCalendar,
  toast,
}) => {
  // set state hooks
  const [assets, setAssets] = useState([]);
  const [isAssetInvalid, setIsAssetInvalid] = useState();
  const [customers, setCustomers] = useState([]);
  const [selectedBookedDate, setSelectedBookedDate] = useState(() => {
    return moment(modalData.booked_date_time).format("YYYY-MM-DD H:mm");
  });
  //   const [customerSelections, setCustomerSelections] = useState([]);
  const [assetSelections, setAssetSelections] = useState(() => {
    return [modalData.reg];
  });
  const [open, setOpen] = useState(false);

  if (typeof modalData.activities !== "object") {
    modalData.activities = Object.keys({});
  }

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  const getAssets = () => {
    // console.log("getAssets function...");
    let url = "/api/v1/assets";

    apiClient
      .get(url)
      .then((response) => {
        // console.log(response.data.data);
        setAssets(response.data.data);
      })
      .catch((err) => {
        console.log("error:", err);
      });
  };

  //fetching customers list
  const getCustomers = () => {
    // console.log("getCustomers function...");
    let url = "/api/v1/customers";

    apiClient
      .get(url)
      .then((response) => {
        // console.log(response.data.data);
        setCustomers(response.data.data);
      })
      .catch((err) => {
        console.log("error:", err);
      });
  };

  // Form validation
  const reviewShema = yup.object({
    reg: yup
      .string()
      .min(4)
      .required()
      .test("is-reg-valid", "Reg must be selected", (value, context) => {
        // console.log("VALUE: "+value);
        // console.log("CONTEXT: "+ JSON.stringify(context));
        // console.log("VALUE: "+modalData.reg);
        // setIsAssetInvalid(true);

        return !isAssetInvalid;
      }),
    description: yup.string().min(3).required(),
    allowed_time: yup.number().required(),
    booked_date_time: yup.date().required(),
  });
  // // Date picker
  const CustomInput = ({ onClick }) => (
    <Form.Control
      name="booked_at"
      onClick={onClick}
      placeholder="Booked date"
      defaultValue={moment(selectedBookedDate).format("DD-MM-YYYY H:mm")}
    />
  );
  // // When new date selected from date picker
  const handleDateChange = (currentDate, event) => {
    // setBookedDate(currentDate);
    setModalData({
      ...modalData,
      ["booked_date_time"]: moment(currentDate).format("YYYY-MM-DD H:mm"),
    });
  };
  // // disable weeknd on calendar picker (in future to days off to be able to be set)
  // const isWeekday = date => {
  //     const day = moment(date).day();
  //     return day !== 0 && day !== 6;
  // };

  // // on asset input changed, check if selected from list or created new
  const handleAssetChange = (s, e) => {
    // console.log(e.target.value);
    setIsAssetInvalid(true);
    // setModalData({
    //   ...modalData,
    //   ["reg"]: '',
    // });
    // setAssetSelections([e.target.value]);
  };
  // When asset changed
  useEffect(() => {
    // console.log("Type: " + typeof assetSelections[0]);
    // console.log('MODAL DATA: '+ JSON.stringify(modalData));
    if (assetSelections[0] !== undefined) {
      var asset_id = "";
      if (typeof assetSelections[0].asset_id == "number") {
        asset_id = assetSelections[0].asset_id;
      } else {
        asset_id = 0;
      }
      setIsAssetInvalid(false);
    }
    setModalData({
      ...modalData,
      ["asset_id"]: asset_id,
    });
  }, [assetSelections]);

  // handle change of form input
  const handleChange = (e, d) => {
    setModalData({
      ...modalData,
      // Trimming any whitespace
      [e.target.name]: e.target.value.trim(),
    });
    // console.log('change!!', e);
  };

  // Get all assets and customers when modal show
  const handleOnShow = () => {
    getAssets();
    getCustomers();
    // console.log(JSON.stringify(modalData.activities));
    console.log(modalData);
    // modalData.activities.forEach((element) => {
    //   console.log(element);
    // });
    // console.log(modalData.activities);
  };

  const handleSubmit = (values) => {
    // console.log("handleSubmit");
    // console.log("MODAL: " + JSON.stringify(values));

    if (modalData.new_booking) {
      let url = "/api/v1/events";
      apiClient
        .post(url, values)
        .then((response) => {
          // setTableData(response.data.data);
          // console.log(response.data);
          // setModalData(response.data.data);
          // setShowModal(true);
          handleCloseModal();
          setModalData([]);
          reloadCalendar();
          toast.success("New event added.");
          // setBookedDate();
        })
        .catch((err) => {
          console.log("error:", err);
          toast.error(err.statusText + " - Event NOT saved!");
        });
    } else {
      let url = "/api/v1/events/" + values.event_id;

      apiClient
        .get("/sanctum/csrf-cookie")
        .then(() => {
          apiClient
            .patch(url, values)
            .then((response) => {
              // setTableData(response.data.data);
              // console.log(response.data);
              // setModalData(response.data.data);
              // setShowModal(true);
              handleCloseModal();
              // setModalData([]);
              reloadCalendar();
              toast.success("Event saved.");
              // setBookedDate();
            })
            .catch((err) => {
              console.log("error:", err);
              toast.error(err.statusText + " - Event NOT saved!");
            });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const isWeekday = (date) => {
    const day = getDay(date);
    return day !== 0 && day !== 6;
  };

  // getAssets();

  return (
    <Modal
      id="event-modal"
      show={showModal}
      onHide={handleCloseModal}
      onShow={handleOnShow}
      backdrop="static"
      centered
    >
      {/* <Offcanvas show={true} onHide={handleClose}> */}
      {/* <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Some text as placeholder. In real life you can have the elements you
          have chosen. Like, text, images, lists, etc.
        </Offcanvas.Body> */}
      {/* </Offcanvas> */}

      <div
        className="offcanvas offcanvas-start"
        tabindex="-1"
        id="offcanvas"
        aria-labelledby="offcanvasLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasLabel">
            Offcanvas
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          Content for the offcanvas goes here. You can place just about any
          Bootstrap component or custom elements here.
        </div>
      </div>

      <Formik
        initialValues={modalData}
        validationSchema={reviewShema}
        onSubmit={(values, actions) => {
          handleSubmit(values);
          // console.log("values: " + JSON.stringify(values));
          // console.log("actions: " + JSON.stringify(actions));
        }}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <Modal.Header>
              {/* {modalData.id == undefined ? ( */}
              {modalData.new_booking ? (
                <Modal.Title>
                  <h3 classNameName="my-auto">Add New Booking</h3>
                </Modal.Title>
              ) : (
                <Modal.Title>
                  <h3 classNameName="my-auto">Edit booking</h3>
                </Modal.Title>
              )}
              <button
                type="button"
                classNameName="btn-close"
                aria-label="Close"
                onClick={handleCloseModal}
              ></button>
            </Modal.Header>
            <Modal.Body>
              <Form.Group as={Row} controlId="formReg">
                <Form.Label column sm="3" classNameName="text-md-end">
                  Reg
                </Form.Label>
                <Col sm="9">
                  <Fragment>
                    <Form.Group>
                      <Typeahead
                        id="asset-typeahead"
                        labelKey="reg"
                        allowNew
                        onChange={(selected) => {
                          setAssetSelections(selected);
                          if (typeof selected[0] !== "undefined") {
                            console.log(
                              "Selected: " + JSON.stringify(selected)
                            );
                            // check if selection is a new reg
                            if (selected[0].customOption === true) {
                              // if new set id to 0
                              props.values.asset_id = 0;
                              props.values.reg = selected[0].reg;
                            } else {
                              // if not new assign values accordingly
                              props.values.asset_id = selected[0].asset_id;
                              props.values.reg = selected[0].reg;
                            }
                            // if no selection made set botw to 0
                          } else {
                            props.values.asset_id = 0;
                            props.values.reg = "";
                          }
                        }}
                        onInputChange={handleAssetChange}
                        options={assets}
                        isInvalid={isAssetInvalid}
                        value={props.values.reg || ""}
                        placeholder="Vehicle Reg..."
                        defaultSelected={
                          modalData.new_booking ? "" : [modalData]
                        }
                      />
                    </Form.Group>
                  </Fragment>
                  <Form.Text classNameName="text-danger ms-2">
                    {props.errors.reg}
                  </Form.Text>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formCustomer">
                <Form.Label column sm="3" classNameName="text-md-end">
                  Customer
                </Form.Label>
                <Col sm="9">
                  <Fragment>
                    <Form.Group>
                      <Typeahead
                        id="customer-typeahead"
                        labelKey="customer_name"
                        allowNew
                        onChange={(selected) => {
                          setAssetSelections(selected);
                          if (typeof selected[0] !== "undefined") {
                            console.log(
                              "Selected: " + JSON.stringify(selected)
                            );
                            // check if selection is a new reg
                            if (selected[0].customOption === true) {
                              // if new set id to 0
                              props.values.customer_id = 0;
                              props.values.customer = selected[0].customer;
                            } else {
                              // if not new assign values accordingly
                              props.values.customer_id =
                                selected[0].customer_id;
                              props.values.customer = selected[0].customer;
                            }
                            // if no selection made set botw to 0
                          } else {
                            props.values.customer_id = 0;
                            props.values.customer = "";
                          }
                        }}
                        // onInputChange={handleAssetChange}
                        options={customers}
                        // isInvalid={isAssetInvalid}
                        value={props.values.customer_name || ""}
                        placeholder="Customer..."
                        defaultSelected={
                          modalData.new_booking ? "" : [modalData]
                        }
                      />
                    </Form.Group>
                  </Fragment>
                  <Form.Text classNameName="text-danger ms-2">
                    {props.errors.customer_name}
                  </Form.Text>
                </Col>
              </Form.Group>

              {/* DESCRIPTION */}
              <Form.Group as={Row} controlId="formDescription">
                <Form.Label column sm="3" classNameName="text-md-end ">
                  Description
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    placeholder="Visit description"
                    onChange={props.handleChange("description")}
                    value={props.values.description || ""}
                    // defaultValue={modalData.description}
                  />
                  <Form.Text classNameName="text-danger ms-2">
                    {props.errors.description}
                  </Form.Text>
                </Col>
              </Form.Group>

              {/* ALLOWED TIME */}
              <Form.Group as={Row} controlId="formAllowedTime">
                <Form.Label column sm="3" classNameName="text-md-end">
                  Allowed time
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    name="allowed_time"
                    placeholder="Number of hours allowed for a job"
                    // onChange={handleChange}
                    onChange={props.handleChange("allowed_time")}
                    value={props.values.allowed_time || ""}
                    defaultValue={modalData.allowed_time}
                    isInvalid={!!props.errors.allowed_time}
                  />
                  <Form.Text classNameName="text-danger ms-2">
                    {props.errors.allowed_time}
                  </Form.Text>
                </Col>
              </Form.Group>

              {/* BOOKED DATE */}
              <Form.Group as={Row} controlId="formBookedAt">
                <Form.Label column sm="3" classNameName="text-md-end">
                  Booked date
                </Form.Label>
                <Col sm="9">
                  <DatePicker
                    style={{ display: "revert" }}
                    dateFormat="dd-MM-yyyy H:mm"
                    calendarStartDay={1}
                    // disabledKeyboardNavigation
                    showTimeSelect
                    customInput={
                      <CustomInput selected={props.values.booked_date_time} />
                    }
                    closeOnScroll={true}
                    todayButton="This Week"
                    filterDate={isWeekday}
                    // highlightDates={[subDays(new Date(selectedBookedDate), 1)]}
                    selected={new Date(selectedBookedDate)}
                    value={props.values.booked_date_time || ""}
                    onChange={(selected) => {
                      console.log(selected);
                      var newDate = moment(selected).format("YYYY-MM-DD H:mm");
                      props.values.booked_date_time = newDate;
                      setSelectedBookedDate(newDate);
                      // console.log(JSON.stringify(props.values));
                    }}
                  />
                  <Form.Text classNameName="text-danger ms-2">
                    {props.errors.booked_date_time}
                  </Form.Text>
                </Col>
              </Form.Group>

              {/* OTHERS */}
              <Form.Group as={Row} controlId="formOthers">
                <Form.Label column sm="3" classNameName="text-md-end">
                  Others
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    name="others"
                    placeholder="Other informations"
                    onChange={props.handleChange("others")}
                    defaultValue={modalData.others}
                    value={props.values.others || ""}
                  />
                  <Form.Text classNameName="text-danger ms-2">
                    {props.errors.others}
                  </Form.Text>
                </Col>
              </Form.Group>

              {/* STATUS */}
              <Form.Group as={Row} controlId="formStatus">
                <Form.Label column sm="3" classNameName="text-md-end">
                  Status
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    required
                    as="select"
                    type="select"
                    name="payment_method"
                    defaultValue={
                      modalData.new_booking
                        ? "-- select status --"
                        : props.values.status
                    }
                    onChange={props.handleChange("status")}
                    // onChange={setFormValue}
                    // value={form.payment_method}
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
                  <Form.Text classNameName="text-muted d-none">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Col>
              </Form.Group>
              <Collapse in={open}>
                <div
                  id="example-collapse-text"
                  classNameName="overflow-auto"
                  style={{ maxHeight: "5rem" }}
                >
                  {modalData.activities.map((element, i) => {
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
            </Modal.Body>

            <Modal.Footer>
              <Container classNameName="px-0" fluid>
                <div classNameName="row justify-content-between pt-1">
                  <div classNameName="col-4">
                    <Button
                      classNameName="fas fa-history text-decoration-none link-success"
                      variant="link"
                      onClick={() => setOpen(!open)}
                    ></Button>
                  </div>
                  <div classNameName="col-6 text-end">
                    <Button
                      classNameName="mx-1"
                      variant="secondary"
                      onClick={handleCloseModal}
                    >
                      Close
                    </Button>
                    <Button classNameName="mx-1" variant="success" type="submit">
                      Save
                    </Button>
                  </div>
                </div>
              </Container>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CalendarModal;
