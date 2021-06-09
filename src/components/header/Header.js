import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Navbar, Nav, Dropdown, Container, Row, Col } from "react-bootstrap";
import apiClient from "../../service/api/api";
import { useHistory } from "react-router";
import Cookies from "js-cookie";

import "./Header.css";

// const logout = (e) => {
//     e.preventDefault();

//     var url = "/api/logout";
//     // console.log(url);
//     axios
//         .post(url, formData, {
//             headers: { "Content-Type": "application/json" },
//         })
//         .then((res) => {
//             // console.log(res.data.map((e) => e.asset_name));
//             // setAssetsOptions(res.data.map((e) => e.asset_name));
//             console.warn(res);
//             if (res.data.access_token) {
//                 localStorage.setItem("user-token", res.data.access_token);
//                 localStorage.setItem("user-data", JSON.stringify(res.data.user));
//                 axios.defaults.headers.common['Authorization'] = res.data.access_token;
//                 setIsLoggedIn(true);
//             }
//             history.push("/dashboard");
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// };

const Header = ({ isLoggedIn, setLoggedIn }) => {
  const history = useHistory();

  const logout = () => {
    apiClient.post("/logout").then((response) => {
      if (response.status === 204) {
        setLoggedIn(false);
        // sessionStorage.setItem("loggedIn", false);
        Cookies.remove("logged-in", { path: "" });
        sessionStorage.clear();
        history.push("/login");
      }
    });
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="nav-link p-0"
      id="navbarDropdownMenuLink"
      role="button"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >
      <img
        src="img/avatar.png"
        width="32"
        height="32"
        className="rounded-circle shadow-sm"
        alt="User avatar"
      ></img>
    </a>
  ));

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="black"
      variant="dark"
      className="navbar-fixed-top bg-sendary-extra"
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
                <Col className="col-auto me-auto">
                  <Nav className="me-auto">
                    <Nav.Link eventKey="2" as={NavLink} to="/dashboard">
                      Dashboard
                    </Nav.Link>
                    <Nav.Link eventKey="3" as={NavLink} to="/calendar">
                      Calendar
                    </Nav.Link>
                    <Nav.Link eventKey="4" as={NavLink} to="/workshop">
                      Workshop
                    </Nav.Link>
                  </Nav>

                  <Nav className="d-block d-lg-none me-auto">
                    <Nav.Link eventKey="4" as={Link} onClick={logout}>
                      Logout{" "}
                    </Nav.Link>
                  </Nav>
                </Col>

                <Col className="col-auto">
                  <Nav className="d-none d-lg-block justify-content-end">
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
                        <Dropdown.Item eventKey="12" as={Link} onClick={logout}>
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
