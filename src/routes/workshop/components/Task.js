import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Card, Row, Col } from "react-bootstrap";

const Task = ({ task, index, options, searchQuery }) => {
  // search function
  function search(event) {
    console.log(searchQuery);
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

  // search(3);

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
          className={`m-1 disable-select  ${search(task) ? "d-none" : ""} `}
        >
          <Card.Body className="m-1 mx-2 p-0">
            <Row>
              <Col className="col-12 text-danger h4 fw-bold text-truncate-1">
                <span className="text-success">{task.reg}</span>
                <span className="text-white">{" - "}</span>{" "}
                <span className="">{task.customer_name}</span>
              </Col>
              <Col className="col-12 text-truncate-2 h5 fw-normal">
                {task.description}
              </Col>
              <Col className="col-12">
                <Row className="row-justify-end">
                  <Col className="col-3">
                    <h5>{task.allowed_time}h </h5>
                  </Col>
                  <Col className="col-9">
                    <h5>
                      <span className="fw-bold text-info">Others:</span>{" "}
                      {!task.others ? "n/a" : task.others}
                    </h5>
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
