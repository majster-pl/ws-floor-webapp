import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Card, Row, Col } from "react-bootstrap";
import moment from "moment";

const Task = ({ task, index, options, searchQuery }) => {
  var today = moment(Date()).format("YYYY-MM-DD");
  // search function
  function search(event) {
    // console.log(searchQuery);
    if (searchQuery.length > 0) {
      var val = Object.values(event);
      var valid = true;
      for (const key of val) {
        if (key !== null) {
          if (
            key
              .toString()
              .toLocaleLowerCase()
              .indexOf(searchQuery.toString().toLocaleLowerCase()) > -1
          ) {
            valid = false;
          }
        }
      }
      return valid;
    }
  }

  return (
    <Draggable
      draggableId={task.id}
      index={index}
      isDragDisabled={options === "read-only"}
    >
      {(provided) => (
        <Card
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`m-1 disable-select  ${search(task) ? "d-none" : ""} ${
            task.booked_date_time < today && task.status === "booked"
              ? "bg-darker text-light"
              : ""
          }`}
        >
          <Card.Body className="m-1 mx-2 p-0">
            <Row>
              <Col className="col-12 text-light h5 fw-bold text-truncate-1 mb-0">
                {task.breakdown === 1 ? (
                  <i className="me-2 text-danger fas fa-car-crash text-end"></i>
                ) : (
                  <div></div>
                )}
                <span className="text-success">{task.reg}</span>
                <span className="text-white">{" - "}</span>{" "}
                <span className="">{task.customer_name}</span>
              </Col>
              <Col className="col-12 text-truncate-2 h5 fw-normal mb-1">
                {task.description}
              </Col>
              <Col className="col-12 text-truncate-2 h6 fw-normal fst-italic text-lime m-0">
                {task.special_instructions &&
                  "Extra: " + task.special_instructions}
              </Col>
              <Col
                className={`col-12 text-truncate-2 h6 mb-1 fw-normal ${
                  task.status === "booked" ? "d-none" : ""
                }  `}
              >
                Age:{" "}
                <label
                  className={`${task.age > 2 ? "text-danger fw-bold" : ""}`}
                >
                  {task.age} day{`${task.age <= 1 ? "" : "s"}`}
                </label>
              </Col>
              <Col
                className={`col-12 text-truncate-2 h6 fw-normal mb-1 ${
                  task.status !== "booked" ? "d-none" : ""
                }  `}
              >
                Booked:{" "}
                <label
                  className={`${
                    task.booked_date_time < today ? "text-danger fw-bold" : ""
                  }`}
                >
                  {moment(task.booked_date_time).format("DD-MM-YYYY")}
                </label>
              </Col>
              <Col className="col-12">
                <Row className="row-justify-end">
                  <Col className="col-5">
                    <h6 className="mb-0">
                      <span className="fw-bold text-info">Allowed:</span>{" "}
                      {task.allowed_time}h{" "}
                    </h6>
                  </Col>
                  <Col className="col-7">
                    <h6 className="mb-0">
                      <span className="fw-bold text-info">Others:</span>{" "}
                      {!task.others ? "n/a" : task.others}
                    </h6>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Draggable>
  );
};

export default Task;
