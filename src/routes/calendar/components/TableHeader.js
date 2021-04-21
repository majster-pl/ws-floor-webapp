import DatePicker from "react-datepicker";
import moment from "moment";
import React, { forwardRef } from "react";
import Moment from "react-moment";
import { Button, Nav, Dropdown, DropdownButton } from "react-bootstrap";
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
  } = TableHeaderLogic(currentDate, setCurrentDate, numberOfDays, setNumberOfDays);

  // Date picker custom button
  const ref = React.createRef();
  const CustomDateInput = forwardRef(({ onClick }, ref) => (
    <a className="page-link py-1 link-calendar" onClick={onClick} ref={ref}>
      <i className="fas fa-calendar-alt"></i>
    </a>
  ));

  const _numberOfDays = new Array(numberOfDays).fill(0).map((e, i) => i + 1);

  return (
    <thead>
      <tr className="thead_nav">
        <th colSpan={numberOfDays * 2}>
          <Nav fill variant="tabs" defaultActiveKey="/home">
            <Nav.Item className="m-3">
              <div className="form-inline justify-content-start">
                <ul className="pagination d-flex justify-content-center m-0">
                  <li className="page-item">
                    <a
                      key="nav-1"
                      className="page-link py-1"
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
                      className="page-link py-1"
                      onClick={handleClickNext}
                    >
                      <i className="fas fa-angle-right"></i>
                    </a>
                  </li>
                </ul>
                <ul className="pagination d-flex justify-content-center ml-3 m-0">
                  <DropdownButton
                    variant="secondary"
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
                </ul>
              </div>
            </Nav.Item>
            <Nav.Item>
              <div className="mt-3 text-left font-italic h4">
                <Moment format="ddd DD MMMM YYYY" add={{ days: 0 }}>
                  {currentDate}
                </Moment>{" "}
                -{" "}
                <Moment format="ddd DD MMMM YYYY" add={{ days: 6 }}>
                  {currentDate}
                </Moment>
                <br></br>
              </div>
            </Nav.Item>
            <Nav.Item>
              <div className="form-inline justify-content-end mr-2 my-1">
                <Button
                  className="mr-2"
                  size="sm"
                  variant="success"
                  onClick={() => {
                    console.log("handleModalOpen()");
                  }}
                >
                  <b>Add new</b>
                </Button>
                <input
                  className="form-control mr-sm-1"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                />
              </div>
            </Nav.Item>
          </Nav>
        </th>
      </tr>

      <tr className="table-head-row">
        {_numberOfDays.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <th>
                <Moment format="dddd" add={{ days: index }}>
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
                <Moment format="DD/MM/YYYY" add={{ days: index }}>
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
            <th key={index} colSpan="2" className="">
              <Button
                className="m-0 rounded-0"
                variant="primary"
                size="sm"
                block
                onClick={() =>
                  handleModalOpen(moment(currentDate).add(index, "days"))
                }
              >
                {" "}
                Add new booking{" "}
                <span>
                  {" "}
                  <i className="far fa-calendar-plus"></i>{" "}
                </span>{" "}
              </Button>
            </th>
          );
        })}
      </tr>
      <tr>
        <th>
          <div className="my-1"></div>
        </th>
      </tr>
    </thead>
  );
};

export default Header;
