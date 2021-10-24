import { Link } from "react-router-dom";
import React from "react";
import { useState, useEffect, useMemo } from "react";
import { Row, Col, Button, Dropdown, Table } from "react-bootstrap";
import apiClient from "../../../../service/api/api";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import moment from "moment";
import { useDispatch } from "react-redux";
// add relevent action
import { setBookingsCount } from "../../../../actions";

export const BookingsTab = ({ id, toast }) => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  const columns = useMemo(
    () => [
      {
        Header: "Booked Date",
        accessor: "booked_date_time",
        Cell: ({ value }) => {
          return (
            <span className="text-white fw-light text-capitalize">
              {moment(value).format("DD-MM-YYYY")}
            </span>
          );
        },
      },
      {
        Header: "Reg",
        accessor: "reg", // accessor is the "key" in the data
        Cell: ({ value, id }) => {
          return (
            <Row className="my-2">
              <Col className="my-auto text-center text-uppercase">
                <Button
                  variant="link"
                  className="p-0 text-white text-decoration-none"
                  as={Link}
                  to={"/booking/" + id}
                  // onClick={() => setIsLoading(true)}
                >
                  {value}
                </Button>
              </Col>
            </Row>
          );
        },
      },

      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value }) => {
          return (
            <span className="text-white fw-light text-capitalize">
              {value.slice(0, 50)}...
            </span>
          );
        },
      },
      {
        Header: "Branch",
        accessor: "owning_branch",
        Cell: ({ value }) => {
          return (
            <span className="text-white fw-light text-capitalize">{value}</span>
          );
        },
      },
      {
        Header: "Last Update in Days",
        accessor: "updated_at",
        Cell: ({ value }) => {
          let current = moment().startOf("day");
          let given = moment(value, "YYYY-MM-DD");
          return (
            <span
              className="text-white fw-light text-capitalize"
              title={moment(value).format("DD-MM-YYYY HH:mm:ss")}
            >
              {Math.abs(moment.duration(given.diff(current)).asDays())} days
            </span>
          );
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => {
          return (
            <div className="fw-light text-capitalize">
              {value.replaceAll("_", " ")}
            </div>
          );
        },
      },
      {
        Header: "",
        accessor: "id",
        Cell: ({ value, reg, index, id }) => {
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
                <Dropdown.Item as={Link} to={"/booking/" + value}>
                  Edit
                </Dropdown.Item>
                <Dropdown.Item
                  // onClick={() => alert("Do you really want to remove it??")}
                  onClick={() => {
                    console.log(reg);
                    console.log(id);

                    //   setRemoveAll(false);
                    let data = {
                      reg: reg,
                      id: value,
                      index: index,
                    };
                    //   setModaldata(data);
                    //   setShowModal(true);
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
  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    useTable({ columns, data }, useGlobalFilter, useSortBy, usePagination);

  useEffect(() => {
    dispatch(setBookingsCount(0));
    const fetchEvents = async () => {
      try {
        const result = await apiClient.get("/api/v1/customer_bookings/" + id);
        console.log("result");
        console.log(result);
        setData(result.data.data);
        dispatch(setBookingsCount(Object.keys(result.data.data).length));
      } catch (error) {
        toast.error(error);
      }
    };
    fetchEvents();
  }, []);
  return (
    <div>
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
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
              <tr key={"asset-row-" + row.id} {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  // console.log(row.original.uuid);
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.render("Cell", {
                        id: row.original.id,
                        index: row.id,
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
    </div>
  );
};

export default BookingsTab;
