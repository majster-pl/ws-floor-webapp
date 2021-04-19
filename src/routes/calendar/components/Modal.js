import axios from "axios";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import moment from "moment";
import React, { useState, useEffect, Fragment } from "react";
import DatePicker from "react-datepicker";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

// const CalendarModal = ({ modalEditData, setModalEditData, showModal, handleCloseModal, reloadCalendar, assetsOptions, customerOptions }) => {
const CalendarModal = ({ showModal, handleCloseModal }) => {
  // set booked_at date as state
//   const [bookedDate, setBookedDate] = useState(modalEditData.booked_at);
//   const [customerSelections, setCustomerSelections] = useState([]);
//   const [assetSelections, setAssetSelections] = useState([]);

  // // Date picker
  // const CustomInput = ({ onClick }) => (
  //     <Form.Control name="booked_at" onClick={onClick} placeholder="Booked date" defaultValue={moment(bookedDate).format('DD-MM-YYYY')} />
  // );
  // // When new date selected from date picker
  // const handleDateChange = (currentDate, event) => {
  //     setBookedDate(currentDate);
  //     setModalEditData({
  //         ...modalEditData,
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
  //     setModalEditData({
  //         ...modalEditData,
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
  //     setModalEditData({
  //         ...modalEditData,
  //         ['customer_id']: cust,
  //     });
  // }, [customerSelections]);

  // // handle change of form input
  // const handleChange = (e, d) => {
  //     setModalEditData({
  //         ...modalEditData,
  //         // Trimming any whitespace
  //         [e.target.name]: e.target.value.trim()
  //     });
  //     // console.log('change!!', e);
  // };

  // const handleSubmit = (e) => {
  //     e.preventDefault()
  //     // console.log(modalEditData);
  //     console.log('HANDLING SUBMIT...');
  //     // console.log('id: ', modalEditData.id);

  //     if (modalEditData.id != undefined) {
  //         console.log('HANDLING UPDATE...');
  //         // update existing event
  //         var url = '/api/events/' + modalEditData.id;
  //         axios.put(url, modalEditData, { headers: { "Content-Type": "application/json" }, crossdomain: true }).then((res) => {
  //             console.log(res);
  //             handleCloseModal();
  //             reloadCalendar();
  //             // setModalEditData([]);
  //             setBookedDate();
  //         }).catch((err => {
  //             console.log(err);
  //         }));
  //     } else {
  //         console.log('HANDLING CREATE NEW EVENT...');
  //         // create new event
  //         var url = '/api/events/';
  //         axios.post(url, modalEditData, { headers: { "Content-Type": "application/json" }, crossdomain: true }).then((res) => {
  //             console.log('Creating new event....');
  //             handleCloseModal();
  //             // setModalEditData([]);
  //             reloadCalendar();
  //             setBookedDate();
  //             console.log(res);
  //         }).catch((err => {
  //             console.log('Error ocured while creating new event....');
  //             console.log(err);
  //         }));
  //     }
  //     // // console.log(url);
  //     // axios.put(url, modalEditData, { headers: { "Content-Type": "application/json" } }).then((res) => {
  //     //     console.log(res);
  //     // }).catch((err => {
  //     //     console.log(err);
  //     // }));
  // };

  // const handleDelete = (e) => {
  //     e.preventDefault();
  //     var url = '/api/events/' + modalEditData.id;
  //     axios.delete(url, modalEditData, { headers: { "Content-Type": "application/json" }, crossdomain: true }).then((res) => {
  //         // console.log(res);
  //         handleCloseModal();
  //         reloadCalendar();
  //     }).catch((err => {
  //         // console.log(err);
  //         alert(err);
  //     }));

  //     console.log('Removed!');
  // }

  // on modal displayed
  const handleOnShow = () => {
      console.log('handleOnShow');
    //   setBookedDate(modalEditData.booked_at);
    //   setAssetSelections([modalEditData.veh_id]);
    //   setCustomerSelections([modalEditData.customer_id]);
  }

  return (
    <Modal show={showModal} onHide={handleCloseModal} onShow={handleOnShow}>
      <Modal.Header closeButton>
        {/* {modalEditData.id == undefined ? ( */}
        {1 == 1 ? (
          <Modal.Title>Add New Booking</Modal.Title>
        ) : (
          <Modal.Title>Edit booking</Modal.Title>
        )}
      </Modal.Header>
      <Modal.Body></Modal.Body>

      <Modal.Footer>
        {/* <Button variant="danger" className="mr-auto" onClick={handleDelete}>
          Remove
        </Button> */}
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button variant="primary" onClick={() => {console.log('handleSubmit');}}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CalendarModal;
