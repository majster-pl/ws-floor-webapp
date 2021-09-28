import { useParams } from "react-router-dom";
import {
  Container,
  Button,
  Tabs,
  Tab,
  Form,
  Row,
  Col,
  Accordion,
  Modal,
  useAccordionButton,
} from "react-bootstrap";
import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import { useState, useEffect } from "react";
import apiClient from "../../service/api/api";
import moment from "moment";
import { Formik } from "formik";
import { useHistory } from "react-router-dom";
import * as yup from "yup";
import FormInput from "./components/FormInput";

function AssetPage({ setIsLoading, setLoggedIn, setLoginErrorMsg, toast }) {
  // when page oppened check if user logged in, if not redirect to login page
  const {} = IsLoggedInLogic(setLoginErrorMsg, setIsLoading, setLoggedIn);
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModaldata] = useState({
    reg: "",
    id: 0,
  });
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const [removeAll, setRemoveAll] = useState(false);

  const { id } = useParams(); // parameter from url

  const reviewSchema = yup.object({
    reg: yup
      .string()
      .required("Vehicle reg is required")
      .min(4, "Must be at least 4 characters"),
    make: yup.string().min(3),
    model: yup.string().min(3),
    status: yup.string().required("You must sellect status"),
  });

  const [formGeneral, setFormGeneral] = useState({
    id: "",
    reg: "",
    status: "",
    model: "",
    make: "",
    created_by_name: "",
    belongs_to: "",
    created_at: "",
    updated_at: "",
    uuid: "",
  });
  const [toggleEditForm, setToggleEditForm] = useState(true); // state of edit/save button
  const [key, setKey] = useState("general"); // current tab state

  // function to remove customer
  const removeCustomer = () => {
    let url = "/api/v1/assets/" + modalData.id;
    setIsLoading(true);

    apiClient
      .delete(url)
      .then((response) => {
        console.log(response);
        toast.success("Asset removed.");
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

  // function to update customer
  const updateCustomer = (values) => {
    setIsLoading(true);
    let url = "/api/v1/assets/" + id;
    apiClient
      .patch(url, values)
      .then((response) => {
        setToggleEditForm(true);
        toast.success("Asset data updated.");
        setIsLoading(false);
      })
      .catch((err) => {
        setToggleEditForm(false);
        toast.error("Changes not saved. " + err.data.message, false);
        setIsLoading(false);
      });
  };

  // fech data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiClient.get("/api/v1/assets/" + id);
        console.log(result.data.data);
        setFormGeneral(result.data.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toggleEditForm]);

  // //if still waiting response from server then display spinner
  // if (isLoading) {
  //   // return <SpinnerComponent />;
  //   return <></>;
  // }
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
    <div className="scroll">
      <Container className="py-3">
        <Container className="my-2 mb-4">
          <div className="row justify-content-between">
            <div className="col-12 col-md-4  mb-3">
              <Button
                className="mt-1"
                variant="light"
                onClick={() => history.goBack()}
              >
                Back
              </Button>
            </div>
            <div className="col-12 col-md-6">
              <div className="row mx-auto my-2">
                <div className="col-5 mx-auto bg-info rounded text-center">
                  <div className="fs-2 my-auto fw-bold text-uppercase disable-select text-sendary-extra ">
                    &nbsp;{formGeneral.reg}&nbsp;
                  </div>
                </div>
              </div>
              <div className="col text-center mt-3">
                <div className="row ">
                  <div className="col-auto mx-auto">
                    <div>
                      Added
                      <span className="fs-5 mx-2 text-success">
                        {moment(formGeneral.created_at).format("DD/MM/YYYY")}
                      </span>
                    </div>
                  </div>
                  <div className="col-auto mx-auto">
                    Status
                    <span className="fs-5 mx-2 text-capitalize text-success">
                      {formGeneral.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>

        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
        >
          <Tab
            eventKey="general"
            title="General"
            className="bg-darker border-start border-end border-bottom shadow"
          >
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
                        controlId="formStatus"
                      >
                        <Form.Label>Status:</Form.Label>
                        <Form.Control
                          as="select"
                          plaintext={toggleEditForm}
                          disabled={toggleEditForm}
                          onChange={props.handleChange("status")}
                        >
                          <option
                            value="active"
                            selected={"active" == props.values.status}
                          >
                            Active
                          </option>
                          <option
                            value="on_hold"
                            selected={"on_hold" == props.values.status}
                          >
                            On Hold
                          </option>
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
                                {moment(
                                  new Date(props.values.created_at)
                                ).format("DD-MMM-YYYY HH:mm")}
                              </small>
                            </Col>

                            <Col>
                              <small className="font-monospace">
                                Last update:{" "}
                                {moment(
                                  new Date(props.values.updated_at)
                                ).format("DD-MMM-YYYY HH:mm")}
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
          </Tab>
          <Tab
            eventKey="owner"
            title="Owner"
            className="bg-darker border-start border-end border-bottom shadow"
          >
            <Container className="py-3">
              Here will be displayed current owner of the vehicle.
            </Container>
          </Tab>
          <Tab
            eventKey="history"
            title="History"
            className="bg-darker border-start border-end border-bottom shadow"
          >
            <Container className="py-3">
              Here will be displayed history for the vehicle.
            </Container>
          </Tab>

          <Tab
            eventKey="bookings"
            title="Bookigns"
            className="bg-darker border-start border-end border-bottom shadow"
          >
            <Container className="py-3">
              Here will be displayed all future booking for this asset.
            </Container>
          </Tab>
        </Tabs>
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
    </div>
  );
}

export default AssetPage;
