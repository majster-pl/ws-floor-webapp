import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import initialData from "./initialData";
import Column from "./components/Column";
import { DragDropContext } from "react-beautiful-dnd";
import apiClient from "../../service/api/api";
import "./Workshop.css";

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

  const getWorkshop = () => {
    let url = "/api/v1/workshop";
    // setIsLoading(true);
    apiClient
      .get(url)
      .then((response) => {
        // setIsLoading(false);
        console.log(response.data.data);
        setData(response.data.data);

        // setData(response.data.data);
      })
      .catch((err) => {
        // setIsLoading(false);
        // setErrorMsg("I was unable to load assets :-(");
        // toast.error(
        //   <div className="toast_wrap">
        //     Error while loading assets. {JSON.stringify(err.data.message)}
        //   </div>
        // );
        console.log(err.data);
      });
  };

  useEffect(() => {
    getWorkshop();
    console.log(initialData);
  }, []);

  return (
    <DragDropContext onDragEnd={ondragend}>
      <div className="scroll">
        <Row
          className="p-0 m-0 row-cols-sm-2 row-cols-md-4 row-cols-xl-5 row-cols-xxl-6 h-100"
          // style={{ minWidth: "1248px" }}
        >
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

            // return <Column key={column.id} column={column} tasks={tasks} />;
            return (
              <Col className="p-1 h-50 workshop-col-main">
                <Column key={column.id} column={column} tasks={tasks} />
              </Col>
            );
          })}
        </Row>
      </div>
    </DragDropContext>
  );
};

export default Workshop;
