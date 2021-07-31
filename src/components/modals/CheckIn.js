import { useEffect } from "react";
import { Row, Col, Modal, Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import apiClient from "../../service/api/api";

const CheckIn = ({ data, handleCloseMainModal }) => {
  // useEffect(() => {
  //   const test = () => {
  //     console.log("loggggggg.....");
  //     let url = "/api/v1/events/3";

  //     apiClient
  //       .get(url)
  //       .then((response) => {
  //         console.log(response.data.data);
  //         // setAssets(response.data.data);
  //       })
  //       .catch((err) => {
  //         console.log("error:", err);
  //       });
  //   };
  //   test();
  // }, []);

  return (
    <>
      <Formik
        initialValues={{ name: "jared" }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
            // handleModalSubmit();
          }, 1000);
        }}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <Modal.Header>
              <Modal.Title>Check in</Modal.Title>
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
                  <Form.Text className="text-danger ms-2">
                    {props.errors.reg}
                  </Form.Text>
                </Col>
              </Form.Group>

              {/* Customer */}
              <Form.Group as={Row} controlId="formCustomer">
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
                    value={props.values.customer}
                  />
                  <Form.Text className="text-danger ms-2">
                    {props.errors.customer}
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
                    as="textarea"
                    rows={3}
                    name="special_inst"
                    placeholder="Special instructions"
                    onChange={props.handleChange("special_inst")}
                    value={props.values.special_inst}
                    // defaultValue={modalData.description}
                  />
                  <Form.Text className="text-danger ms-2">
                    {props.errors.special_inst}
                  </Form.Text>
                </Col>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formWaiting">
                <Form.Check type="checkbox" label="Customer waiting" />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseMainModal}>
                Close
              </Button>
              <Button variant="success" type="submit">
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </>
  );
};
export default CheckIn;
