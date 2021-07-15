import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import initialData from "./initialData";
import Column from "./components/Column";
import { DragDropContext } from "react-beautiful-dnd";

const Workshop = ({ setIsLoading, setLoggedIn, setLoginErrorMsg, toast }) => {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setIsLoading,
    setLoggedIn
  );

  const [data, setData] = useState(initialData);

  ondragend = (result) => {
    console.log(result);
  };

  return (
    <DragDropContext onDragEnd={ondragend}>
      <div className="scroll">
        <Row className="p-0 m-0 row-cols-4" style={{ minWidth: "1248px" }}>
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

            // return <Column key={column.id} column={column} tasks={tasks} />;
            return (
              <Col className="p-1">
                <Column key={column.id} column={column} tasks={tasks} />
              </Col>
              // <Col className="bg-info">Waiting Labour</Col>
              // <Col className="bg-pink">Ready for MOT</Col>
              // <Col className="bg-danger">SHIFT AM</Col>
              // <Col className="bg-primary">SHIFT PM</Col>
            );
          })}
        </Row>
      </div>
    </DragDropContext>
  );
};

export default Workshop;
