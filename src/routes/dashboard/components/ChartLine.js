import { Container, Row, Col, DropdownButton, Dropdown } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import moment from "moment";
import apiClient from "../../../service/api/api";

const ChartLine = () => {
  const todaysDate = moment().startOf("isoweek").format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(() => {
    return todaysDate;
  });
  const [chartData, setChartData] = useState({});
  const [eventsPerDay, setEventsPerDay] = useState([]);
  const [eventsBooked, setEventsBooked] = useState([]);
  const [eventsCompleted, setEventsCompleted] = useState([]);
  const [numberOfSelectedDays, setNumberOfSelectedDays] = useState(7);
  const [dropdownLabel, setDropdownLabel] = useState("This Week");

  const setLabel = (days, label, startDay) => {
    setDropdownLabel(label);
    setNumberOfSelectedDays(days);
    setStartDate(startDay);
  };

  const Chart = () => {
    console.log("running new chart...");

    setChartData({
      datasets: [
        {
          label: "Total booked jobs",
          data: eventsPerDay,
          borderColor: "#ffbb00",
          fill: false,
          cubicInterpolationMode: "monotone",
          tension: 0.4,
        },
        {
          label: "With status: booked",
          data: eventsBooked,
          borderColor: "#39a883",
          fill: false,
          tension: 0.4,
        },
        {
          label: "Completed Jobs",
          data: eventsCompleted,
          borderColor: "#f00fa6",
          tension: 0.4,
          fill: false,
        },
      ],
    });
  };

  const getBookedDays = () => {
    apiClient
      .get("/api/v1/stats?from=" + startDate + "&days=" + numberOfSelectedDays)
      .then((response) => {
        setEventsPerDay(response.data.data);
      })
      .catch((err) => {
        // showToast("danger", "Error", err.statusText, false);
      });
  };

  const getWorkInProgess = () => {
    apiClient
      .get(
        "/api/v1/stats?from=" +
          startDate +
          "&days=" +
          numberOfSelectedDays +
          "&status=work_in_progress"
      )
      .then((response) => {
        setEventsBooked(response.data.data);
      });
  };

  const getCompleted = () => {
    apiClient
      .get(
        "/api/v1/stats?from=" +
          startDate +
          "&days=" +
          numberOfSelectedDays +
          "&status=completed"
      )
      .then((response) => {
        setEventsCompleted(response.data.data);
      })
      .catch((err) => {
        // showToast("danger", "Error", err.statusText, false);
        console.log(err.statusText);
      });
  };

  useEffect(() => {
    getBookedDays();
    getWorkInProgess();
    getCompleted();
  }, [numberOfSelectedDays]);

  useEffect(() => {
    Chart();
  }, [eventsBooked, eventsPerDay, eventsCompleted]);

  const Canvas = () => {
    return (
      <Line
        key="canvas1"
        data={chartData}
        options={{
          interaction: {
            intersect: false,
            mode: "nearest",
          },
          plugins: {
            legend: {
              position: "right",
            },
          },
          responsive: true,
          title: { text: "THICCNESS SCALE", display: true },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        }}
      />
    );
  };

  return (
    <>
      <Container>
        <Row className="p-2 g-2">
          <Col className="col-auto me-auto">
            <div className="fw-bold fs-4">Workshop overview</div>
          </Col>
        </Row>
      </Container>
      <Container style={{ minHeight: "25rem" }}>
        <Row className="p-2 g-2">
          <Col className="col-auto mx-auto order-md-1 my-2">
            <DropdownButton
              id="dropdown-basic-button"
              title={dropdownLabel}
              variant="success"
            >
              <Dropdown.Item
                onClick={() =>
                  setLabel(
                    7,
                    "This Week",
                    moment().startOf("isoweek").format("YYYY-MM-DD")
                  )
                }
                active={numberOfSelectedDays == 7}
                label="This Week"
              >
                This Week
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() =>
                  setLabel(
                    31,
                    "This Month",
                    moment().startOf("month").format("YYYY-MM-DD")
                  )
                }
                active={numberOfSelectedDays == 31}
                label="This Month"
              >
                This Month
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() =>
                  setLabel(
                    365,
                    "This Year",
                    moment().startOf("year").format("YYYY-MM-DD")
                  )
                }
                active={numberOfSelectedDays == 365}
                label="This Year"
              >
                This Year
              </Dropdown.Item>
            </DropdownButton>
          </Col>
          <Col className="order-md-0 my-2">
            <Canvas />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ChartLine;
