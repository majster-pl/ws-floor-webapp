import PropTypes from "prop-types";
import apiClient from "../../../service/api/api";
import { Row, Col, Nav } from "react-bootstrap";

const CalendarEvent = ({
  props,
  handleModalOpen,
  setModalEventId,
  isHighlighted,
  showModal,
  handleShowMainModal,
}) => {
  // Date navigation buttons
  const handleModalOpen2 = () => {
    setModalEventId(event_id);
    // let url = "/api/v1/events/"+eventId;

    // apiClient.get(url).then((response) => {
    //   // setTableData(response.data.data);
    //   console.log(response.data);
    // });
    // const initialFormData = Object.freeze({
    //   id: eventId,
    //   veh_id: vehicleId,
    //   customer_id: customerName,
    //   description: description,
    //   others: others,
    //   allowed_time: allowedTime,
    //   booked_at: bookedDate,
    //   status: status,
    // });
    // console.log(initialFormData);
    // setModalEditData(initialFormData);
    // showModal();
  };

  const {
    isUsed,
    event_id,
    booked_date,
    customer_name,
    reg,
    description,
    allowed_time,
    others,
    status,
  } = props;

  const handleEditClick = (e) => {
    e.stopPropagation();
    handleModalOpen(null, event_id);
  };

  return (
    <td colSpan="2">
      <div
        // data-toggle="modal"
        // data-target="#modalEditEvent"
        className={
          (!isUsed ? "d-none " : "card h-100 disable-select ") +
          (!isHighlighted ? "" : "d-none")
        }
        // onClick={() => handleModalOpen(null, event_id)}
        onClick={() => handleShowMainModal(event_id, status, props)}
        style={{ minHeight: "150px", maxHeight: "250px" }}
      >
        <div className="card-header p-0 text-success">
          <Row>
            <Col>
              <div className="card-text fw-bold ps-2">{reg}</div>
            </Col>
            <Col className="col-auto">
              <Nav.Link
                className="text-end p-0 me-2 "
                onClick={handleEditClick}
              >
                Edit
              </Nav.Link>
            </Col>
          </Row>
        </div>
        <div className="card-body p-0">
          <div className="row card-body-row">
            <div className="col-5 card-text">Customer:</div>
            <div className="col-7 card-text text-white text-truncate">
              {customer_name}
            </div>
            {/* <div className="col-5 card-text">Reg:</div>
            <div className="col-7 card-text fw-bold">{vehicleId}</div> */}
            <div className="col-5 card-text">Desc:</div>
            <div className="col-7 text-truncate-3 text-white ">
              {description}
              {/* <div className="text-truncate-3">{description}</div> */}
            </div>
            <div className="col-5 card-text">Allowed:</div>
            <div className="col-7 text-white ">{allowed_time} h</div>
            <div className="col-5 card-text">Others:</div>
            <div className="col-7 text-white ">{others}</div>
          </div>
        </div>
        <div className="card-footer p-0 card-body-row">
          <small className="text-info fst-italic ps-1">{status}</small>
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
