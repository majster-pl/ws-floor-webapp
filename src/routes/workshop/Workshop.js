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
import { useHistory } from "react-router-dom";
import initialData from "./initialData";
import Column from "./components/Column";
import { DragDropContext } from "react-beautiful-dnd";
import apiClient from "../../service/api/api";
import "./Workshop.css";
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import { RootStateOrAny, useSelector } from "react-redux";
import { setModal } from "../../actions";
import { useDispatch } from "react-redux";

const Workshop = ({
  // isLoading,
  setIsLoading,
  setLoggedIn,
  setLoginErrorMsg,
  toast,
  reloadCalendar,
  siletReload,
  currentDate,
  handleShowMainModal,
}) => {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setIsLoading,
    setLoggedIn
  );
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loadingError, setLoadingError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const history = useHistory();
  // vaible to trigger silent calendar reload when changed
  const [triggerUpdate, setTriggerUpdate] = useState(0);
  const selectedDepot = useSelector((state: RootStateOrAny) => state.depot);
  const reloadWorkshop = useSelector((state) => state.workshop);

  let url = "/api/v1/workshop?depot=" + selectedDepot;

  const handleStatusChange = (event_id, status) => {
    dispatch(setModal("update"));
    handleShowMainModal(event_id, status);
  };

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
    handleStatusChange(draggableId.slice(6), destination.droppableId);

    // apiClient
    //   .patch(url, values)
    //   .then((response) => {
    //     console.log("order changed to: " + response.data.order);
    //     toast.success("Changes saved", {
    //       autoClose: 1500,
    //       hideProgressBar: true,
    //       position: "bottom-right",
    //     });
    //     reloadCalendar();
    //     // updateOrder(destination.droppableId);
    //     // loadWorkshopData();
    //     // console.log(response.data);
    //   })
    //   .catch((err) => {
    //     console.log("error:", err);
    //     if (err.status !== 401) {
    //       toast.error(
    //         <div>
    //           <p>Error! Changes not saved</p>
    //           <p>{err.statusText}</p>
    //         </div>,
    //         { autoClose: 1500 }
    //       );
    //     }
    //     loadWorkshopData();
    //   });
  };

  const loadWorkshopData = (feedback) => {
    feedback ? setIsLoading(true) : setIsLoading(false);
    setLoadingError(false);
    // let url = "/api/v1/workshop?depot=" + selectedDepot;

    // setTimeout(() => {
    apiClient
      .get(url)
      .then((response) => {
        setIsLoading(false);
        // console.log(response.data.data);
        setData(response.data.data);

        // setData(response.data.data);
      })
      .catch((err) => {
        setIsLoading(false);
        setLoadingError(true);
        // setErrorMsg("I was unable to load assets :-(");

        if (err.status == 401) {
          setLoginErrorMsg("You are not longer logged in");
          history.push("/login");
          toast.error(
            <div className="toast_wrap">
              Error while loading data.
              <p>{JSON.stringify(err.data.message)}</p>
            </div>
          );
        } else {
          toast.error(
            <div className="toast_wrap">
              Error while loading data.
              <p>{JSON.stringify(err)}</p>
            </div>
          );
        }
        console.log(err.data);
      });
    // }, 5000);
  };

  // run when component mounted, initial pusher to listen for any changes
  useEffect(() => {
    // Pusher.logToConsole = true;

    let echo = new Echo({
      broadcaster: "pusher",
      key: "7c76a1124748bac977da",
      cluster: "eu",
      forceTLS: true,
    });

    var channel = echo.channel("events");
    channel.listen(".events-updated", function (data) {
      console.log("events-updated type: " + JSON.stringify(data));
      setTriggerUpdate(Math.random());
    });
    loadWorkshopData(false);
  }, []);

  useEffect(() => {
    // siletReload(currentDate);
    loadWorkshopData();
  }, [triggerUpdate, selectedDepot, reloadWorkshop]);

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
          className="p-0 m-0 row-cols-sm-2 row-cols-md-4 row-cols-xl-6 row-cols-xxl-8 h-100"
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
                    handleShowMainModal={handleShowMainModal}
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
