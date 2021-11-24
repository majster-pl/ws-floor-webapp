import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Card, Row, Col, Nav, Stack } from "react-bootstrap";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setModal } from "../../../actions";

const Task = ({ task, index, options, searchQuery, handleShowMainModal }) => {
  const dispatch = useDispatch();

  var today = moment(Date()).format("YYYY-MM-DD");
  // search function
  function search(event) {
    // console.log(searchQuery);
    if (searchQuery.length > 0) {
      var val = Object.values(event);
      var valid = true;
      for (const key of val) {
        if (key !== null) {
          if (
            key
              .toString()
              .toLocaleLowerCase()
              .indexOf(searchQuery.toString().toLocaleLowerCase()) > -1
          ) {
            valid = false;
          }
        }
      }
      return valid;
    }
  }
  const handleEditClick = (e, event_id, status) => {
    e.stopPropagation();
    dispatch(setModal("edit"));
    handleShowMainModal(event_id, status);
  };

  const handleInfoClick = (e, event_id, status) => {
    e.stopPropagation();
    dispatch(setModal("info"));
    handleShowMainModal(event_id, status);
  };

  const handleUpdateClick = (e, event_id, status) => {
    e.stopPropagation();
    dispatch(setModal("update"));
    handleShowMainModal(event_id, status);
  };

  return (
    <Draggable
      draggableId={task.id}
      index={index}
      isDragDisabled={options === "read-only"}
      key={task.id}
    >
      {(provided) => (
        <Card
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`m-1 disable-select  ${search(task) ? "d-none" : ""} ${task.booked_date_time < today && task.status === "booked"
            ? "bg-darker text-light"
            : ""
            }`}
        >
          <Card.Body className="m-1 mx-2 p-0">
            <Stack direction="horizontal" gap={2}>
              <div className="text-success h4 fw-bold my-auto" title="Vehicle reg">
                {task.breakdown === 1 ? (
                  <i className="text-danger fas fa-car-crash pe-2"></i>
                ) : (
                  <span></span>
                )}
                {task.waiting === 1 ? (
                  <i
                    className="text-info far fa-clock pe-2"
                    title="Customer waiting"
                  ></i>
                ) : (
                  <span></span>
                )}
                {task.reg}
              </div>
              {
                task.status !== "booked" ?
                  <div className="ms-auto">
                    <Nav.Link
                      className={`text-end p-0 m-0 h5 ${task.updated_at < today ? 'text-danger' : 'text-white' }`}
                      title={`Last update: ${moment(task.updated_at).format("YYYY-MM-DD HH:mm")}`}
                      onClick={(e) =>
                        handleUpdateClick(e, task.event_id, task.status)
                      }
                    >
                      <i class="fas fa-comments"></i>
                    </Nav.Link>
                  </div>
                  :
                  <div className="ms-auto"></div>
              }
              <div className="">
                <Nav.Link
                  className="p-0 m-0 h5"
                  title="Get more info about the job"
                  onClick={(e) =>
                    handleInfoClick(e, task.event_id, task.status)
                  }
                >
                  Info
                </Nav.Link>
              </div>
              <div className="">
                <Nav.Link
                  className="text-end p-0 m-0 text-info h5"
                  title="Edit booking"
                  onClick={(e) =>
                    handleEditClick(e, task.event_id, task.status)
                  }
                >
                  Edit
                </Nav.Link>
              </div>
            </Stack>
            <Row>
              <Col className="col-12 mt-1" title="Customer name">
                <label className="text-white text-truncate-2 fw-normal m-0 h4">
                  {task.customer_name}
                </label>
              </Col>

              <Col className="col-12 mt-1" title="Description of the booking">
                <label className="text-truncate-2 h4 fw-normal mb-1">
                  {task.description}
                </label>
              </Col>
              <Col
                className="col-12 my-1"
                title="Extra instrucion given by driver"
              >
                <label className="text-truncate-2 h6 fw-normal fst-italic m-0 text-lime">
                  {task.special_instructions &&
                    "Extra: " + task.special_instructions}
                </label>
              </Col>
              <Col className={`col-12 ${task.key_location ? "" : "d-noned"}`}>
                <Row className="justify-content-between">
                  <Col
                    className={`col-auto text-truncate-2 h6 mb-0 fw-normal ${task.status === "booked" ? "d-none" : ""
                      }  `}
                    title="Number of days from arrival date"
                  >
                    <label className="text-white">Age:</label>{" "}
                    <label
                      className={`${task.age > 2 ? "text-danger fw-bold" : ""}`}
                    >
                      {task.age} day{`${task.age <= 1 ? "" : "s"}`}
                    </label>
                  </Col>
                  <Col
                    className={`col-auto text-truncate-2 h5 mb-0 fw-normal ${task.status === "booked" ? "d-none" : ""
                      }  `}
                    title="Key location"
                  >
                    <label className="text-info">
                      <i className="fas fa-key fa-sm"></i>
                      <span className="ms-1 h4 fw-bold">
                        {task.key_location || "n/a"}
                      </span>
                    </label>
                  </Col>
                </Row>
              </Col>
              <Col
                className={`col-12 text-truncate-2 h6 fw-normal mb-0 ${task.status !== "booked" ? "d-none" : ""
                  }  `}
                title="Booked date"
              >
                Booked:{" "}
                <label
                  className={`${task.booked_date_time < today ? "text-danger fw-bold" : ""
                    }`}
                >
                  {moment(task.booked_date_time).format("DD-MM-YYYY")}
                </label>
              </Col>
              <Col className="col-12">
                <Row className="row-justify-end">
                  <Col className="col-5">
                    <label
                      className="text-white"
                      title="Allowed time for this job"
                    >
                      <h6 className="mb-0">
                        <span className="fw-bold text-info">Allowed:</span>{" "}
                        {task.allowed_time}h{" "}
                      </h6>
                    </label>
                  </Col>
                  <Col className="col-7">
                    <label
                      className="text-white fw-bold"
                      title="Otehr extra information about the job"
                    >
                      <h6 className="mb-0">
                        <span className="fw-bold text-info">Others:</span>{" "}
                        {!task.others ? "n/a" : task.others}
                      </h6>
                    </label>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Draggable>
  );
};

export default Task;
