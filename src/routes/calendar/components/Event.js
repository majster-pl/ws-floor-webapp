import PropTypes from "prop-types";

const CalendarEvent = ({
  isUsed,
  eventId,
  bookedDate,
  customerName,
  vehicleId,
  description,
  allowedTime,
  others,
  status,
  setModalEditData,
  showModal,
}) => {
  // Date navigation buttons
  const handleModalOpen = () => {
    const initialFormData = Object.freeze({
      id: eventId,
      veh_id: vehicleId,
      customer_id: customerName,
      description: description,
      others: others,
      allowed_time: allowedTime,
      booked_at: bookedDate,
      status: status,
    });
    console.log(initialFormData);
    setModalEditData(initialFormData);
    showModal();
  };

  return (
    <td colSpan="2">
      <div
        // data-toggle="modal"
        // data-target="#modalEditEvent"
        className={!isUsed ? "d-none" : "card h-100"}
        onClick={handleModalOpen}
        style={{ minHeight: "150px", maxHeight: "150px" }}
      >
        <div className="card-body p-0">
          <div className="row card-body-row">
            <div className="col-5 card-text">Customer:</div>
            <div className="col-7 card-text">{customerName}</div>
            <div className="col-5 card-text">Reg:</div>
            <div className="col-7 card-text font-weight-bold">{vehicleId}</div>
            <div className="col-5 card-text">Desc:</div>
            <div className="col-7">
              <div className="text-truncate-3">{description}</div>
            </div>
            <div className="col-5 card-text">Allowed:</div>
            <div className="col-7">{allowedTime} h</div>
            <div className="col-5 card-text">Others:</div>
            <div className="col-7">{others}</div>
          </div>
        </div>
        <div className="card-footer p-0 card-body-row">
          <small className="text-muted">Status: <i>{status}</i></small>
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
