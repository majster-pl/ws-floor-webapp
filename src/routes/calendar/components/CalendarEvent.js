import PropTypes from "prop-types";
import { Row, Col, Nav } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setModal } from "../../../actions";

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
    key_location,
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

  const handleInfoClick = (e) => {
    e.stopPropagation();
    dispatch(setModal("info"));
    handleShowMainModal(event_id, status);
  };

  const handleEventClick = () => {
    dispatch(setModal("other"));
    handleShowMainModal(event_id, status);
  };

  const setStatusColors = (status, breakdown) => {
    if (breakdown && status !== "completed") {
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
        style={{ minHeight: "8.5rem", maxHeight: "15rem" }}
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
                  <i className="me-1 text-danger fas fa-xs fa-car-crash text-end"></i>
                ) : (
                  <span></span>
                )}
                {waiting === 1 ? (
                  <i className="me-1 text-info fa-xs far fa-clock"></i>
                ) : (
                  <span></span>
                )}
                <span className="h5 fw-bold">{reg}</span>
              </div>
            </Col>
            <Col className="col-auto p-0 px-1">
              <Nav.Link className="p-0 m-0" onClick={(e) => handleInfoClick(e)}>
                Info
              </Nav.Link>
            </Col>
            <Col className="col-auto p-0 px-2 pe-3">
              <Nav.Link
                className={`text-end p-0 me-2 ${
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
          <Row className="card-body-row">
            {/* Customer */}
            <Col className="col-4 card-text text-truncate">Customer:</Col>
            <Col
              className={`col-8 card-text text-truncate ${
                isNoShow() ? "text-light" : "text-white"
              }`}
            >
              {customer_name}
            </Col>

            {/* Description */}
            <Col className="col-4 card-text text-truncate">Desc:</Col>
            <Col
              className={`col-8 card-text text-truncate-2 ${
                isNoShow() ? "text-light" : "text-white"
              }`}
            >
              {description || "n/a"}
            </Col>

            {/* Allowed Time */}
            <Col className="col-4 card-text text-truncate">Allowed:</Col>
            <Col
              className={`col-8 card-text text-truncate ${
                isNoShow() ? "text-light" : "text-white"
              }`}
            >
              {allowed_time} h
            </Col>

            {/* Others */}
            <Col className="col-4 card-text text-truncate">Others:</Col>
            <Col
              className={`col-8 card-text text-truncate ${
                isNoShow() ? "text-light" : "text-white"
              }`}
            >
              {others || "n/a"}
            </Col>
          </Row>
        </div>
        <Row
          className={
            "card-footer justify-content-between m-0 p-0 " +
            setStatusColors(status, breakdown).bg
          }
        >
          <Col
            className={`col-auto fst-italic fw-bold ${
              setStatusColors(status, breakdown).text
            }`}
          >
            <span>{status}</span>
          </Col>
          <Col
            className={`col-auto fst-italic fw-bold ${
              setStatusColors(status, breakdown).text
            } ${key_location ? "" : "d-none"}`}
          >
            <i className="fas fa-key"></i>
            <span className="ms-1">{key_location || "n/a"}</span>
          </Col>
        </Row>
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
