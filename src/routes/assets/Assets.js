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
} from "react-bootstrap";
import { useState, useEffect, useMemo } from "react";
import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import apiClient from "../../service/api/api";
// import "./Customers.css";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { Link } from "react-router-dom";

const Assets = ({ setIsLoading, setLoggedIn, setLoginErrorMsg, toast }) => {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setIsLoading,
    setLoggedIn
  );

  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModaldata] = useState({
    reg: "",
    id: 0,
  });
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const [removeAll, setRemoveAll] = useState(false);

  const reloadTable = () => {
    let url = "/api/v1/assets";
    setIsLoading(true);
    apiClient
      .get(url)
      .then((response) => {
        // console.log(response);
        setIsLoading(false);

        setData(response.data.data);
        console.log(response.data.data);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("error:", err);
      });
  };
  useEffect(() => reloadTable(), []);

  // function to remove customer
  const removeCustomer = () => {
    let url = "/api/v1/assets/" + modalData.id;

    apiClient
      .delete(url)
      .then((response) => {
        console.log(response);
        toast.success("Asset removed.");
        reloadTable();
        setShowModal(false);
      })
      .catch((err) => {
        console.log(JSON.stringify(err));

        toast.error(
          <div className="toast_wrap">
            Unable to remove asset! {JSON.stringify(err.data.message)}
          </div>
        );
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Reg",
        accessor: "reg", // accessor is the "key" in the data
        Cell: ({ value, id, make }) => {
          return (
            <Row className="my-2">
              {/* <Col sm="auto" className="ms-4 text-end d-none d-md-block">
                <div className="numberCircle fs-5 text-pink text-uppercase">
                  {make
                    .match(/\b(\w)/g)
                    .join("")
                    .substring(0, 2)}
                </div>
              </Col> */}
              <Col className="my-auto text-center text-uppercase">
                <Button
                  variant="link"
                  className="p-0 text-white text-decoration-none"
                  as={Link}
                  to={"/assets/" + id}
                  onClick={() => setIsLoading(true)}
                >
                  {value}
                </Button>
              </Col>
            </Row>
          );
        },
      },
      {
        Header: "Make",
        accessor: "make",
        Cell: ({ value }) => {
          return (
            <span className="text-white fw-light text-capitalize">{value}</span>
          );
        },
      },
      {
        Header: "Model",
        accessor: "model",
        Cell: ({ value }) => {
          return (
            <span className="text-white fw-light text-capitalize">{value}</span>
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
                  (value === "active"
                    ? "text-success"
                    : value == "key_fleet"
                    ? "text-pink"
                    : "text-info")
                }
                aria-hidden="true"
              ></i>
              {value.replace("_", " ")}
            </div>
          );
        },
      },
      {
        Header: "",
        accessor: "id",
        Cell: ({ value, reg }) => {
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
                <Dropdown.Item as={Link} to={"/assets/" + value}>
                  Edit
                </Dropdown.Item>
                <Dropdown.Item
                  // onClick={() => alert("Do you really want to remove it??")}
                  onClick={() => {
                    setRemoveAll(false);
                    let data = {
                      reg: reg,
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
  // if (isLoading) {
  //   return <SpinnerComponent />;
  // }

  // console.log("state.pageSize:" + JSON.stringify(page));

  return (
    <div className="scroll">
      <Container>
        <Row className="py-3 justify-content-between">
          <Col className="col-12 col-md-6 col-auto my-0">
            <Row className="mb-2">
              <Col className="col-4 col-md-auto my-auto">
                <Button variant="success" as={Link} to={"/assets/new"}>
                  Add new
                </Button>
              </Col>
              <Col className="col-8 col-md-auto my-auto">
                <div className="text-end">
                  <Pagination className="my-auto float-end">
                    {pageCount > 4 ? (
                      <Pagination.First
                        onClick={() => gotoPage(0)}
                        key="pag2-first"
                      />
                    ) : (
                      ""
                    )}
                    <Pagination.Prev
                      key="pag2-prev"
                      onClick={() => previousPage()}
                      disabled={!canPreviousPage}
                    />

                    {pageOptions.map((val) =>
                      val + 3 > state.pageIndex && val - 3 < state.pageIndex ? (
                        <Pagination.Item
                          key={"pag2-item-" + val}
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
                      key="pag2-next"
                      onClick={() => nextPage()}
                      disabled={!canNextPage}
                    />
                    {pageCount > 4 ? (
                      <Pagination.Last
                        key="pag2-last"
                        onClick={() => gotoPage(pageCount - 1)}
                      />
                    ) : (
                      ""
                    )}
                  </Pagination>
                </div>
              </Col>
            </Row>
          </Col>
          <Col className="col-md-3 my-md-2 my-auto ">
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
                            reg: row.original.reg,
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
            Removeing asset also erase all bookings and any data assosiated with
            this asset! Are you sure you want to remove{" "}
            <span className="text-success"> {modalData.reg}</span> ?
          </p>
          <Form.Group className="mt-4" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              onChange={(event) => {
                console.log(modalData);
                setRemoveAll(event.target.checked);
              }}
              label="Yes, I want to remove it all"
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

export default Assets;
