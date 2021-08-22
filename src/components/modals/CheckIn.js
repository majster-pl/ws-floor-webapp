import { useState, useEffect } from "react";
import { Row, Col, Modal, Form, Button, InputGroup } from "react-bootstrap";
import { Formik } from "formik";
import apiClient from "../../service/api/api";
import * as yup from "yup";

const CheckIn = ({ data, handleCloseMainModal, toast }) => {
  // const [specialInstText, setSpecialInstText] = useState("");
  // Form validation
  const reviewShema = yup.object({
    // special_instructions: yup.string(),
    odometer_in: yup
      .number()
      .typeError("You must specify mileage")
      .required("Vehicle current mileage is required"),
  });

  // Submit function
  const handleSubmit = (values) => {
    let url = "/api/v1/events/" + data.event_id;
    // change/override event status
    values["status"] = "awaiting_labour";
    values["order"] = "100"; //workaround... need to find highest order in group and add bigger digit to last

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
            handleCloseMainModal();
            // handleCloseModal();
            // setModalData([]);
            // reloadCalendar();
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
  };

  useEffect(() => {
    console.log("DATA:", data);
  }, []);
  return (
    <>
      <Formik
        initialValues={{ ...data }}
        validationSchema={reviewShema}
        // onSubmit={(values, actions) => {
        //   setTimeout(() => {
        //     alert(JSON.stringify(values, null, 2));
        //     actions.setSubmitting(false);
        //     // handleModalSubmit();
        //     console.log(values);
        //   }, 1000);
        // }}
        onSubmit={(values, actions) => {
          handleSubmit(values);
          actions.setSubmitting(false);
        }}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <Modal.Header>
              <Modal.Title>
                <h3 className="my-auto">Check in</h3>
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
              <Form.Group as={Row} controlId="formReg">
                <Form.Label column sm="3" className="text-md-end">
                  Reg
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    name="others"
                    placeholder="Vehicle Reg"
                    disabled
                    plaintext
                    onChange={props.handleChange("others")}
                    // defaultValue={modalData.others}
                    value={props.values.reg}
                  />
                </Col>
              </Form.Group>

              {/* Customer */}
              <Form.Group as={Row} controlId="formCustomer" className="mb-2">
                <Form.Label column sm="3" className="text-md-end">
                  Customer
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    disabled
                    plaintext
                    name="others"
                    placeholder="Customer Name"
                    // defaultValue={modalData.others}
                    value={props.values.customer_name}
                  />
                </Col>
              </Form.Group>

              {/* Odometer reading */}
              <Form.Group as={Row} controlId="formOdometer">
                <Form.Label column sm="3" className="text-md-end">
                  Mileage In
                </Form.Label>
                <Col sm="9">
                  <InputGroup>
                    <Form.Control
                      maxLength={10}
                      autoComplete="off"
                      type="text"
                      name="odometer_in"
                      placeholder="Current mileage (km)"
                      onChange={props.handleChange("odometer_in")}
                      value={props.values.odometer_in}
                      isInvalid={
                        props.touched.odometer_in && !!props.errors.odometer_in
                      }
                    />
                    <InputGroup.Text>km</InputGroup.Text>
                  </InputGroup>
                  <Form.Text className="text-danger ms-2">
                    {props.touched.odometer_in && props.errors.odometer_in}
                  </Form.Text>
                </Col>
              </Form.Group>

              {/* Special Inst */}
              <Form.Group as={Row} controlId="formSpecialInst">
                <Form.Label column sm="3" className="text-md-end">
                  Special inst.
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    maxLength={100}
                    as="textarea"
                    rows={3}
                    name="special_instructions"
                    placeholder="Special instructions (max 100 characters)"
                    onChange={props.handleChange("special_instructions")}
                    // onKeyUp={setSpecialInstText(
                    //   props.values.special_instructions
                    // )}
                    value={props.values.special_instructions}
                    // defaultValue={modalData.description}
                  />
                  {/* <p className="p-0 m-0 me-1 text-end text-muted">
                    {typeof specialInstText !== "undefined"
                      ? specialInstText.length !== null
                        ? specialInstText.length
                        : "0"
                      : "0"}
                    /100
                  </p> */}
                  <Form.Text className="text-danger ms-2">
                    {props.errors.special_inst}
                  </Form.Text>
                </Col>
              </Form.Group>

              {/* Customer Waiting */}
              <Form.Group className="mb-3" controlId="formWaiting">
                <Form.Check
                  className="disable-select"
                  type="checkbox"
                  label="Customer waiting"
                  name="waiting"
                  checked={props.values.waiting}
                  onChange={() =>
                    props.setFieldValue("waiting", !props.values.waiting)
                  }
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseMainModal}>
                Close
              </Button>
              <Button variant="success" type="submit">
                Check In
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </>
  );
};
export default CheckIn;
