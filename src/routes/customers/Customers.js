import {
  Container,
  Row,
  Col,
  ButtonGroup,
  DropdownButton,
  Dropdown,
  Button,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import apiClient from "../../service/api/api";

const Customers = ({ setLoggedIn, setLoginErrorMsg }) => {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setLoggedIn
  );
  const [customers, setCustomers] = useState([]);

  //fetching customers list
  const getCustomers = () => {
    let url = "/api/v1/customer";
    apiClient
      .get(url)
      .then((response) => {
        // console.log(response.data.data);
        setCustomers(response.data.data);
        // return response.data.data;
      })
      .catch((err) => {
        console.log("error:", err);
      });
  };

  useEffect(() => {
    getCustomers();
  }, []);

  function ListItem({ index, name, id }) {
    return (
      <li className="list-item mb-1">
        <Row className="bg-secondary py-2 fs-5">
          <Col sm={1} className="text-end my-auto">
            <div className="">#{index}</div>
          </Col>
          <Col sm={7} className="my-auto">
            <div>{name}</div>
          </Col>
          <Col sm={4} className="text-end my-auto">
            <Button size="sm" className="" onClick={() => console.log(id)}>
              Edit
            </Button>
          </Col>
        </Row>
      </li>
    );
  }
  //if still waiting response from server then display spinner
  if (isLoading) {
    return <SpinnerComponent />;
  }

  return (
    <Container>
      <Row className="py-3 justify-content-between">
        <Col className="col-auto my-2">
          <div className="fw-light fs-4">List of all Customers</div>
        </Col>
        <Col className="col-auto my-2">
          <Row>
            <Col>
              <DropdownButton
                id="dropdown-basic-button"
                title={"Sort by"}
                size="sm"
                variant="success"
              >
                <Dropdown.Item
                  // active={numberOfSelectedDays == 7}
                  label="This Week"
                >
                  A-z
                </Dropdown.Item>
                <Dropdown.Item
                  // active={numberOfSelectedDays == 31}
                  label="This Month"
                >
                  z-A
                </Dropdown.Item>
              </DropdownButton>
            </Col>
            <Col>
              <ButtonGroup>
                <ul className="pagination my-auto">
                  <li className="page-item">
                    <a
                      key="nav-1"
                      className="page-link"
                      // onClick={handleClickPrevious}
                    >
                      <i className="fas fa-angle-left"></i>
                    </a>
                  </li>
                  <li className="page-item">
                    <a key="nav-3" className="page-link">
                      <i className="fas fa-angle-right"></i>
                    </a>
                  </li>
                </ul>
              </ButtonGroup>
            </Col>
          </Row>
        </Col>
      </Row>

      <ul className="list-inline">
        {customers.map(({ customer_id, customer_name }, index) => (
          <ListItem
            index={index + 1}
            key={customer_id}
            name={customer_name}
            id={customer_id}
          />
        ))}
      </ul>
    </Container>
  );
};

export default Customers;
