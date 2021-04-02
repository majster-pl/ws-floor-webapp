import CheckIfLoggedIn from "../../components/CheckIfLoggedIn";

const Workshop = (setLoggedIn) => {
    CheckIfLoggedIn(setLoggedIn);
    return <div>Workshop page! :-)</div>
}

export default Workshop;