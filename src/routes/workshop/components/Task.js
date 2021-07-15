import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Card } from "react-bootstrap";

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
          <Card.Body>{task.content}</Card.Body>
        </Card>
      )}
    </Draggable>
  );
};

export default Task;
