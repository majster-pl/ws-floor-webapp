import CalendarEvent from "./Event";
// import moment from "moment";

const CalendarBody = ({
  data,
  setModalEditData,
  handleShowModal,
  handleCloseModal,
  query,
}) => {
  // search function
  function search(event) {
    // console.log(event);
    if (event.isUsed) {
      var val = Object.values(event);
      var valid = false;
      for (const key of val) {
        if (key !== null) {
          if (
            key
              .toString()
              .toLocaleLowerCase()
              .indexOf(query.toString().toLocaleLowerCase()) > -1
          ) {
            valid = true;
          }
        }
      }
      return valid;
    }
  }

  return (
    <tbody>
      {data.map((row, index) => (
        <tr key={index}>
          {row.map((cell, index) => (
            <CalendarEvent
              key={index}
              // eventId={cell[0].event_id}
              isUsed={search(cell)}
              // isUsed={true}
              vehicleId={cell.reg}
              // bookedDate={cell[0].booked_at}
              customerName={cell.customer}
              description={cell.description + "rere"}
              allowedTime={cell.allowed_time}
              others={cell.others === null ? "" : "n/a"}
              status={cell.status}
              // setModalEditData={setModalEditData}
              // showModal={handleShowModal}
              // handleCloseModal={handleCloseModal}
            />
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default CalendarBody;
