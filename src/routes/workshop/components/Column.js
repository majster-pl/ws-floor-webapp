import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { Card, Row, Col } from "react-bootstrap";
import Task from "./Task";

const Column = ({ column, tasks }) => {
  function TaskTitle({ title }) {
    return (
      <Card.Header className="bg-secondary workshop-col-header text-truncate">
        <Card.Title className="m-0">
          <p className="lead text-lime">{title}</p>
        </Card.Title>
      </Card.Header>
    );
  }

  return (
    <div className="h-100 ">
      <TaskTitle title={column.title} />
      <Droppable droppableId={column.id} className="">
        {(provided) => (
          <div
            className="bg-light py-1 workshop-col-content"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Card.Footer className="bg-secondary text-pink workshop-col-footer h4 m-0 py-0">
        <Row>
          <Col className="col-12 h5 m-0">
            Total: {Object.keys(tasks).length}
          </Col>
          <Col className="col-12 m-0 text-lime h5">
            Hours: {Object.keys(tasks).length}
          </Col>
        </Row>
      </Card.Footer>
    </div>
  );
};

export default Column;
