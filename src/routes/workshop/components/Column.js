import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { Card, Row, Col } from "react-bootstrap";
import Task from "./Task";

const Column = ({ column, tasks, searchQuery }) => {
  function TaskTitle({ title }) {
    return (
      <Card.Header className="bg-secondary workshop-col-header">
        <Card.Title className="">
          <h5 className="text-info text-uppercase text-truncate fw-bold">
            {title}
          </h5>
        </Card.Title>
      </Card.Header>
    );
  }

  let sum = 0;
  tasks.forEach((element) => {
    sum += element.allowed_time;
  });

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
              <Task
                key={task.id}
                task={task}
                index={index}
                options={column.options}
                searchQuery={searchQuery}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Card.Footer className="bg-secondary text-pink workshop-col-footer h4 m-0 py-0">
        <Row>
          <Col className="col-12 h5 m-0 mt-1 ps-1">
            Jobsd: {Object.keys(tasks).length}
          </Col>
          <Col className="col-12 m-0 text-lime h5 ps-1">Hours: {sum}h</Col>
        </Row>
      </Card.Footer>
    </div>
  );
};

export default Column;
