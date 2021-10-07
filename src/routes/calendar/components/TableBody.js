import CalendarEvent from "./CalendarEvent";
// import moment from "moment";

const CalendarBody = ({
  tableData,
  query,
  setIsLoading,
  handleShowMainModal,
}) => {
  // search function
  function search(event) {
    // console.log(event);
    if (event.isUsed && query.length > 0) {
      var val = Object.values(event);
      var valid = true;
      for (const key of val) {
        if (key !== null) {
          if (
            key
              .toString()
              .toLocaleLowerCase()
              .indexOf(query.toString().toLocaleLowerCase()) > -1
          ) {
            valid = false;
          }
        }
      }
      return valid;
    }
  }

  return (
    <tbody>
      {tableData.map((row, index) => (
        <tr key={index}>
          {row.map((cell, index2) => (
            <CalendarEvent
              key={index + "." + index2}
              // {...cell}
              props={cell}
              setIsLoading={setIsLoading}
              eventId={cell.event_id}
              isHighlighted={search(cell)}
              isUsed={cell.isUsed}
              vehicleId={cell.reg}
              // bookedDate={cell.booked_at}
              booked_date_time={cell.booked_date_time}
              customerName={cell.customer_name}
              description={cell.description}
              allowedTime={cell.allowed_time}
              others={typeof cell.others === "object" ? "-----" : cell.others}
              status={cell.status}
              handleShowMainModal={handleShowMainModal}
            />
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default CalendarBody;
