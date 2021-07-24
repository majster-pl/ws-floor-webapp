import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Card, Row, Col } from "react-bootstrap";

const Task = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Card
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="m-1"
        >
          <Card.Body className="m-1 mx-2 p-0">
            <Row>
              <Col className="col-12 text-info h4 fw-bold text-truncate-1">
                <span className="text-success">{task.reg}</span>
                <span className="text-white">{" - "}</span>{" "}
                <span className="text-info">{task.customer_name}</span>
              </Col>
              <Col className="col-12 text-truncate-2 h5 fw-normal">
                {task.description}
              </Col>
              <Col className="col-12">
                <h5>{task.allowed_time}h</h5>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Draggable>
  );
};

export default Task;
