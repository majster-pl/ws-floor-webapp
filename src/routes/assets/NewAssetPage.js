// import { useParams } from "react-router-dom";
import {
  Container,
  Button,
  Card,
  Spinner,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import apiClient from "../../service/api/api";
import { Formik, yupToFormErrors } from "formik";
import * as yup from "yup";
import FormInput from "./components/FormInput";

function NewAssetPage({ setIsLoading, setLoggedIn, setLoginErrorMsg, toast }) {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setIsLoading,
    setLoggedIn
  );
  const history = useHistory();

  const reviewSchema = yup.object({
    reg: yup.string().required().min(4),
    make: yup.string().min(3),
    model: yup.string().min(3),
    status: yup.string().required(),
  });

  const [formGeneral, setFormGeneral] = useState({
    reg: "",
    make: "",
    model: "",
    created_at: "",
    status: "",
  });
  const [key, setKey] = useState("general"); // current tab state

  // function to add new customer
  function handleSubmit(values, { setSubmitting }) {
    async function saveCustomer() {
      let url = "/api/v1/assets";
      try {
        const resp = await apiClient.post(url, values);
        console.log(resp.data);
        toast.success("New asset added.");
        setSubmitting(false);
        history.push("/assets/" + resp.data.id);
      } catch (err) {
        // Handle Error Here
        toast.error("New Asset not saved! " + JSON.stringify(err.data.message));
        console.error(err);
        setSubmitting(false);
      }
    }
    saveCustomer();
  }

  return (
    <div className="scroll">
      <Container className="py-3">
        <Formik
          initialValues={formGeneral}
          validateOnChange={true}
          validationSchema={reviewSchema}
          enableReinitialize={true}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <>
              <Container className="my-2 mb-4">
                <div className="row justify-content-between">
                  <div className="col-12 col-md-4 mb-3">
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
                          &nbsp;{props.values.reg}&nbsp;
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Container>

              <Container>
                <Card.Title>Add Asset</Card.Title>

                <Row className="mb-4 mt-2 g-3">
                  <Form.Group
                    as={Col}
                    className="col-12 col-md-6"
                    controlId="formReg"
                  >
                    <FormInput
                      _label="Reg"
                      _errors={props.errors.reg}
                      _touched={props.touched.reg}
                      _maxLength={8}
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
                      onChange={props.handleChange("status")}
                      onBlur={props.handleBlur("status")}
                      isInvalid={props.touched.status && props.errors.status}
                    >
                      <option disabled selected>
                        --- select one ---
                      </option>
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
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {props.touched.status && props.errors.status}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="justify-content-end">
                  <div className="col-12 col-md-3 align-self-end text-end">
                    <div className="d-grid">
                      <Button
                        variant="success"
                        disabled={props.isSubmitting}
                        onClick={() => props.submitForm()}
                      >
                        {props.isSubmitting ? (
                          <>
                            <Spinner
                              className="mx-2"
                              as="span"
                              animation="grow"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                            Saving...
                          </>
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </div>
                  </div>
                </Row>
              </Container>
            </>
          )}
        </Formik>
      </Container>
    </div>
  );
}

export default NewAssetPage;
