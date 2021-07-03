import IsLoggedInLogic from "../../components/IsLoggedInLogic";

const Workshop = ({ setLoggedIn, setLoginErrorMsg, toast }) => {
  // when page oppened check if user logged in, if not redirect to login page
  const { isLoading, SpinnerComponent } = IsLoggedInLogic(
    setLoginErrorMsg,
    setLoggedIn
  );
  //if still waiting response from server then display spinner
  if (isLoading) {
    return <SpinnerComponent />;
  }

  return <>Workshop page! :-)</>;
};

export default Workshop;
