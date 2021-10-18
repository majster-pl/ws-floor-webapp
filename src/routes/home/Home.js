import { Nav, Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Home.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
// import background from "/img/hexagons-twist.jpg";
import "react-lazy-load-image-component/src/effects/blur.css";

const Home = () => {
  return (
    <div className="h-100 ">
      <LazyLoadImage
        effect="blur"
        className="img-home-background"
        src="/img/hexagons-twist.jpg"
        alt=""
      />
      <div className="container-fluid homepage-main">
        <div className="div-center-vert">
          <Container className="text-white">
            <Row>
              <Col className="col-12 col-md-6">
                <h3 className="text-uppercase font-orbitron">
                  Manage your workshop
                </h3>
                <h1 className="mt-4 font-orbitron">Workshop Software</h1>
                <h3 className="mt-4 lh-base">
                  WS Floor is a web application to help you organise/plan work
                  in your garage while automaticly updating your customers about
                  progress on reapir. It's been created with{" "}
                  <i class="fas fa-heart text-pink"></i> by Szymon Waliczek and
                  is completely open source! Code can be found on{" "}
                  <i class="fab fa-github"> Github</i>
                </h3>
                <Nav.Link
                  className="px-0 mt-4"
                  eventKey="2"
                  as={Link}
                  to="/login"
                >
                  <div className="d-grid gap-2">
                    <Button className="btn-info" to="/login">
                      Login
                    </Button>
                  </div>
                </Nav.Link>
                <h6 className="text-light fst-italic">
                  If you want to try it out fill free to use login button and
                  login to demo session using username:{" "}
                  <i className="text-decoration-underline">demo@demo.com</i> and
                  password: <i className="text-decoration-underline">demo123</i>
                </h6>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Home;
