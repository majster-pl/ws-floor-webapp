import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { Card } from "react-bootstrap";
import Task from "./Task";

const Column = ({ column, tasks }) => {
  function TaskTitle({ title }) {
    return (
      <Card.Header className="bg-secondary">
        <Card.Title className="m-0">{title}</Card.Title>
      </Card.Header>
    );
  }

  return (
    <div>
      <TaskTitle title={column.title} />
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            className="bg-light py-1"
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
      <Card.Footer className="bg-light">Total: 20</Card.Footer>
    </div>
  );
};

export default Column;
