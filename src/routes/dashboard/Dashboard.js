import CheckIfLoggedIn from "../../components/CheckIfLoggedIn";

const Dashboard = (setLoggedIn) => {
    CheckIfLoggedIn(setLoggedIn);
    return <div>Dashboard! :-)</div>
}

export default Dashboard;