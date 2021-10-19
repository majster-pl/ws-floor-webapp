import DatePicker from "react-datepicker";
import moment from "moment";
import React, { forwardRef } from "react";
import Moment from "react-moment";
import {
  Button,
  Dropdown,
  DropdownButton,
  Form,
  Col,
  Row,
  ButtonGroup,
} from "react-bootstrap";
import TableHeaderLogic from "./TableHeaderLogic";
import "react-datepicker/dist/react-datepicker.css";

const CalendarNavbar = ({
  currentDate,
  setCurrentDate,
  searchQuery,
  setSearchQuery,
  // handleModalOpen,
  numberOfDays,
  setNumberOfDays,
  reloadCalendar,
}) => {
  const {
    // currentDate,
    isMonday,
    handleDateChange,
    handleClickNext,
    handleClickPrevious,
    handleNumberOfDaysChange,
  } = TableHeaderLogic({
    currentDate,
    setCurrentDate,
    numberOfDays,
    setNumberOfDays,
    reloadCalendar,
  });

  // Date picker custom button
  const ref = React.createRef();
  const CustomDateInput = forwardRef(({ onClick }, ref) => (
    <a className="page-link link-calendar" onClick={onClick} ref={ref}>
      <i className="fas fa-calendar-alt"></i>
    </a>
  ));

  const _numberOfDays = new Array(numberOfDays).fill(0).map((e, i) => i + 1);

  return (
    <div className="mx-0 px-0 container-fluid navbar-fixed-left">
      <Row className="my-auto py-1 text-center table_navbar justify-content-between d-flex flex-wrap mx-0">
        <Col className="my-2 my-md-auto mx-2">
          <Row className="text-end text-md-start">
            <Col xs="auto" className="my-auto">
              <ButtonGroup>
                <ul id="calendar-pagination" className="pagination my-auto">
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
          </Row>
        </Col>
        <Col md="auto" className="my-auto">
          <div className="text-left fst-italic h3 date-range m-0">
            <Moment format="ddd DD MMMM YYYY" add={{ days: 0 }}>
              {currentDate}
            </Moment>{" "}
            -{" "}
            <Moment format="ddd DD MMMM YYYY" add={{ days: numberOfDays - 1 }}>
              {currentDate}
            </Moment>
            <br></br>
          </div>
        </Col>
        <Col className="my-2 my-md-auto mx-2 text-start text-md-end">
          <Row className="justify-content-end">
            <Col>
              <Button
                className="mr-3"
                size="sm"
                variant="success"
                onClick={() => {
                  reloadCalendar();
                  // console.log("handleModalOpen()");
                }}
              >
                Refresh
              </Button>
            </Col>
            <Col xs="auto">
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
        </Col>
      </Row>
    </div>
  );
};

export default CalendarNavbar;
