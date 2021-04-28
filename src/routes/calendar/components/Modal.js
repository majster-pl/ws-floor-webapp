// import axios from "axios";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import moment from "moment";
import React, { useState, useEffect, Fragment } from "react";
import DatePicker from "react-datepicker";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import apiClient from "../../../service/api/api";

// const CalendarModal = ({ modalData, setmodalData, showModal, handleCloseModal, reloadCalendar, assetsOptions, customerOptions }) => {
const CalendarModal = ({
  showModal,
  handleCloseModal,
  modalData,
  setModalData,
}) => {
  // set booked_at date as state
  //   const [bookedDate, setBookedDate] = useState(modalData.booked_at);
  //   const [customerSelections, setCustomerSelections] = useState([]);
  //   const [assetSelections, setAssetSelections] = useState([]);

  // // Date picker
  const CustomInput = ({ onClick }) => (
    <Form.Control
      name="booked_at"
      onClick={onClick}
      placeholder="Booked date"
      defaultValue={moment(modalData.booked_date).format("DD-MM-YYYY")}
    />
  );
  // // When new date selected from date picker
  // const handleDateChange = (currentDate, event) => {
  //     setBookedDate(currentDate);
  //     setmodalData({
  //         ...modalData,
  //         ['booked_at']: moment(currentDate).format('YYYY-MM-DD')
  //     });
  // };
  // // disable weeknd on calendar picker (in future to days off to be able to be set)
  // const isWeekday = date => {
  //     const day = moment(date).day();
  //     return day !== 0 && day !== 6;
  // };

  // // on asset input changed, check if selected from list or created new
  // const handleAssetChange = (s, e) => {
  //     setAssetSelections([e.target.value]);
  // }
  // // When asset changed
  // useEffect(() => {
  //     if (assetSelections[0] !== undefined) {
  //         var reg = '';
  //         if (typeof (assetSelections[0]) == 'string') {
  //             reg = assetSelections[0];
  //         } else {
  //             reg = assetSelections[0].name;
  //         }
  //     }
  //     setmodalData({
  //         ...modalData,
  //         ['veh_id']: reg,
  //     });
  // }, [assetSelections]);

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

  // on modal displayed
  const handleOnShow = () => {
    console.log("handleOnShow");
    console.log("oooo:", modalData);
    //   setBookedDate(modalData.booked_at);
    //   setAssetSelections([modalData.veh_id]);
    //   setCustomerSelections([modalData.customer_id]);
  };

  const handleSubmit = () => {
    console.log("handleSubmit");

    let url = "/api/v1/events/";

    apiClient.post(url, modalData)
    .then((response) => {
      // setTableData(response.data.data);
      console.log(response.data);
      // setModalData(response.data.data);
      // setShowModal(true);
    })
    .catch((err) => {
      console.log("error:", err);
    });
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal} onShow={handleOnShow}>
      <Modal.Header closeButton>
        {/* {modalData.id == undefined ? ( */}
        {modalData.new_booking === true ? (
          <Modal.Title>Add New Booking</Modal.Title>
        ) : (
          <Modal.Title>Edit booking</Modal.Title>
        )}
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} controlId="formReg">
            <Form.Label column sm="2">
              Reg
            </Form.Label>
            <Col sm="10">
              <Fragment>
                <Form.Group>
                  <Typeahead
                    id="asset-typeahead"
                    labelKey="name"
                    allowNew
                    // onChange={setAssetSelections}
                    // onInputChange={handleAssetChange}
                    // options={assetsOptions}
                    placeholder="Vehicle Reg..."
                    // selected={assetSelections}
                  />
                </Form.Group>
              </Fragment>
              <Form.Text className="text-muted d-none">
                We'll never share your email with anyone else.
              </Form.Text>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formCustomer">
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

          <Form.Group as={Row} controlId="formDescription">
            <Form.Label column sm="2">
              Description
            </Form.Label>
            <Col sm="10">
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Visit description"
                onChange={handleChange}
                defaultValue={modalData.description}
              />
              <Form.Text className="text-muted d-none">
                We'll never share your email with anyone else.
              </Form.Text>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formAllowedTime">
            <Form.Label column sm="2">
              Allowed time
            </Form.Label>
            <Col sm="10">
              <Form.Control
                name="allowed_time"
                placeholder="Number of hours allowed for a job"
                onChange={handleChange}
                defaultValue={modalData.allowed_time}
              />
              <Form.Text className="text-muted d-none">
                We'll never share your email with anyone else.
              </Form.Text>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formStatus">
            <Form.Label column sm="2">
              Status
            </Form.Label>
            <Col sm="10">
              <Form.Control
                name="status"
                placeholder="Current status"
                onChange={handleChange}
                defaultValue={modalData.status}
              />
              <Form.Text className="text-muted d-none">
                We'll never share your email with anyone else.
              </Form.Text>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formBookedAt">
            <Form.Label column sm="2">
              Booked date
            </Form.Label>
            <Col sm="10">
              {/* <Form.Control name="booked_at" placeholder="Current status" onChange={handleChange} defaultValue={modalData.booked_at} /> */}
              <DatePicker
                style={{ display: "revert" }}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dateFormat="dd/MM/yyyy"
                // openToDate={new Date(moment(bookedDate))}
                customInput={<CustomInput />}
                closeOnScroll={true}
                todayButton="This Week"
                // filterDate={isWeekday}
                // locale="en-GB"
                calendarClassName="rasta-stripes"
                // onChange={handleDateChange}
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
        </Form>
      </Modal.Body>

      <Modal.Footer>
        {/* <Button variant="danger" className="mr-auto" onClick={handleDelete}>
          Remove
        </Button> */}
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button
          variant="success"
          // size="sm"
          onClick={() => {
            handleSubmit()
          }}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CalendarModal;
