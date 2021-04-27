import { Form, Button, Spinner } from "react-bootstrap";
import "./Login.css";
import LoginLogic from "./LoginLogic";

const Login = (setLoggedIn) => {
  const {
    username,
    password,
    sendGetRequest,
    setUsername,
    setPassword,
    errorMessage,
    isLoading,
    isEmailValid,
    isPasswordValid,
  } = LoginLogic(setLoggedIn);
  // const [validated, setValidated] = useState(false);

  return (
    <div className="center">
      <Form
        noValidate
        // validated={validated}
        onSubmit={(e) => {
          sendGetRequest(e);
        }}
      >
        <Form.Group controlId="formBasicEmail">
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

        <Form.Group controlId="formBasicPassword">
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
          
          <Form.Control.Feedback type="invalid" className="is-invalid d-inline">
            {errorMessage} <br></br>
            {sessionStorage.getItem('isLoggedIn') === "false" ? sessionStorage.getItem("loginError") : ""}
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="success" type="submit" block disabled={isLoading}>
          {isLoading ? (
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
      </Form>
    </div>
  );
};

export default Login;
