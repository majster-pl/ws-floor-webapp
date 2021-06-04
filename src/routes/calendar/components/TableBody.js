import CalendarEvent from "./CalendarEvent";
// import moment from "moment";

const CalendarBody = ({
  tableData,
  handleModalOpen,
  query,
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
              key={index+"."+index2}
              eventId={cell.event_id}
              isHighlighted={search(cell)}
              isUsed={cell.isUsed}
              vehicleId={cell.asset}
              // bookedDate={cell.booked_at}
              customerName={cell.customer}
              description={cell.description}
              allowedTime={cell.allowed_time}
              others={typeof(cell.others) === 'object' ? "-----" : cell.others}
              status={cell.status}
              handleModalOpen={handleModalOpen}
            />
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default CalendarBody;
