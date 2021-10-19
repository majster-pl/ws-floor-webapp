import { useState } from "react";
import { Collapse, Container, Row, Col } from "react-bootstrap";

const HistoryListItem = ({ date, description, properties }) => {
  const [open, setOpen] = useState(false);

  let old_atr = properties.old;
  if (typeof old_atr !== "object") {
    old_atr = Object.keys({});
  }

  // console.log(properties);
  

  return (
    <>
      <div
        className="font-monospace fs-5 text-info"
        onClick={() => setOpen(!open)}
      >
        {"[" + date + "] " + description}
        <div className="container text-white">
          {Object.keys(properties.attributes).map((keyName, i) => (
            <div key={"hist-"+i}>
              <span className="text-success">{keyName}</span>
              {": "}
              <span className="text-light">{old_atr[keyName]}</span>
              {" -> "}
              <span className="text-danger">
                {properties.attributes[keyName]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default HistoryListItem;
