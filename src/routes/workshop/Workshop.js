import IsLoggedInLogic from "../../components/IsLoggedInLogic";

const Workshop = (setLoggedIn) => {
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(setLoggedIn);
  //if still waiting response from server then display spinner
  if (isLoading) {
    return <SpinnerComponent />;
  }

  return <div>Workshop page! :-)</div>;
};

export default Workshop;
