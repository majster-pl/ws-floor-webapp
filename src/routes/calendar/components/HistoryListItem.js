import { useState } from "react";
import { Collapse, Container, Row, Col } from "react-bootstrap";

const HistoryListItem = ({ date, description, properties }) => {
  const [open, setOpen] = useState(false);

  let old_atr = properties.old;
  if (typeof old_atr !== "object") {
    old_atr = Object.keys({});
  }

  return (
    <>
      <div
        className="font-monospace fs-5 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        [{date}] {description}
      </div>
      <Collapse in={open}>
        <Container>
          <Row className="font-monospace fs-5">
            <Col md={4}>
              <div className="text-info">attribute:</div>
              {Object.keys(properties.attributes).map((keyName, i) => (
                <div key={"name-" + i}>{keyName}</div>
              ))}
            </Col>

            <Col md={8}>
              <div className="text-success">changed to:</div>
              {Object.keys(properties.attributes).map((keyName, i) => (
                <div key={"val" + i}>{properties.attributes[keyName]}</div>
              ))}
            </Col>
          </Row>
        </Container>
      </Collapse>
    </>
  );
};
export default HistoryListItem;
