import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Accordion,
  Modal,
  useAccordionButton,
} from "react-bootstrap";
import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import apiClient from "../../../../service/api/api";
import moment from "moment";
import { useHistory } from "react-router-dom";

const GeneralTab = ({
  id,
  toast,
  formGeneral,
  setIsLoading,
  toggleEditForm,
  setToggleEditForm,
}) => {
  const history = useHistory();
  const [removeAll, setRemoveAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const [modalData, setModaldata] = useState({
    customer_name: "",
    id: 0,
  });

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const reviewSchema = yup.object({
    customer_contact: yup
      .string()
      .required()
      .matches(phoneRegExp, "Phone number is not valid"),
    customer_name: yup
      .string()
      .min(3, "Customer name must be at least 3 characters"),
    email: yup.string().email(),
  });

  // function to update customer
  const updateCustomer = (values) => {
    setIsLoading(true);
    let url = "/api/v1/customers/" + id;
    apiClient
      .patch(url, values)
      .then((response) => {
        setToggleEditForm(true);
        toast.success("Customer data updated.");
        setIsLoading(false);
      })
      .catch((err) => {
        setToggleEditForm(false);
        toast.error("Changes not saved. " + err.data.message, false);
        setIsLoading(false);
      });
  };

  // function to remove customer
  const removeCustomer = () => {
    let url = "/api/v1/customers/" + modalData.id;
    setIsLoading(true);

    apiClient
      .delete(url)
      .then((response) => {
        console.log(response);
        toast.success("Customer removed.");
        // reloadTable();
        history.goBack();
        setShowModal(false);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(JSON.stringify(err));

        toast.error(
          <div className="toast_wrap">
            Unable to remove customer! {JSON.stringify(err.data.message)}
          </div>
        );
        setIsLoading(false);
      });
  };

  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
      console.log("totally custom!")
    );

    return (
      <Button variant="link-none text-info" onClick={decoratedOnClick}>
        {children}
      </Button>
    );
  }

  return (
    <>
      <Container className="py-3 ">
        <Formik
          initialValues={formGeneral}
          validateOnChange={true}
          validationSchema={reviewSchema}
          enableReinitialize={true}
          onSubmit={(values) => {
            updateCustomer(values);
            // console.log(values);
          }}
        >
          {(props) => (
            <>
              <Row className="justify-content-end">
                <Col className="col-auto">
                  <Button
                    variant="danger"
                    onClick={() => {
                      const data = {
                        customer_name: props.values.customer_name,
                        id: props.values.id,
                        uuid: props.values.uuid,
                      };
                      handleShowModal();
                      setModaldata(data);
                    }}
                  >
                    Remove
                  </Button>
                </Col>
                <Col className="col-auto mx-2">
                  <Button
                    variant={
                      toggleEditForm
                        ? "info"
                        : !props.dirty
                        ? "light"
                        : "success"
                    }
                    disabled={props.isSubmitting}
                    onClick={() => {
                      if (toggleEditForm) {
                        setToggleEditForm(false);
                      } else {
                        if (props.dirty) {
                          props.submitForm();
                        } else {
                          setToggleEditForm(true);
                        }
                      }
                    }}
                  >
                    {toggleEditForm ? "Edit" : !props.dirty ? "Cancel" : "Save"}
                  </Button>
                </Col>
              </Row>
              <hr></hr>
              <Row className="mx-1 g-3">
                <Form.Group
                  as={Col}
                  className="col-12 col-md-6"
                  controlId="formName"
                >
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    plaintext={toggleEditForm}
                    disabled={toggleEditForm}
                    type="text"
                    isInvalid={
                      props.touched.customer_name && props.errors.customer_name
                    }
                    placeholder="Enter customer name"
                    onChange={props.handleChange("customer_name")}
                    value={props.values.customer_name}
                  />
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {props.touched.customer_name && props.errors.customer_name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  as={Col}
                  className="col-12 col-md-6"
                  controlId="formContact"
                >
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                    plaintext={toggleEditForm}
                    disabled={toggleEditForm}
                    isInvalid={props.errors.customer_contact}
                    onChange={props.handleChange("customer_contact")}
                    value={props.values.customer_contact}
                    type="text"
                    placeholder="Contact number"
                  />
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {props.touched.customer_contact &&
                      props.errors.customer_contact}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  as={Col}
                  className="col-12 col-md-6"
                  controlId="formMail"
                >
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    plaintext={toggleEditForm}
                    disabled={toggleEditForm}
                    onChange={props.handleChange("email")}
                    value={props.values.email}
                    isInvalid={props.touched.email && props.errors.email}
                    type="text"
                    placeholder="Contact email"
                  />
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {props.touched.email && props.errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  as={Col}
                  className="col-12 col-md-6"
                  controlId="formStatus"
                >
                  <Form.Label>Status:</Form.Label>
                  <Form.Control
                    as="select"
                    type="select"
                    name="status"
                    plaintext={toggleEditForm}
                    disabled={toggleEditForm}
                    onChange={props.handleChange("status")}
                    value={props.values.status}
                  >
                    <option value="active">Active</option>
                    <option value="on_hold">On Hold</option>
                  </Form.Control>
                </Form.Group>
              </Row>
              <hr></hr>
              <Accordion>
                <Container className="my-3 text-muted">
                  <CustomToggle eventKey="0">More</CustomToggle>
                  <Accordion.Collapse eventKey="0">
                    <Container className="ms-3">
                      <Col>
                        <small className="font-monospace">
                          Creadted by: {props.values.created_by_name}
                        </small>
                      </Col>
                      <Col>
                        <small className="font-monospace">
                          Created at:{" "}
                          {moment(new Date(props.values.created_at)).format(
                            "DD-MMM-YYYY HH:mm"
                          )}
                        </small>
                      </Col>

                      <Col>
                        <small className="font-monospace">
                          Last update:{" "}
                          {moment(new Date(props.values.updated_at)).format(
                            "DD-MMM-YYYY HH:mm"
                          )}
                        </small>
                      </Col>
                      <Col>
                        <small className="font-monospace">
                          Unique customer id: {props.values.uuid}
                        </small>
                      </Col>
                      <Col>
                        <small className="font-monospace">
                          Status: {props.values.status}
                        </small>
                      </Col>
                    </Container>
                  </Accordion.Collapse>
                </Container>
              </Accordion>
            </>
          )}
        </Formik>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header>
          <Modal.Title className="text-danger">Warning!</Modal.Title>
          <Button
            className="btn-close btn-secondary"
            type="button"
            onClick={() => handleCloseModal()}
          />
        </Modal.Header>
        <Modal.Body>
          <p className="">
            Removeing customer also erase all bookings and any data assosiated
            with this customer! Are you sure you want to remove{" "}
            <span className="text-success"> {modalData.customer_name}</span> ?
          </p>
          <Form.Group className="mt-4" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              onChange={(event) => {
                console.log(modalData);
                setRemoveAll(event.target.checked);
              }}
              label="Yes, I want to remove it all"
              className="disable-select"
            />
            <Form.Text
              className={"text-danger " + (!removeAll ? "d-none" : "")}
            >
              <div className="text-uppercase">
                This operation can't be undone!
              </div>
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button
            variant="danger"
            disabled={!removeAll}
            onClick={() => removeCustomer()}
          >
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GeneralTab;
