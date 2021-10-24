import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Accordion,
  useAccordionButton,
  Modal,
} from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import apiClient from "../../../../service/api/api";
import { useHistory } from "react-router-dom";
import FormInput from "../../components/FormInput";
import moment from "moment";
import { Typeahead } from "react-bootstrap-typeahead";

const GeneralTab = ({
  id,
  toast,
  formGeneral,
  setFormGeneral,
  setIsLoading,
  setToggleEditForm,
  toggleEditForm,
  isLoading,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModaldata] = useState({
    reg: "",
    id: 0,
  });
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const [removeAll, setRemoveAll] = useState(false);
  const history = useHistory();
  const [customers, setCustomers] = useState([]);
  const [showTypeahead, setShowTypeahead] = useState(false);

  const reviewSchema = yup.object({
    reg: yup
      .string()
      .required("Vehicle reg is required")
      .min(4, "Must be at least 4 characters"),
    make: yup.string().min(3),
    model: yup.string().min(3),
    status: yup.string().required("You must sellect status"),
    customer_id: yup
      .number()
      .moreThan(
        0,
        "You must select customer from the list, if not present please create one first"
      ),
  });

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

  // function to update customer
  const updateCustomer = (values) => {
    setIsLoading(true);
    let url = "/api/v1/assets/" + id;
    apiClient
      .patch(url, values)
      .then((response) => {
        setToggleEditForm(true);
        toast.success("Asset data updated.");
        setFormGeneral({ ...response.data.data });
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
    let url = "/api/v1/assets/" + modalData.id;
    setIsLoading(true);

    apiClient
      .delete(url)
      .then((response) => {
        console.log(response);
        toast.success("Asset removed.");
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

  useEffect(() => {
    // setIsLoading(true);
    console.log("fetchin!!");
    apiClient
      .get("/api/v1/customers")
      .then((response) => {
        setCustomers(response.data.data);
      })
      .catch((err) => {
        return [];
      });
  }, []);

  useEffect(() => {
    if (formGeneral.customer_name !== "") {
      setShowTypeahead(true);
    }
  }, [formGeneral]);

  return (
    <>
      {isLoading == true ? (
        <Container></Container>
      ) : (
        <Container className="py-3 ">
          <Formik
            initialValues={{ ...formGeneral }}
            validateOnChange={true}
            validationSchema={reviewSchema}
            enableReinitialize={true}
            onSubmit={(values) => {
              updateCustomer(values);
            }}
          >
            {(props) => (
              <>
                <Row className="justify-content-end">
                  <Col className="col-auto">
                    <Button
                      variant="danger"
                      onClick={() => {
                        let data = {
                          reg: props.values.reg,
                          id: props.values.id,
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
                      {toggleEditForm
                        ? "Edit"
                        : !props.dirty
                        ? "Cancel"
                        : "Save"}
                    </Button>
                  </Col>
                </Row>
                <hr></hr>
                <Row className="mx-1 g-3">
                  <Form.Group
                    as={Col}
                    className="col-12 col-md-6"
                    controlId="formReg"
                  >
                    <FormInput
                      _label="Reg"
                      _errors={props.errors.reg}
                      _touched={props.touched.reg}
                      _maxLength={7}
                      _disabled={toggleEditForm}
                      _type="text"
                      _placeholder="Vehicle Reg"
                      _value={props.values.reg.toUpperCase()}
                      _onChange={props.handleChange("reg")}
                    />
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    className="col-12 col-md-6"
                    controlId="formMake"
                  >
                    <FormInput
                      _label="Make"
                      _errors={props.errors.make}
                      _touched={props.touched.make}
                      _maxLength={20}
                      _disabled={toggleEditForm}
                      _type="text"
                      _placeholder="Vehicle Make"
                      _value={props.values.make}
                      _onChange={props.handleChange("make")}
                    />
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    className="col-12 col-md-6"
                    controlId="formModel"
                  >
                    <FormInput
                      _label="Model"
                      _errors={props.errors.model}
                      _touched={props.touched.model}
                      _maxLength={20}
                      _disabled={toggleEditForm}
                      _type="text"
                      _placeholder="Vehicle Model"
                      _value={props.values.model}
                      _onChange={props.handleChange("model")}
                    />
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    className="col-12 col-md-6"
                    controlId="formOwner"
                  >
                    <Form.Label>Owner:</Form.Label>
                    {showTypeahead && !toggleEditForm ? (
                      <Typeahead
                        id="customer-typeahead"
                        labelKey="customer_name"
                        key={"typehead-1"}
                        isInvalid={
                          props.touched.customer_id && props.errors.customer_id
                        }
                        disabled={toggleEditForm}
                        onChange={(selected) => {
                          const name =
                            selected.length > 0
                              ? selected[0].customer_name
                              : "";
                          const id =
                            selected.length > 0 ? selected[0].customer_id : 0;
                            console.log(id);
                            
                          props.setFieldValue("customer_id", id);
                          props.setFieldValue("belongs_to_name", name);
                          props.setFieldValue("belongs_to", id);
                        }}
                        //   clearButton
                        options={customers}
                        placeholder="Select customer..."
                        defaultSelected={[props.values.customer_name]}
                      />
                    ) : (
                      <div>{[props.values.customer_name]}</div>
                    )}
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {props.touched.customer_id && props.errors.customer_id}
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
                <Container className="my-3 text-muted">
                  <Accordion>
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
                  </Accordion>
                </Container>
              </>
            )}
          </Formik>
        </Container>
      )}
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
            Removeing asset also erase all bookings and any data assosiated with
            this asset! Are you sure you want to remove{" "}
            <span className="text-success"> {modalData.reg}</span> ?
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
