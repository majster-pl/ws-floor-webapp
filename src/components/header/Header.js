import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Navbar,
  Nav,
  Dropdown,
  NavDropdown,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import apiClient from "../../service/api/api";
import { useHistory } from "react-router";

import "./Header.css";

const Header = ({ isLoggedIn, setLoggedIn, setLoginErrorMsg }) => {
  const history = useHistory();
  const location = useLocation();
  const logout = () => {
    apiClient.post("/logout").then((response) => {
      // console.log(response);
      if (response.status === 204) {
        setLoggedIn(false);
        // sessionStorage.setItem("loggedIn", false);
        // Cookies.remove("logged-in", { path: "" });
        // sessionStorage.clear();
        sessionStorage.setItem("loginStatus", "false");
        setLoginErrorMsg("You have been successfully logged out.");
        // sessionStorage.setItem("isLoggedIn", "false");
        history.push("/login");
      } else {
        history.push("/login");
      }
    });
  };

  // function to set Dropdown active
  const setDropdown1Active = () => {
    if (location.pathname === "/customers" || location.pathname === "/assets") {
      return true;
    } else {
      return false;
    }
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
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
        src="/img/avatar.png"
        width="32"
        height="32"
        className="rounded-circle shadow-sm"
        alt="User avatar"
      ></img>
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
        <img
          alt=""
          src="/img/logo-full.png"
          width="230"
          // height="60"
          className="d-inline-block align-top sticky-top"
        />
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
                    <Nav.Link eventKey="5" onClick={logout}>
                      Logout{" "}
                    </Nav.Link>
                  </Nav>
                </Col>

                <Col className="col-auto my-auto">
                  <Nav className="d-none d-lg-block justify-content-end ">
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        as={CustomToggle}
                        id="dropdown-custom-components"
                      ></Dropdown.Toggle>

                      <Dropdown.Menu className="navbar-user-dropdown">
                        <Dropdown.Item eventKey="10" as={Link} to="/add-user">
                          Add User
                        </Dropdown.Item>
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
