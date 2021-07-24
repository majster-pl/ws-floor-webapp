import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import initialData from "./initialData";
import Column from "./components/Column";
import { DragDropContext } from "react-beautiful-dnd";
import apiClient from "../../service/api/api";
import "./Workshop.css";

const Workshop = ({
  // isLoading,
  setIsLoading,
  setLoggedIn,
  setLoginErrorMsg,
  toast,
}) => {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setIsLoading,
    setLoggedIn
  );

  const [data, setData] = useState([]);
  const [loadingError, setLoadingError] = useState(false);

  ondragend = (result) => {
    const { destination, source, draggableId } = result;

    console.log(result);

    // exit if item dropped outside the column
    if (!destination) {
      return;
    }
    // exit if no changes made when dropped
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let url = "/api/v1/events/" + draggableId.slice(6);

    let values = {
      status: destination.droppableId,
      order: destination.index - 0.1,
    };

    const updateState = () => {
      data["columns"][source.droppableId]["taskIds"].splice(source.index, 1);
      data["columns"][destination.droppableId]["taskIds"].splice(
        destination.index,
        0,
        draggableId.slice(6)
      );
      const column = data["columns"][source.droppableId];
      const newTaskId = Array.from(column.taskIds);

      const newColumn = {
        ...column,
        taksIds: newTaskId,
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };
      setData(newState);
    };

    // for better user expirience update data before sending request to API
    updateState();

    apiClient
      .patch(url, values)
      .then((response) => {
        console.log(response.data);
        toast.success("Changes saved");
      })
      .catch((err) => {
        console.log("error:", err);
        toast.error(err.statusText + " - Changes not saved!");
      });
  };

  const getWorkshopData = () => {
    setIsLoading(true);
    setLoadingError(false);
    let url = "/api/v1/workshop";

    // setTimeout(() => {
    apiClient
      .get(url)
      .then((response) => {
        setIsLoading(false);
        console.log(response.data.data);
        setData(response.data.data);

        // setData(response.data.data);
      })
      .catch((err) => {
        setIsLoading(false);
        setLoadingError(true);
        // setErrorMsg("I was unable to load assets :-(");
        toast.error(
          <div className="toast_wrap">
            Error while loading data.
            <p>{JSON.stringify(err)}</p>
          </div>
        );
        console.log(err.data);
      });
    // }, 5000);
  };

  useEffect(() => {
    getWorkshopData();
  }, []);

  return data.length !== 0 && !loadingError ? (
    <DragDropContext onDragEnd={ondragend}>
      <div className="scroll">
        <Row
          className="p-0 m-0 row-cols-sm-2 row-cols-md-4 row-cols-xl-5 row-cols-xxl-6 h-100"
          // style={{ minWidth: "1248px" }}
        >
          {data.length !== 0 && !loadingError ? (
            data.columnOrder.map((columnId) => {
              const column = data.columns[columnId];
              const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

              // return <Column key={column.id} column={column} tasks={tasks} />;
              return (
                <Col className="p-1 h-50 workshop-col-main">
                  <Column key={column.id} column={column} tasks={tasks} />
                </Col>
              );
            })
          ) : (
            <></>
          )}
        </Row>
      </div>
    </DragDropContext>
  ) : loadingError ? (
    <div className="div-center">
      <Row className="row-cols-12 text-center">
        <Col>
          <div className="my-4">
            An unknown error occured while loading the data... :-(
          </div>
          <Button variant="info" onClick={() => getWorkshopData()}>
            Reload
          </Button>
        </Col>
      </Row>
    </div>
  ) : (
    <></>
  );
};

export default Workshop;
