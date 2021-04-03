import { Form, Button, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
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
            // className="is-invalid"
            placeholder="Enter email"
            defaultValue={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <Form.Control.Feedback type="invalid">
            Please enter user email address.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            defaultValue={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Form.Control.Feedback type="invalid" className="is-invalid d-inline">
            {errorMessage}
          </Form.Control.Feedback>
        </Form.Group>
        {/* <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group> */}
        {/* <p className="primary">{errorMessage}</p> */}
        <Button
          variant="primary"
          type="submit"
          block
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </Form>
    </div>
  );
};

export default Login;
