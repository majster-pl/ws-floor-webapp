import PropTypes from "prop-types";
import apiClient from "../../../service/api/api";

const CalendarEvent = ({
  isUsed,
  eventId,
  isHighlighted,
  bookedDate,
  customerName,
  vehicleId,
  description,
  allowedTime,
  others,
  status,
  handleModalOpen,
  setModalEventId,
  showModal,
}) => {
  // Date navigation buttons
  const handleModalOpen2 = () => {
    setModalEventId(eventId);
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

  return (
    <td colSpan="2">
      <div
        // data-toggle="modal"
        // data-target="#modalEditEvent"
        className={
          (!isUsed ? "d-none " : "card h-100 ") +
          (!isHighlighted ? "" : "d-none")
        }
        onClick={() => handleModalOpen(null, eventId)}
        style={{ minHeight: "150px", maxHeight: "250px" }}
      >
        <div className="card-header p-0 text-success">
          <div className="card-text fw-bold ps-2">{vehicleId}</div>
        </div>
        <div className="card-body p-0">
          <div className="row card-body-row">
            <div className="col-5 card-text">Customer:</div>
            <div className="col-7 card-text text-white text-truncate">
              {customerName}
            </div>
            {/* <div className="col-5 card-text">Reg:</div>
            <div className="col-7 card-text fw-bold">{vehicleId}</div> */}
            <div className="col-5 card-text">Desc:</div>
            <div className="col-7 text-truncate-3 text-white ">
              {description}
              {/* <div className="text-truncate-3">{description}</div> */}
            </div>
            <div className="col-5 card-text">Allowed:</div>
            <div className="col-7 text-white ">{allowedTime} h</div>
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
