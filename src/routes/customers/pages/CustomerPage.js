import { useParams } from "react-router-dom";
import { Container, Button, Tabs, Tab } from "react-bootstrap";
import IsLoggedInLogic from "../../../components/IsLoggedInLogic";
import { Link } from "react-router-dom";
import { useState } from "react";

function CustomerPage({ setLoggedIn, setLoginErrorMsg }) {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setLoggedIn
  );

  const { uuid } = useParams();
  const [key, setKey] = useState("home");

  //if still waiting response from server then display spinner
  if (isLoading) {
    return <SpinnerComponent />;
  }

  return (
    <div className="scroll">
      <Container className="my-2">
        <Button variant="info" as={Link} to={"/customers"}>
          Back
        </Button>
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="my-3"
        >
          <Tab eventKey="home" title="General">
            <p>tab 1</p>
          </Tab>
          <Tab eventKey="assets" title="Assets">
            <p>tab 2</p>
          </Tab>
          <Tab eventKey="contact" title="Contact">
            <p>tab 3</p>
          </Tab>
        </Tabs>
        Hello! {uuid}
      </Container>
    </div>
  );
}

export default CustomerPage;
