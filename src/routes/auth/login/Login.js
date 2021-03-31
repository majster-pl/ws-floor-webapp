import { Form, Button, Row, Col } from "react-bootstrap";
import { useState } from "react";
import "./Login.css";
import LoginLogic from './LoginLogic'


const Login = (setLoggedIn) => {

    const {username, password, sendGetRequest, setUsername, setPassword} = LoginLogic(setLoggedIn);

  return (
    <div className="center">
      <Form
        onSubmit={(e) => {
          sendGetRequest(e);
        }}
      >
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            defaultValue={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            defaultValue={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Login;
