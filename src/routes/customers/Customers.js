import {
  Container,
  Row,
  Col,
  ButtonGroup,
  DropdownButton,
  Dropdown,
  Button,
  Table,
  Image,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import apiClient from "../../service/api/api";
import "./Customers.css";

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
      <tr>
        <td>
          <Row className="my-2">
            <Col sm="auto" className="ms-3">
              <div className="numberCircle fs-5 text-pink text-uppercase">
                {name.match(/\b(\w)/g).join("").substring(0, 2)}</div>
            </Col>
            <Col className="my-auto">
              <div className="text-start mx-1">{name}</div>
            </Col>
          </Row>
        </td>
        <td><div className="fw-light">
          01179 162 240
            </div>
        </td>
        <td><div className="fs-4 fw-normal text-success">{index}</div></td>
        <td>
          <div className="fw-light">
            <i className="fa fa-circle fa-sm me-2 text-success" aria-hidden="true"></i>
                Active
              </div>
        </td>
        <td>
          <Dropdown>
            <Dropdown.Toggle className="dropdown-nodeco" variant="none" id="dropdown-basic">
              <i className="fa fa-ellipsis-v fa-1 text-pink"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Edit</Dropdown.Item>
              <Dropdown.Item href="#/action-2" className="text-danger">Remove</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>

      </tr>
    );
  }
  //if still waiting response from server then display spinner
  if (isLoading) {
    return <SpinnerComponent />;
  }

  return (
    <div className="scroll">

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

        <Table className="cutomers-table" responsive="sm" striped hover variant="dark">
          <thead>
            <tr>
              <th>
                <div className="ms-3">Customer</div>
              </th>
              <th>Contact no</th>
              <th>Assets</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customers.map(({ customer_id, customer_name }, index) => (
              <ListItem
                index={index + 1}
                key={customer_id}
                name={customer_name}
                id={customer_id}
              />
            ))}
          </tbody>
        </Table>

      </Container>
    </div>
  );
};

export default Customers;
