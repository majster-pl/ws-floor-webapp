import { useState, useEffect, useRef } from "react";
import { Row, Col, Modal, Form, Button, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import apiClient from "../../service/api/api";
import * as yup from "yup";
import { useSelector, useDispatch, RootStateOrAny } from "react-redux";
import { reloadWorkshop } from "../../actions";
import moment from "moment";

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
  const focusDiv = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (focusDiv.current) focusDiv.current.focus();
  }, [focusDiv]);

  // Submit function
  const handleSubmit = (values) => {
    let url = "/api/v1/events/" + data.event_id;
    console.log("RUNNING SUBMIT!");
    setWaitingResponse(true);

    apiClient
      .patch(url, values)
      .then((response) => {
        // setTableData(response.data.data);
        // console.log(response.data);
        handleCloseMainModal();
        setWaitingResponse(false);
        // reloadCalendar();
        // toast.success("Event updated successfully");
        toast.success("Changes saved", {
          autoClose: 1500,
          hideProgressBar: true,
          position: "bottom-right",
        });
      })
      .catch((err) => {
        console.log("error:", err);
        setWaitingResponse(false);
        toast.error(err.statusText + " - Event NOT updated!");
      });
  };

  // handle Close
  const handleClose = () => {
    dispatch(reloadWorkshop(Math.random()));
    handleCloseMainModal();
  };

  const getCurrentDateTime = (init) => {
    let dateTime = moment(new Date()).format("DD-MM-yy H:mm");
    return init ? `[ ${dateTime} ] - ` : `\n[ ${dateTime} ] - `;
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
          handleSubmit(values);
          actions.setSubmitting(false);
        }}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <Modal.Header>
              <Modal.Title>
                <h3 className="my-auto">Update Notes</h3>
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
                  New status
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    className="text-pink"
                    disabled
                    plaintext
                    name="others"
                    placeholder="Customer Name"
                    value={props.values.status || ""}
                  />
                </Col>
              </Form.Group>
              <Form.Text className="text-danger ms-2">
                {props.touched.status && props.errors.status}
              </Form.Text>

              {/* Special Inst */}
              <Form.Group as={Row} controlId="formSpecialInst">
                <Form.Label column sm="3" className="text-md-end">
                  Job Notes
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    maxLength={100}
                    as="textarea"
                    rows={3}
                    onFocus={(e) =>
                      e.currentTarget.setSelectionRange(
                        e.currentTarget.value.length,
                        e.currentTarget.value.length
                      )
                    }
                    ref={focusDiv}
                    name="free_text"
                    placeholder="Notes for a job (internal use)"
                    onChange={props.handleChange("free_text")}
                    defaultValue={
                      props.values.free_text
                        ? props.values.free_text + getCurrentDateTime(0)
                        : getCurrentDateTime(1)
                    }
                  />
                  <Form.Text className="text-danger ms-2">
                    {props.errors.free_text}
                  </Form.Text>
                </Col>
              </Form.Group>
              <Form.Text className="text-danger ms-2">
                {props.touched.free_text && props.errors.free_text}
              </Form.Text>

              {/* NOTIFICATION */}
              <Form.Group as={Row} controlId="formNotification">
                <Form.Label column className="text-md-end col-1 col-sm-3">
                  <i
                    className={`fas ${
                      props.values.notification
                        ? "fa-bell text-success"
                        : "fa-bell-slash text-danger"
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
