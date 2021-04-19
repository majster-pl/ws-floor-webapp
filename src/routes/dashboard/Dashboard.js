import { Button } from "react-bootstrap";
import IsLoggedInLogic from "../../components/IsLoggedInLogic";
import apiClient from "../../service/api/api";

const Dashboard = (setLoggedIn) => {
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(setLoggedIn);
  //if still waiting response from server then display spinner
  if (isLoading) {
    return <SpinnerComponent />;
  }

  const getAssets = () => {
    apiClient.get("/api/v1/assets").then((response) => {
      console.log(response.data);
    });  
  }

  const getEvents = () => {
    apiClient.get("/api/v1/events?days=10&from=2021-04-12&format=grid").then((response) => {
      console.log(response.data);
    });  
  }

  return <>

  <Button onClick={getAssets} > Assets </Button>
  <Button onClick={getEvents} > get events </Button>
  
  </>;
};

export default Dashboard;
