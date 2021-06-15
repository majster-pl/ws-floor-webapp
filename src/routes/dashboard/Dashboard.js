import { Button } from "react-bootstrap";
import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import apiClient from "../../service/api/api";
import "./Dashboard.css";

const Dashboard = ({ setLoggedIn, setShowToast, setToastData }) => {
  const { isLoading, SpinnerComponent } = IsLoggedInLogic({ setLoggedIn });
  //if still waiting response from server then display spinner
  if (isLoading) {
    return <SpinnerComponent />;
  }

  // fuction to initial and set toast
  const showToast = (variant, title, body) => {
    setShowToast(false);
    setShowToast(true);
    setToastData({
      variant: variant.toLowerCase(),
      title: title,
      body: body,
    });
  };

  const getAssets = () => {
    apiClient
      .get("/api/v1/assets/2")
      .then((response) => {
        console.log(response.data);
        showToast("success", "Response", JSON.stringify(response.data))
      })
      .catch((err) => {
        showToast("danger", "Error", err.response.statusText)
      });
  };

  const getEvents = () => {
    apiClient
      .get("/api/v1/events?days=7&from=2021-06-1&format=grid")
      .then((response) => {
        console.log(response.data);
      });
  };

  const getCustomer = () => {
    apiClient.get("/api/v1/customer").then((response) => {
      console.log(response.data);
    });
  };

  const getEvent = () => {
    apiClient.get("/api/v1/events/10").then((response) => {
      console.log(response.data);
    });
  };
  const saveEvent = () => {
    let url = "/api/v1/events/119";

    const data = {
      description: "lol",
      booked_date: "2021-05-29",
      allowed_time: 2,
      status: "booked",
    };

    apiClient
      .patch(url, data)
      .then((response) => {
        // setTableData(response.data.data);
        console.log(response.data);
        // setModalData(response.data.data);
        // setShowModal(true);
      })
      .catch((err) => {
        console.log("error:", err);
      });
  };

  return (
    <div className="scroll">
      <Button onClick={getAssets}> Assets </Button>
      <Button onClick={getEvents}> get events </Button>
      <Button onClick={getCustomer}> get Customer </Button>
      <Button onClick={getEvent}> get event 10 </Button>
      <Button onClick={saveEvent}> Save events </Button>
    </div>
  );
};

export default Dashboard;
