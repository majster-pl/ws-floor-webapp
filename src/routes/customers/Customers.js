import {
  Container,
  Row,
  Col,
  Dropdown,
  Button,
  Table,
  Form,
  Pagination,
  Nav,
  Modal,
  CloseButton,
} from "react-bootstrap";
import { useState, useEffect, useMemo } from "react";
import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import apiClient from "../../service/api/api";
import "./Customers.css";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { Link } from "react-router-dom";

const Customers = ({ setLoggedIn, setLoginErrorMsg, toast }) => {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setLoggedIn
  );

  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModaldata] = useState({
    customer_name: "",
    id: 0,
  });
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const [removeAll, setRemoveAll] = useState(false);

  const reloadTable = () => {
    let url = "/api/v1/customer";
    apiClient
      .get(url)
      .then((response) => {
        // console.log(response);

        setData(response.data.data);
      })
      .catch((err) => {
        console.log("error:", err);
      });
  };
  useEffect(() => reloadTable(), []);

  // function to remove customer
  const removeCustomer = () => {
    let url = "/api/v1/customer/" + modalData.id;

    apiClient
      .delete(url)
      .then((response) => {
        console.log(response);
        toast.success("Customer removed.");
        reloadTable();
        setShowModal(false);
      })
      .catch((err) => {
        console.log(JSON.stringify(err));

        toast.error(
          <div className="toast_wrap">
            Unable to remove customer! {JSON.stringify(err.data.message)}
          </div>
        );
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Customer",
        accessor: "customer_name", // accessor is the "key" in the data
        Cell: ({ value, id }) => {
          return (
            <Row className="my-2">
              <Col sm="auto" className="ms-4 text-end d-none d-md-block">
                <div className="numberCircle fs-5 text-pink text-uppercase">
                  {value
                    .match(/\b(\w)/g)
                    .join("")
                    .substring(0, 2)}
                </div>
              </Col>
              <Col className="my-auto text-center text-md-start">
                <Button
                  variant="link"
                  className="p-0 text-white text-decoration-none"
                  as={Link}
                  to={"/customers/" + id}
                >
                  {value}
                </Button>
              </Col>
            </Row>
          );
        },
      },
      {
        Header: "Contact no",
        accessor: "customer_contact",
        Cell: ({ value }) => {
          return (
            <Nav.Link
              className="text-white fw-light"
              onClick={() => window.open("tel:" + value, "_self")}
            >
              {value}
            </Nav.Link>
          );
        },
      },
      {
        Header: "Assets",
        accessor: "assets_total",
        Cell: ({ value }) => {
          return (
            <div className="fs-4 fw-normal text-success text-center">
              {value}
            </div>
          );
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => {
          return (
            <div className="fw-light text-capitalize">
              <i
                className={
                  "fa fa-circle fa-xs me-2 " +
                  (value === "active" ? "text-success" : "text-info")
                }
                aria-hidden="true"
              ></i>
              {value}
            </div>
          );
        },
      },
      {
        Header: "",
        accessor: "id",
        Cell: ({ value, cust_name }) => {
          return (
            <Dropdown>
              <Dropdown.Toggle
                className="dropdown-nodeco"
                variant="none"
                id="dropdown-basic"
              >
                <i className="fa fa-ellipsis-v fa-1 text-white"></i>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={Link} to={"/customers/" + value}>
                  Edit {value}
                </Dropdown.Item>
                <Dropdown.Item
                  // onClick={() => alert("Do you really want to remove it??")}
                  onClick={() => {
                    setRemoveAll(false);
                    let data = {
                      customer_name: cust_name,
                      id: value,
                    };
                    setModaldata(data);
                    setShowModal(true);
                  }}
                  className="text-danger"
                >
                  Remove
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          );
        },
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    prepareRow,
    canNextPage,
    canPreviousPage,
    pageCount,
    gotoPage,
    pageOptions,
    state,
    setGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy, usePagination);

  const { globalFilter } = state;

  //if still waiting response from server then display spinner
  if (isLoading) {
    return <SpinnerComponent />;
  }

  // console.log("state.pageSize:" + JSON.stringify(page));

  return (
    <div className="scroll">
      <Container>
        <Row className="py-3 justify-content-between">
          <Col className="col-auto my-2">
            <Row>
              <Col className="my-auto mx-4">
                <Button variant="success" as={Link} to={"/customers/new"}>
                  Add new
                </Button>
              </Col>
              <Col className="col-auto my-auto">
                <Pagination className="my-auto">
                  {pageCount > 4 ? (
                    <Pagination.First onClick={() => gotoPage(0)} />
                  ) : (
                    ""
                  )}
                  <Pagination.Prev
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                  />

                  {pageOptions.map((val) =>
                    val + 3 > state.pageIndex && val - 3 < state.pageIndex ? (
                      <Pagination.Item
                        active={val + 1 == state.pageIndex + 1}
                        onClick={() => gotoPage(val)}
                      >
                        {val + 1}
                      </Pagination.Item>
                    ) : (
                      ""
                    )
                  )}
                  {state.pageIndex + 1 < pageCount && pageCount > 3 ? (
                    <Pagination.Ellipsis disabled />
                  ) : (
                    ""
                  )}
                  <Pagination.Next
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                  />
                  {pageCount > 4 ? (
                    <Pagination.Last onClick={() => gotoPage(pageCount - 1)} />
                  ) : (
                    ""
                  )}
                </Pagination>
              </Col>
            </Row>
          </Col>
          <Col className="col-md-3 my-auto">
            <Form.Control
              type="text"
              placeholder="Search"
              value={globalFilter || ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </Col>
        </Row>
        <>
          <Table
            className="cutomers-table text-center"
            responsive="sm"
            striped
            hover
            variant="dark"
            {...getTableProps()}
          >
            <thead className="ms-4">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <i
                              className="fa fa-angle-down ms-1"
                              aria-hidden="true"
                            ></i>
                          ) : (
                            <i
                              className="fa fa-angle-up ms-1"
                              aria-hidden="true"
                            ></i>
                          )
                        ) : (
                          ""
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      // console.log(row.original.uuid);
                      return (
                        <td {...cell.getCellProps()}>
                          {cell.render("Cell", {
                            id: row.original.id,
                            value: cell.value,
                            cust_name: row.original.customer_name,
                          })}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      </Container>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header>
          <Modal.Title className="text-danger">Warning!</Modal.Title>
          <Button
            className="btn-close btn-secondary"
            type="button"
            onClick={() => handleCloseModal()}
          />
        </Modal.Header>
        <Modal.Body>
          <p className="">
            Removeing customer also erase all bookings and any data assosiated
            with this customer! Are you sure you want to remove{" "}
            <span className="text-success"> {modalData.customer_name}</span> ?
          </p>
          <Form.Group className="mt-4" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              onChange={(event) => {
                console.log(modalData);
                setRemoveAll(event.target.checked);
              }}
              label="I want to remove all"
              className="disable-select"
            />
            <Form.Text
              className={"text-danger " + (!removeAll ? "d-none" : "")}
            >
              <div className="text-uppercase">
                This operation can't be undone!
              </div>
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button
            variant="danger"
            disabled={!removeAll}
            onClick={() => removeCustomer()}
          >
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Customers;
