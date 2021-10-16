import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Modal,
  Form,
  Button,
  Spinner,
  Container,
  Collapse,
} from "react-bootstrap";
import { Formik } from "formik";
import apiClient from "../../service/api/api";
import * as yup from "yup";
import moment from "moment";
import HistoryListItem from "./components/HistoryListItem";

const UpdateStatus = ({
  data,
  handleCloseMainModal,
  toast,
  reloadCalendar,
}) => {
  const [waitingResponse, setWaitingResponse] = useState(false);
  // Form validation
  const reviewShema = yup.object({
    // status: yup.string().required(),
  });
  const [open, setOpen] = useState(true);

  // handle Close
  const handleClose = () => {
    handleCloseMainModal();
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
          console.log("RUNNING SUBMIT!");
          // handleSubmit(values);
          actions.setSubmitting(false);
        }}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <Modal.Header>
              <Modal.Title>
                <h3 className="my-auto">Info</h3>
              </Modal.Title>
              <button
                type="button"
                className="btn-close test-class"
                aria-label="Close"
                onClick={() => handleClose()}
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
                    disabled
                    plaintext
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
                    value={props.values.customer_name || ""}
                  />
                </Col>
              </Form.Group>
              {/* Description */}
              <Form.Group as={Row} className="my-2">
                <Form.Label column sm="3" className="text-md-end">
                  Description
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    as="textarea"
                    // plaintext
                    readOnly
                    rows={
                      props.values.description.split(/\r\n|\r|\n/).length > 4
                        ? 4
                        : props.values.description.split(/\r\n|\r|\n/).length
                    }
                    value={props.values.description || ""}
                  />
                </Col>
              </Form.Group>

              {/* Status */}
              <Form.Group as={Row}>
                <Form.Label column sm="3" className="text-md-end">
                  Status
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    disabled
                    plaintext
                    value={props.values.status || ""}
                  />
                </Col>
              </Form.Group>

              {/* Allowed Time */}
              <Form.Group as={Row} className="">
                <Form.Label column sm="3" className="text-md-end">
                  Allowed time
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    disabled
                    plaintext
                    value={props.values.allowed_time + " h" || ""}
                  />
                </Col>
              </Form.Group>

              {/* Booked date */}
              <Form.Group as={Row}>
                <Form.Label column sm="3" className="text-md-end">
                  Booked date
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    disabled
                    plaintext
                    value={
                      moment(props.values.booked_date_time).format(
                        "DD-MM-YYYY H:mm"
                      ) || ""
                    }
                  />
                </Col>
              </Form.Group>

              {/* Arrived date */}
              <Form.Group as={Row}>
                <Form.Label column sm="3" className="text-md-end">
                  Arrived date
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    disabled
                    plaintext
                    value={
                      moment(props.values.arrived_date).format(
                        "DD-MM-YYYY H:mm"
                      ) || ""
                    }
                  />
                </Col>
              </Form.Group>

              {/* Others */}
              <Form.Group as={Row} className="">
                <Form.Label column sm="3" className="text-md-end">
                  Others
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    disabled
                    plaintext
                    value={props.values.others || "n/a"}
                  />
                </Col>
              </Form.Group>

              {/* Special Inst. */}
              <Form.Group as={Row} className="">
                <Form.Label column sm="3" className="text-md-end">
                  Special Inst.
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    disabled
                    plaintext
                    value={props.values.special_instructions || "n/a"}
                  />
                </Col>
              </Form.Group>

              {/* Event ID */}
              <Form.Group as={Row} className="">
                <Form.Label column sm="3" className="text-md-end">
                  Event ID
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    disabled
                    plaintext
                    value={props.values.event_id || "n/a"}
                  />
                </Col>
              </Form.Group>
              {/* Job icons */}
              <Form.Group as={Row} className="">
                <Form.Label column sm="3" className="text-md-end">
                  Info
                </Form.Label>
                <Col sm="9">
                  <Row className="justify-content-start mt-1">
                    <Col
                      className={props.values.breakdown ? "col-auto" : "d-none"}
                    >
                      <i
                        className="fas fa-car-crash text-danger"
                        title="Breakdown"
                      ></i>
                    </Col>
                    <Col
                      className={props.values.waiting ? "col-auto" : "d-none"}
                    >
                      <i
                        className="fas fa-clock text-info"
                        title="Customer waiting"
                      ></i>
                    </Col>
                  </Row>
                </Col>
              </Form.Group>
              {/* Key location */}
              <Form.Group as={Row} className="">
                <Form.Label column sm="3" className="text-md-end">
                  Key location
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    disabled
                    plaintext
                    value={props.values.key_location || "n/a"}
                  />
                </Col>
              </Form.Group>
              {/* Milage in */}
              <Form.Group as={Row} className="">
                <Form.Label column sm="3" className="text-md-end">
                  Mileage In
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    disabled
                    plaintext
                    value={props.values.odometer_in + " km" || "n/a"}
                  />
                </Col>
              </Form.Group>
              {/* Special Inst */}
              <Form.Group as={Row} className="my-2">
                <Form.Label column sm="3" className="text-md-end">
                  Job Notes
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    as="textarea"
                    // plaintext
                    readOnly
                    rows={4}
                    value={props.values.free_text || ""}
                  />
                  <Form.Text className="text-danger ms-2">
                    {props.errors.free_text}
                  </Form.Text>
                </Col>
              </Form.Group>
              {/* History */}
              <Form.Group as={Row} className="my-2">
                <Form.Label column sm="3" className="text-md-end">
                  History
                </Form.Label>
                <Col sm="9">
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
                  </Container>
                </Col>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => handleClose()}>
                Close
              </Button>
              <Button
                variant="success"
                type="submit"
                disabled={waitingResponse || !props.dirty}
              >
                <Spinner
                  className={`me-2 ${waitingResponse ? "" : "d-none"}`}
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Save
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </>
  );
};
export default UpdateStatus;
