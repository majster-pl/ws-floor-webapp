import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Container,
  Form,
  FormControl,
} from "react-bootstrap";
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
  const [searchQuery, setSearchQuery] = useState("");

  ondragend = (result) => {
    const { destination, source, draggableId } = result;
    // console.log(result);

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

    let url = "/api/v1/workshop/" + draggableId.slice(6);

    let values = {
      status: destination.droppableId,
      order: data["columns"][destination.droppableId]["taskIds"],
    };

    const updateState = () => {
      data["columns"][source.droppableId]["taskIds"].splice(source.index, 1);
      data["columns"][destination.droppableId]["taskIds"].splice(
        destination.index,
        0,
        parseFloat(draggableId.slice(6))
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
        console.log("order changed to: " + response.data.order);
        toast.success("Changes saved", {
          autoClose: 1500,
          hideProgressBar: true,
          position: "bottom-right",
        });
        // updateOrder(destination.droppableId);
        // loadWorkshopData();
        console.log(response.data);
      })
      .catch((err) => {
        console.log("error:", err);
        toast.error(
          <div>
            <p>Error! Changes not saved</p>
            <p>{err.statusText}</p>
          </div>,
          { autoClose: 1500 }
        );
        loadWorkshopData();
      });
  };

  const loadWorkshopData = () => {
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
    loadWorkshopData();
  }, []);

  // useEffect(() => {
  //   if (typeof data["columns"] !== "undefined") {
  //     console.log(data["columns"]["awaiting_workshop"]["taskIds"]);
  //   }
  // }, [data]);

  return data.length !== 0 && !loadingError ? (
    <DragDropContext onDragEnd={ondragend}>
      <Row className="justify-content-end">
        <Col className="col-auto m-2" style={{ width: "15rem" }}>
          <Form className="d-flex">
            <FormControl
              size="sm"
              type="search"
              placeholder="Search"
              className="mr-2"
              aria-label="Search"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form>
        </Col>
      </Row>
      <div className="scroll" style={{ height: "calc(100vh - 6.2rem)" }}>
        <Row
          className="p-0 m-0 row-cols-sm-2 row-cols-md-4 row-cols-xl-5 row-cols-xxl-5 h-100"
          // style={{ minWidth: "1248px" }}
        >
          {data.length !== 0 && !loadingError ? (
            data.columnOrder.map((columnId) => {
              const column = data.columns[columnId];
              const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

              // return <Column key={column.id} column={column} tasks={tasks} />;
              return (
                <Col className="p-1 h-50 workshop-col-main">
                  <Column
                    key={column.id}
                    column={column}
                    tasks={tasks}
                    searchQuery={searchQuery}
                  />
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
          <Button variant="info" onClick={() => loadWorkshopData()}>
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
