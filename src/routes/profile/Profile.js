import { Container, Form, Row, Col, Button, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import { Fragment } from "react";
import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import apiClient from "../../service/api/api";
import { useHistory } from "react-router-dom";

const Profile = ({ setLoginErrorMsg, setIsLoading, setLoggedIn, toast }) => {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setIsLoading,
    setLoggedIn
  );
  const history = useHistory();

  const userData = useSelector((state) => state.user);
  const userDepots = useSelector((state) => state.depots);

  // Form validation
  const reviewShema = yup.object().shape({
    name: yup.string().min(3, "You must enter at least 3 characters"),
    email: yup.string().email("Enter valid email address"),
    default_branch: yup.number(),
    newPassword: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    passwordConfirmation: yup
      .string()
      .required()
      .oneOf([yup.ref("newPassword"), null], "Passwords doesn't match!")
      .when("newPassword", (newPassword) => {
        if (typeof newPassword !== "undefined") {
          return yup
            .string()
            .required("You need to confirm new password")
            .oneOf([yup.ref("newPassword"), null], "Passwords doesn't match!");
        } else {
          return yup
            .string()
            .oneOf([yup.ref("newPassword"), null], "Passwords doesn't match!");
        }
      }),
  });

  async function handleSubmit(values, actions) {
    let url = "/api/v1/user/" + userData.id;
    // console.log(values);
    const user = await apiClient
      .patch(url, values)
      .then((response) => {
        // console.log(response);
        toast.success("Profile data updated successfully!");
        actions.setSubmitting(false);
        actions.resetForm();
      })
      .catch((err) => {
        if (err.status === 419) {
          setLoggedIn(false);
          setLoginErrorMsg("You are no longer logged in, please log in again.");
          sessionStorage.setItem("loginStatus", "false");
          history.push("/login");
        }
        console.log(err);
        if (err.data.hasOwnProperty("errors")) {
          const keys = Object.keys(err.data.errors);
          for (const key of keys) {
            toast.error(err.data.errors[key][0]);
          }
        } else {
          if (err.data.hasOwnProperty("message")) {
            toast.error(err.data.message);
          } else {
            toast.error(JSON.stringify(err.data));
          }
        }
        actions.setSubmitting(false);
      });
  }

  return (
    <Container className="py-3 scroll">
      <Formik
        initialValues={{ ...userData, passwordConfirmation: "" }}
        validationSchema={reviewShema}
        onSubmit={(values, actions) => {
          actions.setSubmitting(true);
          handleSubmit(values, actions);
        }}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <h2>Accout Settings</h2>
            <h4 className="text-muted">
              You can update your name, email & password using the form below.
            </h4>
            <Row className="mt-2">
              {/* Name */}
              <Form.Group
                as={Col}
                className="col-12 col-md-6 mt-3"
                controlId="formGridName"
              >
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  disabled={props.isSubmitting}
                  placeholder="Name"
                  defaultValue={userData.name}
                  onChange={props.handleChange("name")}
                  isInvalid={!!props.errors.name && props.touched.name}
                />
                <Form.Text className="text-danger ms-2">
                  {props.touched.name && props.errors.name}
                </Form.Text>
              </Form.Group>

              {/* E-mail */}
              <Form.Group
                as={Col}
                className="col-12 col-md-6 mt-3"
                controlId="formGridEmail"
              >
                <Form.Label>Email</Form.Label>
                <Fragment>
                  <Form.Group>
                    <Form.Control
                      type="email"
                      key={userData.email ? "notLoadedYet" : "loaded"}
                      placeholder="Enter email"
                      disabled={props.isSubmitting}
                      defaultValue={userData.email}
                      onChange={props.handleChange("email")}
                      isInvalid={!!props.errors.email && props.touched.email}
                    />
                    <Form.Text className="text-danger ms-2">
                      {props.touched.email && props.errors.email}
                    </Form.Text>
                  </Form.Group>
                </Fragment>
              </Form.Group>
            </Row>

            <Row className="">
              {/* New password */}
              <Form.Group
                as={Col}
                className="col-12 col-md-6 mt-3"
                controlId="formGridPasswordNew"
              >
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  onChange={props.handleChange("newPassword")}
                  disabled={props.isSubmitting}
                  autoComplete="new-password"
                  placeholder="New Password"
                  isInvalid={
                    !!props.errors.newPassword && props.touched.newPassword
                  }
                />
                <Form.Text className="text-danger ms-2">
                  {props.touched.newPassword && props.errors.newPassword}
                </Form.Text>
              </Form.Group>

              {/* Confirm password */}
              <Form.Group
                as={Col}
                className="col-12 col-md-6 mt-3"
                controlId="formGridPasswordConfirm"
              >
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  defaultValue={props.values.passwordConfirmation}
                  onChange={props.handleChange("passwordConfirmation")}
                  disabled={props.isSubmitting}
                  autoComplete="new-password-repete"
                  placeholder="Confirm Password"
                  isInvalid={
                    !!props.errors.passwordConfirmation &&
                    props.touched.passwordConfirmation
                  }
                />
                <Form.Text className="text-danger ms-2">
                  {props.touched.passwordConfirmation &&
                    props.errors.passwordConfirmation}
                </Form.Text>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group
                as={Col}
                className="col-12 col-md-6 mt-3"
                controlId="formGridBranch"
              >
                <Form.Label>Default Branch</Form.Label>
                <Form.Control
                  required
                  as="select"
                  type="number"
                  disabled={props.isSubmitting}
                  key={userData.default_branch ? "notLoadedYet" : "loaded"}
                  defaultValue={userData.default_branch}
                  // onChange={(e) => {
                  //   console.log(e);
                  //   console.log(props.values.default_branch);
                  //   props.handleChange("default_branch");
                  //   console.log(props.values.default_branch);

                  // }}
                  onChange={props.handleChange("default_branch")}
                  isInvalid={!!props.errors.status}
                >
                  {userDepots.map((depot) => {
                    return (
                      <option key={"opt_" + depot.id} value={depot.id}>
                        {depot.name}
                      </option>
                    );
                  })}
                </Form.Control>
                <Form.Text className="text-danger ms-2">
                  {props.touched.default_branch && props.errors.default_branch}
                </Form.Text>
              </Form.Group>
            </Row>
            <Container className="text-end px-0">
              <Button
                disabled={!props.dirty}
                className={props.dirty ? "disable" : ""}
                variant="success"
                type="submit"
              >
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  className={`me-2 ${props.isSubmitting ? "" : "d-none"}`}
                  role="status"
                  aria-hidden="true"
                />
                <span className="">
                  {props.isSubmitting ? "Saving..." : "Save"}
                </span>
              </Button>
            </Container>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Profile;
