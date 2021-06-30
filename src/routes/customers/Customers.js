import {
  Container,
  Row,
  Col,
  ButtonGroup,
  DropdownButton,
  Dropdown,
  Button,
  Table,
  Form,
  Image,
  Nav,
} from "react-bootstrap";
import { useState, useEffect, useMemo } from "react";
import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import apiClient from "../../service/api/api";
import "./Customers.css";
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import { Link } from "react-router-dom";

const Customers = ({ setLoggedIn, setLoginErrorMsg }) => {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setLoggedIn
  );

  const [data, setData] = useState([]);


  useEffect(() => {
    let url = "/api/v1/customer";
    apiClient
      .get(url)
      .then((response) => {
        console.log(response.data.data);
        setData(response.data.data);
      })
      .catch((err) => {
        console.log("error:", err);
      });

  }, []);


  const columns = useMemo(
    () => [
      {
        Header: 'Customer',
        accessor: 'customer_name', // accessor is the "key" in the data
        Cell: ({ value, id }) => {
          return (
            <Row className="my-2">
              <Col sm="auto" className="ms-4 text-end">
                <div className="numberCircle fs-5 text-pink text-uppercase">
                  {value.match(/\b(\w)/g).join("").substring(0, 2)}</div>
              </Col>
              <Col className="my-auto text-start">
                <Button variant="link" className="p-0 text-start text-white text-decoration-none" as={Link} to={"/customers/" + id}>{value}</Button>
              </Col>
            </Row>
          )
        }
      },
      {
        Header: 'Contact no',
        accessor: 'customer_contact',
        Cell: ({ value }) => {
          return (
            <Nav.Link className="text-white fw-light" onClick={() => window.open('tel:' + value, '_self')} >{value}</Nav.Link>
          )
        }
      },
      {
        Header: 'Assets',
        accessor: 'assets_total',
        Cell: ({ value }) => {
          return (
            <div className="fs-4 fw-normal text-success text-center">{value}</div>
          )
        }
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          return (
            <div className="fw-light text-capitalize">
              <i className={"fa fa-circle fa-xs me-2 " + (value === 'active' ? 'text-success' : "text-info")} aria-hidden="true"></i>
              {value}
            </div>
          )
        }
      },
      {
        Header: '',
        accessor: 'id',
        Cell: ({ value }) => {
          return (
            <Dropdown>
              <Dropdown.Toggle className="dropdown-nodeco" variant="none" id="dropdown-basic">
                <i className="fa fa-ellipsis-v fa-1 text-white"></i>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Edit {value}</Dropdown.Item>
                <Dropdown.Item href="#/action-2" className="text-danger">Remove</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )
        }
      },
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy)

  const { globalFilter } = state;

  // useEffect(() => {
  //   getCustomers();
  // }, []);


  //if still waiting response from server then display spinner
  if (isLoading) {
    return <SpinnerComponent />;
  }

  return (
    <div className="scroll">

      <Container>
        <Row className="py-3 justify-content-between">
          <Col className="col-auto my-2">
          </Col>
          <Col className="col-auto my-2">
            <Row>
              <Col>
                <DropdownButton
                  id="dropdown-basic-button"
                  title={"Sort by"}
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
              <Col>
                <Form.Control type="text" placeholder="Search" value={globalFilter || ""}
                  onChange={(e) => setGlobalFilter(e.target.value)} />
              </Col>
            </Row>
          </Col>
        </Row>
        <>
          <Table className="cutomers-table text-center" responsive="sm" striped hover variant="dark"
            {...getTableProps()} >
            <thead className="ms-4">
              {headerGroups.map(headerGroup => (
                <tr  {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render('Header')}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? <i className="fa fa-angle-down ms-1" aria-hidden="true"></i>
                            : <i className="fa fa-angle-up ms-1" aria-hidden="true"></i>
                          : ''}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      // console.log(row.original.uuid);
                      return (
                        <td
                          {...cell.getCellProps()}
                        >
                          {cell.render('Cell', { id: row.original.id, value: cell.value })}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </>

      </Container>
    </div>
  );
};

export default Customers;
