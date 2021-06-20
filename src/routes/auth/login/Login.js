import { Form, Button, Spinner } from "react-bootstrap";
import "./Login.css";
import LoginLogic from "./LoginLogic";

const Login = ({ setLoggedIn, loginErrorMsg, setLoginErrorMsg, showToast }) => {
  const {
    username,
    password,
    sendGetRequest,
    setUsername,
    setPassword,
    isSpinning,
    isEmailValid,
    isPasswordValid,
  } = LoginLogic(setLoggedIn, setLoginErrorMsg, showToast);

  return (
    <div className="center">
      <Form
        className="login-form"
        noValidate
        // validated={validated}
        onSubmit={(e) => {
          sendGetRequest(e);
        }}
      >
        <Form.Group controlId="formBasicEmail" className="mb-3">
          <Form.Label>Email address:</Form.Label>
          <Form.Control
            type="email"
            className={isEmailValid ? "" : "is-invalid"}
            placeholder="Enter email"
            defaultValue={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <Form.Control.Feedback type="invalid">
            Please enter valid email address.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formBasicPassword" className="mb-3">
          <Form.Label>Password:</Form.Label>

          <Form.Control
            type="password"
            className={isPasswordValid ? "" : "is-invalid"}
            placeholder="Password"
            defaultValue={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <Form.Control.Feedback type="invalid">
            Password field can't be empty!
          </Form.Control.Feedback>

          <Form.Control.Feedback type="invalid" className="is-invalid d-block">
            {loginErrorMsg} <br></br>
            {sessionStorage.getItem("isLoggedIn") === "false"
              ? sessionStorage.getItem("errorMessage")
              : ""}
          </Form.Control.Feedback>
        </Form.Group>
        <div className="d-grid">
          <Button variant="success" type="submit" disabled={isSpinning}>
            {isSpinning ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
