import { forwardRef, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Navbar,
  Nav,
  Dropdown,
  NavDropdown,
  Row,
  Col,
  Button,
  Form,
} from "react-bootstrap";
import apiClient from "../../service/api/api";
import { useHistory } from "react-router";
import { RootStateOrAny, useDispatch, useSelector, useStore } from "react-redux";
import { setDepot, setDepotsList } from "../../actions";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./Header.css";

const Header = ({
  isLoggedIn,
  setLoggedIn,
  setLoginErrorMsg,
  setTableData,
}) => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const depotsList = useSelector((state) => state.depots);
  const selectedDepot = useSelector((state) => state.depot);
  const user = useSelector((state) => state.user);

  const logout = () => {
    apiClient.post("/logout").then((response) => {
      // console.log(response);
      if (response.status === 204) {
        setLoggedIn(false);
        setTableData([]);
        sessionStorage.setItem("loginStatus", "false");
        setLoginErrorMsg("You have been successfully logged out.");
        history.push("/login");
      } else {
        history.push("/login");
      }
    });
  };

  useEffect(() => {
    // reloadCalendar();
  }, [selectedDepot]);

  // function to set Dropdown active
  const setDropdown1Active = () => {
    if (location.pathname === "/customers" || location.pathname === "/assets") {
      return true;
    } else {
      return false;
    }
  };
  useEffect(() => {
    async function fetchDepots() {
      const depots = await apiClient
        .get("/api/v1/depot")
        .then((response) => {
          dispatch(setDepotsList(response.data));
        })
        .catch((err) => {
          return [];
        });
    }
    fetchDepots();
  }, []);

  const CustomToggle = forwardRef(({ children, onClick }, ref) => (
    <Button
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      variant="link"
      className="nav-link p-0"
      id="navbarDropdownMenuLink"
      role="button"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >
      <img
        width="32"
        height="32"
        className="rounded-circle shadow-sm"
        src="/img/avatar-green.png"
        alt="Avatar"
      />
    </Button>
  ));

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="black"
      variant="dark"
      className="navbar-fixed-top bg-sendary-extra navbar-main"
    >
      <Navbar.Brand eventkey="1" href="/">
        <div className="position-relative font-orbitron">
          <LazyLoadImage
            effect="blur"
            className="d-inline-block align-top sticky-top"
            width="230"
            src="/img/logo-full-new.png"
            alt="WS Floor Logo"
          />
          {isLoggedIn && (
            <div className="position-absolute bottom-right">
              <span className="pe-2">{user.company}</span>
              <span className="text-white text-depot">
                {depotsList
                  .filter((depot) => depot.id === selectedDepot)
                  .map((dep) => dep.name)}
              </span>
            </div>
          )}
        </div>
      </Navbar.Brand>
      {isLoggedIn && (
        <>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <div className="mx-0 px-0 container-fluid">
              <Row>
                <Col className="col-12 col-lg-auto me-auto">
                  <Nav className="me-auto w-100">
                    <Nav.Link eventKey="2" as={NavLink} to="/dashboard">
                      Dashboard
                    </Nav.Link>
                    <Nav.Link eventKey="3" as={NavLink} to="/calendar">
                      Calendar
                    </Nav.Link>
                    <Nav.Link eventKey="4" as={NavLink} to="/workshop">
                      Workshop
                    </Nav.Link>
                    <NavDropdown
                      active={setDropdown1Active()}
                      title="More"
                      menuvariant="dark"
                      id="nav-dropdown"
                    >
                      <NavDropdown.Item
                        eventKey="5.1"
                        as={NavLink}
                        to="/customers"
                      >
                        Customers
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        eventKey="5.2"
                        as={NavLink}
                        to="/assets"
                      >
                        Assets
                      </NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                  <Nav className="d-block d-lg-none me-auto">
                    <NavDropdown
                      className="nav-dropdown-depot2 disable-select"
                      // title={depotsList.filter(depot => depot.id === selectedDepot).map(dep => (dep.name))}
                      title="Branch"
                      drop="down"
                      menuvariant="dark"
                    >
                      {depotsList.map((depot) => {
                        return (
                          <NavDropdown.Item
                            className="nav-dropdown-depot-item disable-select"
                            key={"d1-" + depot.id}
                            active={selectedDepot === depot.id}
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(setDepot(depot.id));
                              sessionStorage.setItem(
                                "selected_depot",
                                depot.id
                              );
                              // reloadCalendar();
                            }}
                          >
                            {depot.name}
                          </NavDropdown.Item>
                        );
                      })}
                    </NavDropdown>
                  </Nav>

                  <Nav className="d-block d-lg-none me-auto">
                    <Nav.Link eventKey="11a" as={Link} to="/settings">
                      Settings{" "}
                    </Nav.Link>
                  </Nav>
                  <Dropdown.Divider className="d-block d-lg-none me-auto" />

                  <Nav className="d-block d-lg-none me-auto">
                    <Nav.Link eventKey="5" onClick={logout}>
                      Logout{" "}
                    </Nav.Link>
                  </Nav>
                </Col>

                <Col className="col-auto my-auto">
                  <Nav className="d-none d-lg-block justify-content-end ">
                    <Dropdown align="end" menuvariant="dark">
                      <Dropdown.Toggle as={CustomToggle}></Dropdown.Toggle>

                      <Dropdown.Menu className="navbar-user-dropdown">
                        <NavDropdown
                          className="nav-dropdown-depot disable-select"
                          // title={depotsList.filter(depot => depot.id === selectedDepot).map(dep => (dep.name))}
                          title="Branch"
                          drop="start"
                          menuvariant="light"
                        >
                          {depotsList.map((depot, e) => {
                            return (
                              <NavDropdown.Item
                                className="nav-dropdown-depot-item disable-select"
                                key={"d2-" + depot.id}
                                active={selectedDepot === depot.id}
                                onClick={(e) => {
                                  e.preventDefault();
                                  dispatch(setDepot(depot.id));
                                  sessionStorage.setItem(
                                    "selected_depot",
                                    depot.id
                                  );
                                }}
                              >
                                {depot.name}
                              </NavDropdown.Item>
                            );
                          })}
                        </NavDropdown>

                        <Dropdown.Item eventKey="11" as={Link} to="/settings">
                          Settings
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey="12" onClick={logout}>
                          Logout
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Nav>
                </Col>
              </Row>
            </div>
          </Navbar.Collapse>
        </>
      )}
    </Navbar>
  );
};

export default Header;
