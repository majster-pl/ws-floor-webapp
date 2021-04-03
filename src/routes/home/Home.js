import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="m-5">
      Home page! <br></br>
      {/* <Button className="m-3" to="/login">Login</Button> */}
      <Nav.Link eventKey="2" as={Link} to="/dashboard">Login</Nav.Link>
    </div>
  );
};

export default Home;
