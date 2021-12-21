import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Modal,
  Form,
  Button,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { Formik } from "formik";
import apiClient from "../../service/api/api";
import * as yup from "yup";
import moment from "moment";

const CheckIn = ({ data, handleCloseMainModal, toast, reloadCalendar }) => {
  const [waitingResponse, setWaitingResponse] = useState(false);
  // Form validation
  const reviewShema = yup.object({
    odometer_in: yup
      .number()
      .typeError("You must specify mileage")
      .required("Vehicle current mileage is required"),

    key_location: yup
      .string()
      .required()
      .typeError("You must enter key location!"),
  });

  // Submit function
  const handleSubmit = (values) => {
    let url = "/api/v1/events/" + data.event_id;
    // change/override event status
    setWaitingResponse(true);
    values["status"] = "awaiting_labour";
    values["arrived_date"] = moment().format("YYYY-MM-DD  HH:mm:ss.000");

    apiClient
      .get("/sanctum/csrf-cookie")
      .then(() => {
        apiClient
          .patch(url, values)
          .then((response) => {
            // setTableData(response.data.data);
            // console.log(response.data);
            setWaitingResponse(false);
            handleCloseMainModal();
            reloadCalendar();
            toast.success("Event saved.");
          })
          .catch((err) => {
            setWaitingResponse(false);
            console.log("error:", err);
            toast.error(err.statusText + " - Event NOT saved!");
          });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // useEffect(() => {
  //   console.log("DATA:", data);
  // }, []);

  return (
    <>
      <Formik
        initialValues={{ ...data }}
        validationSchema={reviewShema}
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
                    value={props.values.reg || ""}
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
                    value={props.values.customer_name || ""}
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
                      value={props.values.odometer_in || ""}
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
                    maxLength={2000}
                    as="textarea"
                    rows={3}
                    name="special_instructions"
                    placeholder="Special instructions (max 100 characters)"
                    onChange={props.handleChange("special_instructions")}
                    value={props.values.special_instructions || ""}
                  />
                  <Form.Text className="text-danger ms-2">
                    {props.errors.special_inst}
                  </Form.Text>
                </Col>
              </Form.Group>

              {/* Key location */}
              <Form.Group as={Row}>
                <Form.Label column sm="3" className="text-md-end">
                  Key location
                </Form.Label>
                <Col sm="9">
                  <Row>
                    <Col sm="4">
                      <Form.Control
                        name="key_location"
                        placeholder="Peg nr."
                        value={props.values.key_location || ""}
                        onChange={props.handleChange("key_location")}
                        isInvalid={
                          props.touched.key_location &&
                          !!props.errors.key_location
                        }
                      />
                    </Col>
                    <Col sm="12">
                      <Form.Text className="text-danger ms-2">
                        {props.touched.key_location &&
                          props.errors.key_location}
                      </Form.Text>
                    </Col>
                  </Row>
                </Col>
              </Form.Group>

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
                    label="Waiting appointment"
                    name="waiting"
                    checked={props.values.waiting}
                    onChange={() =>
                      props.setFieldValue("waiting", !props.values.waiting)
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
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseMainModal}>
                Close
              </Button>
              <Button
                variant="success"
                type="submit"
                disabled={waitingResponse}
              >
                <Spinner
                  className={`me-2 ${waitingResponse ? "" : "d-none"}`}
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
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
