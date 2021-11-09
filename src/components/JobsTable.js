import { Link } from "react-router-dom";
import { useMemo } from "react";
import { Row, Col, Dropdown } from "react-bootstrap";
import moment from "moment";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

const JobsTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Booked Date",
        accessor: "booked_date_time",
        Cell: ({ value }) => {
          return (
            <div className="text-white fw-light text-capitalize">
              {moment(value).format("DD-MM-YYYY")}
            </div>
          );
        },
      },
      {
        Header: "Reg",
        accessor: "reg", // accessor is the "key" in the data
        Cell: ({ value, deleted }) => {
          return (
            <Row className="my-1">
              <Col className="my-auto text-uppercase">
                <div className="fw-light text-capitalize text-white">
                  {value}
                </div>
              </Col>
            </Row>
          );
        },
      },

      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value, deleted }) => {
          return (
            <div className="fw-light text-capitalize text-white text-start">
              {value.slice(0, 50)}...
            </div>
          );
        },
      },
      {
        Header: "Branch",
        accessor: "owning_branch",
        Cell: ({ value, deleted }) => {
          return (
            <div className="fw-light text-capitalize text-white">{value}</div>
          );
        },
      },
      {
        Header: "Last Update",
        accessor: "updated_at",
        Cell: ({ value }) => {
          let current = moment().startOf("day");
          let given = moment(value, "YYYY-MM-DD");
          return (
            <div
              className="text-white fw-light text-capitalize"
              title={moment(value).format("DD-MM-YYYY HH:mm:ss")}
            >
              {Math.abs(
                Math.round(moment.duration(given.diff(current)).asDays())
              )}{" "}
              days
            </div>
          );
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value, deleted }) => {
          return (
            <div className="fw-light text-capitalize text-white">
              {deleted ? <span className="text-danger">Deleted</span> : value.replaceAll("_", " ")}
            </div>
          );
        },
      },
      {
        Header: "",
        accessor: "uuid",
        Cell: ({ value, deleted }) => {
          return (
            <Dropdown className="">
              <Dropdown.Toggle
                className="dropdown-nodeco p-0 "
                variant="none"
                id="dropdown-basic"
              >
                <i className="fa fa-ellipsis-v fa-1 text-info px-3 stretched-link"></i>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {!deleted ? (
                  <>
                    <Dropdown.Item
                      as={Link}
                      disabled={deleted}
                      to={"/booking/" + value}
                    >
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item
                      disabled={deleted}
                      onClick={() => alert("Not implemented yet!")}
                      //   onClick={() => {
                      //     console.log(reg);
                      //     console.log(id);
                      //     let data = {
                      //       reg: reg,
                      //       id: value,
                      //       index: index,
                      //     };
                      //   }}
                      className="text-danger"
                    >
                      Remove
                    </Dropdown.Item>
                  </>
                ) : (
                  <Dropdown.Item
                    as={Link}
                    to={"/removed_booking/" + value}
                  >
                    View
                  </Dropdown.Item>
                )}
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

  return (
    <>
      <Table className="cutomers-table text-center table" {...getTableProps()}>
        <thead className="ms-4 text-white">
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
                </Th>
              ))}
            </Tr>
          ))}
        </thead>
        <Thead className="d-block d-sm-none">
          <Tr>
            <Th>Booked Date</Th>
            <Th>Reg</Th>
            <Th>Description</Th>
            <Th>Branch</Th>
            <Th>Last update</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <Tr
                className={`border trCustom ${
                  index % 2 === 0 ? "tr-dark" : "tr-light"
                } ${row.original.deleted ? "tr-deleted" : ""}`}
                key={"asset-row-" + row.id}
                {...row.getRowProps()}
              >
                {row.cells.map((cell) => {
                  // console.log(row.original.uuid);
                  return (
                    <Td {...cell.getCellProps()}>
                      {cell.render("Cell", {
                        id: row.original.id,
                        index: row.id,
                        value: cell.value,
                        reg: row.original.reg,
                        deleted: row.original.deleted,
                      })}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </>
  );
};

export default JobsTable;
