import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import { Fragment } from "react";
import IsLoggedInLogic from "../../components/IsLoggedInLogic";

const Profile = ({ setLoginErrorMsg, setIsLoading, setLoggedIn }) => {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setIsLoading,
    setLoggedIn
  );

  const userData = useSelector((state) => state.user);
  const userDepots = useSelector((state) => state.depots);

  return (
    <Container className="mt-4">
      <Formik
        initialValues={{ ...userData }}
        // validationSchema={reviewShema}
        onSubmit={(values, actions) => {
          console.log("RUNNING SUBMIT!");
          //   handleSubmit(values);
          actions.setSubmitting(false);
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
                  placeholder="Name"
                  defaultValue={userData.name}
                  onChange={props.handleChange("name")}
                />
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
                      defaultValue={userData.email}
                      onChange={props.handleChange("email")}
                    />
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
                <Form.Control type="password" placeholder="New Password" />
              </Form.Group>

              {/* Confirm password */}
              <Form.Group
                as={Col}
                className="col-12 col-md-6 mt-3"
                controlId="formGridPasswordConfirm"
              >
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm Password" />
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
                  type="select"
                  key={userData.default_branch ? "notLoadedYet" : "loaded"}
                  defaultValue={userData.default_branch}
                  onChange={props.handleChange("default_branch")}
                  isInvalid={!!props.errors.status}
                >
                  {userDepots.map((depot) => {
                    return <option value={depot.id}>{depot.name}</option>;
                  })}
                </Form.Control>
                <Form.Text className="text-danger ms-2">
                  {props.touched.status && props.errors.status}
                </Form.Text>
              </Form.Group>
            </Row>

            <Button variant="success" type="submit">
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Profile;
