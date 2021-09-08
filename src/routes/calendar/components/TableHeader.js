// import DatePicker from "react-datepicker";
import moment from "moment";
import React, { forwardRef } from "react";
import Moment from "react-moment";
import { Button } from "react-bootstrap";
import TableHeaderLogic from "./TableHeaderLogic";
import "react-datepicker/dist/react-datepicker.css";

const Header = ({
  currentDate,
  setCurrentDate,
  // searchQuery,
  // setSearchQuery,
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
