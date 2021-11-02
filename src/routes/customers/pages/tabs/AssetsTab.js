import { Link } from "react-router-dom";
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

const AssetsTab = ({ setIsLoading, id, toast }) => {
  const [assets, setAssets] = useState([]);

  const columns = useMemo(
    () => [
      {
        Header: "Reg",
        accessor: "reg", // accessor is the "key" in the data
        Cell: ({ value, id, uuid }) => {
          return (
            <Row className="my-1">
              <Col className="my-auto text-center text-uppercase">
                <Button
                  variant="link"
                  className="p-0 text-white text-decoration-none"
                  as={Link}
                  to={"/assets/" + uuid}
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
        Cell: ({ value, reg, index }) => {
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
                  onClick={() => alert("Do you really want to remove it??")}
                  //   onClick={() => {
                  //     setRemoveAll(false);
                  //     let data = {
                  //       reg: reg,
                  //       id: value,
                  //       index: index,
                  //     };
                  //     setModaldata(data);
                  //     setShowModal(true);
                  //   }}
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
    useTable(
      { columns, data: assets },
      useGlobalFilter,
      useSortBy,
      usePagination
    );

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const result = await apiClient.get("/api/v1/customer_assets/" + id);
        setAssets(result.data);
        console.log("HELLO!");
        
        console.log(result.data);
        
      } catch (error) {
        toast.error(error.data.message);
      }
    };

    fetchAssets();
  }, []);

  return (
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
                      <i className="fa fa-angle-up ms-1" aria-hidden="true"></i>
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
                      uuid: row.original.uuid,
                    })}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default AssetsTab;
