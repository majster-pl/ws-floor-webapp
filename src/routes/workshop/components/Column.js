import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { Card } from "react-bootstrap";
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
      <Card.Footer className="bg-secondary text-pink workshop-col-footer">
        Total: {Object.keys(tasks).length}
      </Card.Footer>
    </div>
  );
};

export default Column;
