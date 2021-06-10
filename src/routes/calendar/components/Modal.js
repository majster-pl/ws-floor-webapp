// import axios from "axios";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import moment from "moment";
import React, { useState, useEffect, Fragment } from "react";
import DatePicker from "react-datepicker";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import apiClient from "../../../service/api/api";
import { addDays, subDays, getDay } from "date-fns";
import { Formik } from "formik";
import * as yup from "yup";

// const CalendarModal = ({ modalData, setmodalData, showModal, handleCloseModal, reloadCalendar, assetsOptions, customerOptions }) => {
const CalendarModal = ({
  showModal,
  handleCloseModal,
  modalData,
  setModalData,
}) => {
  const getAssets = () => {
    console.log("getAssets function...");
    let url = "/api/v1/assets";

    apiClient
      .get(url)
      .then((response) => {
        console.log(response.data.data);
        setAssets(response.data.data);
      })
      .catch((err) => {
        console.log("error:", err);
      });
  };

  // set booked_at date as state
  const [assets, setAssets] = useState([]);
  const [isAssetInvalid, setIsAssetInvalid] = useState();
  const [selectedBookedDate, setSelectedBookedDate] = useState();
  //   const [customerSelections, setCustomerSelections] = useState([]);
  const [assetSelections, setAssetSelections] = useState(() => {
    return [modalData.reg];
  });

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
  });
  // // Date picker
  const CustomInput = ({onClick }) => (
    <Form.Control
      name="booked_at"
      onClick={onClick}
      placeholder="Booked date"
      defaultValue={moment(selectedBookedDate).format("DD-MM-YYYY")}
    />
  );
  // // When new date selected from date picker
  const handleDateChange = (currentDate, event) => {
    // setBookedDate(currentDate);
    setModalData({
      ...modalData,
      ["booked_date"]: moment(currentDate).format("YYYY-MM-DD"),
    });
  };
  // // disable weeknd on calendar picker (in future to days off to be able to be set)
  // const isWeekday = date => {
  //     const day = moment(date).day();
  //     return day !== 0 && day !== 6;
  // };

  // // on asset input changed, check if selected from list or created new
  const handleAssetChange = (s, e) => {
    console.log(e.target.value);
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

  // // on customerSelections changed
  // const handleCustomerChange = (s, e) => {
  //     setCustomerSelections([e.target.value])
  // }
  // // When customer changed
  // useEffect(() => {
  //     if (customerSelections[0] !== undefined) {
  //         var cust = '';
  //         if (typeof (customerSelections[0]) == 'string') {
  //             cust = customerSelections[0];
  //         } else {
  //             cust = customerSelections[0].name;
  //         }
  //     }
  //     setmodalData({
  //         ...modalData,
  //         ['customer_id']: cust,
  //     });
  // }, [customerSelections]);

  // handle change of form input
  const handleChange = (e, d) => {
    setModalData({
      ...modalData,
      // Trimming any whitespace
      [e.target.name]: e.target.value.trim(),
    });
    // console.log('change!!', e);
  };

  // const handleSubmit = (e) => {
  //     e.preventDefault()
  //     // console.log(modalData);
  //     console.log('HANDLING SUBMIT...');
  //     // console.log('id: ', modalData.id);

  //     if (modalData.id != undefined) {
  //         console.log('HANDLING UPDATE...');
  //         // update existing event
  //         var url = '/api/events/' + modalData.id;
  //         axios.put(url, modalData, { headers: { "Content-Type": "application/json" }, crossdomain: true }).then((res) => {
  //             console.log(res);
  //             handleCloseModal();
  //             reloadCalendar();
  //             // setmodalData([]);
  //             setBookedDate();
  //         }).catch((err => {
  //             console.log(err);
  //         }));
  //     } else {
  //         console.log('HANDLING CREATE NEW EVENT...');
  //         // create new event
  //         var url = '/api/events/';
  //         axios.post(url, modalData, { headers: { "Content-Type": "application/json" }, crossdomain: true }).then((res) => {
  //             console.log('Creating new event....');
  //             handleCloseModal();
  //             // setmodalData([]);
  //             reloadCalendar();
  //             setBookedDate();
  //             console.log(res);
  //         }).catch((err => {
  //             console.log('Error ocured while creating new event....');
  //             console.log(err);
  //         }));
  //     }
  //     // // console.log(url);
  //     // axios.put(url, modalData, { headers: { "Content-Type": "application/json" } }).then((res) => {
  //     //     console.log(res);
  //     // }).catch((err => {
  //     //     console.log(err);
  //     // }));
  // };

  // const handleDelete = (e) => {
  //     e.preventDefault();
  //     var url = '/api/events/' + modalData.id;
  //     axios.delete(url, modalData, { headers: { "Content-Type": "application/json" }, crossdomain: true }).then((res) => {
  //         // console.log(res);
  //         handleCloseModal();
  //         reloadCalendar();
  //     }).catch((err => {
  //         // console.log(err);
  //         alert(err);
  //     }));

  //     console.log('Removed!');
  // }
  // useEffect(() => {
  //   console.log("EEEE:", modalData.event_id);
  // }, [modalData]);

  // const setAssetSelections = (selected) => {
  // console.log('ello!' +  JSON.stringify(selected, null, 2));
  // console.log('Reg: ' +  selected[0].reg);

  // Set new asset id in modalData
  // check if not empy field
  // if (selected[0] !== undefined) {
  //   setModalData({
  //     ...modalData,
  //     ['asset_id']: selected[0].asset_id,
  //   });

  // } else {
  //   setModalData({
  //     ...modalData,
  //     ['asset_id']: 0,
  //   });

  // }
  // }

  // Get all assets and customers when modal show
  const handleOnShow = () => {
    getAssets();
  };

  const handleSubmit = (values) => {
    console.log("handleSubmit");
    console.log("MODAL: " + JSON.stringify(modalData));

    let url = "/api/v1/events/" + values.event_id;

    apiClient
      .get("/sanctum/csrf-cookie")
      .then(() => {
        apiClient
          .patch(url, values)
          .then((response) => {
            // setTableData(response.data.data);
            console.log(response.data);
            // setModalData(response.data.data);
            // setShowModal(true);
          })
          .catch((err) => {
            console.log("error:", err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
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
    >
      <Formik
        initialValues={modalData}
        validationSchema={reviewShema}
        onSubmit={(values, actions) => {
          handleSubmit(values);
          console.log("values: " + JSON.stringify(values));
          console.log("actions: " + JSON.stringify(actions));
          // setTimeout(() => {
          //   alert(JSON.stringify(values, null, 2));
          //   actions.setSubmitting(false);
          // }, 1000);
        }}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <Modal.Header>
              {/* {modalData.id == undefined ? ( */}
              {modalData.new_booking === true ? (
                <Modal.Title>Add New Booking</Modal.Title>
              ) : (
                <Modal.Title>Edit booking</Modal.Title>
              )}
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleCloseModal}
              ></button>
            </Modal.Header>
            <Modal.Body>
              <Form.Group as={Row} controlId="formReg" className="mb-3">
                <Form.Label column sm="2">
                  Reg
                </Form.Label>
                <Col sm="10">
                  <Fragment>
                    <Form.Group>
                      <Typeahead
                        id="asset-typeahead"
                        labelKey="reg"
                        allowNew
                        // onChange={setAssetSelections}
                        onChange={(selected) => {
                          setAssetSelections(selected);
                          if (typeof selected[0] !== "undefined") {
                            console.log(
                              "Selected: " + JSON.stringify(selected)
                            );
                            // check if selection is a new reg
                            if (selected[0].customOption === true) {
                              props.values.asset_id = 0;
                              props.values.reg = selected[0].reg;
                            } else {
                              props.values.asset_id = selected[0].asset_id;
                              props.values.reg = selected[0].reg;
                            }
                          } else {
                            props.values.asset_id = 0;
                            props.values.reg = "";
                          }
                        }}
                        onInputChange={handleAssetChange}
                        // onInputChange={props.handleChange('reg')}

                        options={assets}
                        isInvalid={isAssetInvalid}
                        value={props.values.reg}
                        // isLoading={true}
                        placeholder="Vehicle Reg..."
                        // selected={assetSelections}
                        defaultSelected={[modalData]}
                        // selected={['KG44AWH']}
                      />
                    </Form.Group>
                  </Fragment>
                  <Form.Text className="text-muted ">
                    {isAssetInvalid ? props.errors.reg : ""}
                  </Form.Text>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formCustomer" className="mb-3">
                <Form.Label column sm="2">
                  Customer
                </Form.Label>
                <Col sm="10">
                  <Fragment>
                    <Form.Group>
                      <Typeahead
                        id="customer-typeahead"
                        labelKey="name"
                        allowNew
                        // onChange={setCustomerSelections}
                        // onInputChange={handleCustomerChange}
                        // options={customerOptions}
                        placeholder="Customer"
                        // selected={customerSelections}
                      />
                    </Form.Group>
                  </Fragment>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formDescription" className="mb-3">
                <Form.Label column sm="2">
                  Description
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    placeholder="Visit description"
                    onChange={props.handleChange("description")}
                    value={props.values.description}
                    // defaultValue={modalData.description}
                  />
                  <Form.Text className="text-muted d-none">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formAllowedTime" className="mb-3">
                <Form.Label column sm="2">
                  Allowed time
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    name="allowed_time"
                    placeholder="Number of hours allowed for a job"
                    // onChange={handleChange}
                    onChange={props.handleChange("allowed_time")}
                    value={props.values.allowed_time}
                    defaultValue={modalData.allowed_time}
                  />
                  <Form.Text className="text-muted d-none">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formStatus" className="mb-3">
                <Form.Label column sm="2">
                  Status
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    name="status"
                    placeholder="Current status"
                    // onChange={handleChange}
                    onChange={props.handleChange("status")}
                    value={props.values.status}
                    defaultValue={modalData.status}
                  />
                  <Form.Text className="text-muted d-none">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formBookedAt" className="mb-3">
                <Form.Label column sm="2">
                  Booked date
                </Form.Label>
                <Col sm="10">
                  {/* <Form.Control name="booked_at" placeholder="Current status" onChange={handleChange} defaultValue={modalData.booked_at} /> */}
                  <DatePicker
                    style={{ display: "revert" }}
                    // peekNextMonth
                    // showMonthDropdown
                    // showYearDropdown

                    // showTimeSelect
                    // dateFormat="dd/MM/yyyy h:mm aa"

                    dateFormat="MMMM d, yyyy"
                    // openToDate={new Date(moment(bookedDate))}
                    calendarStartDay={1}
                    customInput={<CustomInput selected={props.values.booked_date}/>}
                    closeOnScroll={true}
                    todayButton="This Week"
                    filterDate={isWeekday}
                    // highlightDates={[subDays(new Date(modalData.booked_date), 0)]}

                    selected={new Date(props.values.booked_date)}
                    // excludeDates={[new Date(), subDays(new Date(), 1)]}
                    // locale="en-GB"
                    // calendarClassName="rasta-stripes"
                    // onChange={handleDateChange}
                    onChange={(selected) => { 
                      console.log(selected);
                      props.values.booked_date = moment(selected).format("YYYY-MM-DD");
                      // this.selected = props.values.booked_date
                      setSelectedBookedDate(selected);
                      console.log(JSON.stringify(props.values));
                    }}
                    // onChange={props.handleChange("booked_date")}
                    // value={props.values.booked_date}
                    // minDate={subDays(new Date(), 1)} // to prevent from booking event in the past
                  />
                  <Form.Text className="text-muted d-none">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formOthers">
                <Form.Label column sm="2">
                  Others
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    name="others"
                    placeholder="Other informations"
                    onChange={handleChange}
                    defaultValue={modalData.others}
                  />
                  <Form.Text className="text-muted d-none">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Col>
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              {/* <Button variant="danger" className="me-auto" onClick={handleDelete}>
    Remove
  </Button> */}
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              <Button
                variant="success"
                type="submit"
                // size="sm"
                // onClick={() => {
                //   handleSubmit();
                // }}
              >
                Save
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CalendarModal;
