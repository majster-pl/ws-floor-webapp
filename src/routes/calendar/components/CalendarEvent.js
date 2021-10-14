import PropTypes from "prop-types";
import { Row, Col, Nav } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setModal } from "../../../actions";
import moment from "moment";

const CalendarEvent = ({ props, isHighlighted, handleShowMainModal }) => {
  const {
    isUsed,
    event_id,
    booked_date_time,
    customer_name,
    reg,
    description,
    allowed_time,
    others,
    status,
    breakdown,
    waiting,
  } = props;

  const dispatch = useDispatch();
  var today = new Date().setHours(0, 0, 0, 0);
  var booked_date = new Date(booked_date_time).setHours(0, 0, 0, 0);

  function isNoShow() {
    if (booked_date < today && status === "booked") {
      return true;
    }
  }

  const handleEditClick = (e) => {
    e.stopPropagation();
    dispatch(setModal("edit"));
    handleShowMainModal(event_id, status);
  };

  const handleEventClick = () => {
    dispatch(setModal("other"));
    handleShowMainModal(event_id, status);
  };

  const setStatusColors = (status, breakdown) => {
    if (breakdown) {
      return { bg: "bg-danger", text: "text-white" };
    }

    switch (status) {
      case "booked":
        return { bg: "bg-light", text: "text-darker" };

      case "awaiting_labour":
        return { bg: "bg-info", text: "text-secondary" };

      case "planned":
        return { bg: "bg-lime", text: "text-secondary" };

      case "awaiting_estimates":
      case "awaiting_authorisation":
      case "awaiting_qc":
        return { bg: "bg-info", text: "text-darker" };

      case "awaiting_part":
        return { bg: "bg-light-blue", text: "text-darker" };

      case "work_in_progress":
        return { bg: "bg-primary", text: "text-white" };

      case "at_3rd_party":
        return { bg: "bg-dark-green", text: "text-white" };

      case "completed":
        return { bg: "bg-success", text: "text-white" };

      default:
        return { bg: "bg-gray", text: "text-mutted" };
    }
  };

  return (
    <td colSpan={2}>
      <div
        // data-toggle="modal"
        // data-target="#modalEditEvent"
        className={
          (!isUsed ? "d-none " : "card h-100 disable-select ") +
          (!isHighlighted ? "" : "d-none") +
          (isNoShow() ? "bg-sendary-extra" : "")
        }
        onClick={() => handleEventClick()}
        style={{ minHeight: "130px", maxHeight: "250px" }}
      >
        <div className="card-header p-0 text-success">
          <Row>
            <Col>
              <div
                className={`card-text fw-bold ps-2  ${
                  isNoShow() ? "text-light" : ""
                }`}
              >
                {breakdown === 1 ? (
                  <i className="me-2 text-danger fas fa-car-crash text-end"></i>
                ) : (
                  <span></span>
                )}
                {waiting === 1 ? (
                  <i className="me-2 text-info far fa-clock"></i>
                ) : (
                  <span></span>
                )}

                {reg}
              </div>
            </Col>
            <Col className="col-auto">
              <Nav.Link
                className={`text-end p-0 me-2   ${
                  isNoShow() ? "text-light" : "text-info"
                }`}
                onClick={handleEditClick}
              >
                Edit
              </Nav.Link>
            </Col>
          </Row>
        </div>
        <div className="card-body p-0">
          <div className="row card-body-row">
            <div className="col-4 card-text text-truncate">Customer:</div>
            <div
              className={`col-8 card-text text-truncate ${
                isNoShow() ? "text-light" : "text-white"
              }`}
            >
              {customer_name}
            </div>
            {/* <div className="col-4 card-text">Reg:</div>
            <div className="col-8 card-text fw-bold">{vehicleId}</div> */}
            <div className="col-4 card-text text-truncate">Desc:</div>
            <div
              className={`col-8 card-text text-truncate ${
                isNoShow() ? "text-light" : "text-white"
              }`}
            >
              {description}
              {/* <div className="text-truncate-3">{description}</div> */}
            </div>
            <div className="col-4 card-text text-truncate">Allowed:</div>
            <div
              className={`col-8 card-text text-truncate ${
                isNoShow() ? "text-light" : "text-white"
              }`}
            >
              {allowed_time} h
            </div>
            <div className="col-4 card-text text-truncate">Others:</div>
            <div
              className={`col-8 card-text text-truncate ${
                isNoShow() ? "text-light" : "text-white"
              }`}
            >
              {others}
            </div>
          </div>
        </div>
        <div
          className={
            "card-footer m-0 p-0 " + setStatusColors(status, breakdown).bg
          }
        >
          <small
            className={
              "fst-italic fw-bold ps-2 " +
              setStatusColors(status, breakdown).text
            }
          >
            {status}
          </small>
        </div>
      </div>
    </td>
  );
};

CalendarEvent.defaultProps = {
  isUsed: false,
};

CalendarEvent.propTypes = {
  isUsed: PropTypes.bool,
};

export default CalendarEvent;
