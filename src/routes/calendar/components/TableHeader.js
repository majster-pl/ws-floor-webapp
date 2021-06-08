import DatePicker from "react-datepicker";
import moment from "moment";
import React, { forwardRef } from "react";
import Moment from "react-moment";
import {
  Button,
  Nav,
  Dropdown,
  DropdownButton,
  Form,
  Col,
  Row,
  Container,
  ButtonGroup,
} from "react-bootstrap";
import TableHeaderLogic from "./TableHeaderLogic";
import "react-datepicker/dist/react-datepicker.css";

const Header = ({
  currentDate,
  setCurrentDate,
  searchQuery,
  setSearchQuery,
  handleModalOpen,
  numberOfDays,
  setNumberOfDays,
}) => {
  const {
    // currentDate,
    isMonday,
    handleDateChange,
    handleClickNext,
    handleClickPrevious,
    handleNumberOfDaysChange,
  } = TableHeaderLogic(
    currentDate,
    setCurrentDate,
    numberOfDays,
    setNumberOfDays
  );

  // Date picker custom button
  const ref = React.createRef();
  const CustomDateInput = forwardRef(({ onClick }, ref) => (
    <a className="page-link link-calendar" onClick={onClick} ref={ref}>
      <i className="fas fa-calendar-alt"></i>
    </a>
  ));

  const _numberOfDays = new Array(numberOfDays).fill(0).map((e, i) => i + 1);

  return (
    <thead>
      <tr className="thead_nav">
        <th colSpan={numberOfDays * 2}>
          <Row className="my-auto py-1 text-center table_navbar justify-content-between d-flex flex-wrap">
            <Col className="my-auto">
              <ButtonGroup>
                <ul className="pagination my-auto">
                  <li className="page-item">
                    <a
                      key="nav-1"
                      className="page-link"
                      onClick={handleClickPrevious}
                    >
                      <i className="fas fa-angle-left"></i>
                    </a>
                  </li>
                  <li id="datepicker-group" className="page-item">
                    <DatePicker
                      key="nav-2"
                      style={{ display: "revert" }}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      openToDate={new Date(moment(currentDate))}
                      customInput={<CustomDateInput ref={ref} />}
                      filterDate={isMonday}
                      closeOnScroll={true}
                      todayButton="This Week"
                      // locale="en-GB"
                      calendarClassName="rasta-stripes"
                      onChange={handleDateChange}
                    />
                  </li>
                  <li className="page-item">
                    <a
                      key="nav-3"
                      className="page-link"
                      onClick={handleClickNext}
                    >
                      <i className="fas fa-angle-right"></i>
                    </a>
                  </li>
                </ul>
              </ButtonGroup>
            </Col>
            <Col className="my-auto">
              <DropdownButton
                variant="success"
                size="sm"
                id="dropdown-item-button"
                title={numberOfDays + " Days"}
              >
                <Dropdown.ItemText>Days per page</Dropdown.ItemText>
                <Dropdown.Item
                  as="button"
                  onClick={() => handleNumberOfDaysChange(7)}
                >
                  7 Days
                </Dropdown.Item>
                <Dropdown.Item
                  as="button"
                  onClick={() => handleNumberOfDaysChange(14)}
                >
                  14 Days
                </Dropdown.Item>
                <Dropdown.Item
                  as="button"
                  onClick={() => handleNumberOfDaysChange(28)}
                >
                  28 Days
                </Dropdown.Item>
              </DropdownButton>
            </Col>
            <Col md="auto" className="my-auto">
              <div className="text-left fst-italic h4 date-range m-0">
                <Moment format="ddd DD MMMM YYYY" add={{ days: 0 }}>
                  {currentDate}
                </Moment>{" "}
                -{" "}
                <Moment
                  format="ddd DD MMMM YYYY"
                  add={{ days: numberOfDays - 1 }}
                >
                  {currentDate}
                </Moment>
                <br></br>
              </div>
            </Col>
            <Col className="my-auto">
              <Button
                className="mr-3"
                size="sm"
                variant="success"
                onClick={() => {
                  console.log("handleModalOpen()");
                }}
              >
                New Event
              </Button>
            </Col>
            <Col className="my-auto">
              <Form.Control
                size="sm"
                style={{ maxWidth: "250px" }}
                type="text"
                placeholder="search page"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Col>
          </Row>
        </th>
      </tr>

      <tr className="table-head-row">
        {_numberOfDays.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <th>
                <Moment
                  className="day-name"
                  format="dddd"
                  add={{ days: index }}
                >
                  {currentDate}
                </Moment>
              </th>
              <th className="day-info1">Capacity: 100</th>
            </React.Fragment>
          );
        })}
      </tr>
      <tr>
        {_numberOfDays.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <th>
                <Moment
                  className="day-date"
                  format="DD/MM/YYYY"
                  add={{ days: index }}
                >
                  {currentDate}
                </Moment>
              </th>
              <th className="day-info2">Remaining: 30</th>
            </React.Fragment>
          );
        })}
      </tr>
      <tr>
        {_numberOfDays.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <td></td>
              <td className="day-info3">Alocated: 20</td>
            </React.Fragment>
          );
        })}
      </tr>

      <tr>
        {_numberOfDays.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <td></td>
              <td className="day-info4">Unallocated: 30</td>
            </React.Fragment>
          );
        })}
      </tr>

      <tr>
        {_numberOfDays.map((item, index) => {
          return (
            <th key={index} colSpan="2">
              <div className="d-grid">
                <Button
                  variant="success"
                  size="sm"
                  block
                  onClick={() =>
                    handleModalOpen(
                      moment(currentDate)
                        .add(index, "days")
                        .format("YYYY-MM-DD")
                    )
                  }
                >
                  {" "}
                  Add new booking{" "}
                  <span>
                    {" "}
                    <i className="far fa-calendar-plus"></i>{" "}
                  </span>{" "}
                </Button>
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default Header;
