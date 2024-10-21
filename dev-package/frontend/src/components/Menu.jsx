// src/components/Menu.js
import React from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap"; // Helps integrate React Router with Bootstrap
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Menu = (isLoggedIn) => {
  return (
    <Navbar
      variant="dark"
      expand="lg"
      fixed="top"
      collapseOnSelect
      className="color-change-nav py-1"
    >
      <Container fluid>
        <Navbar.Brand className="ps-lg-5" href="/">
          <img src="/images/logo2.png" alt="Backgammon Academy" />
          Backgammon Academy
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/lessons">
              <Nav.Link href='/lessons' eventKey="1">Lessons</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/drills">
              <Nav.Link eventKey="2">Drills/Exercises</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/glossary">
              <Nav.Link eventKey="3">Glossary</Nav.Link>
            </LinkContainer>
          </Nav>
          <Nav className="pe-lg-5">
            {isLoggedIn ? (
              <LinkContainer to="/profile">
                <Nav.Link eventKey="4"> <FontAwesomeIcon icon={faUser} style={{ marginRight: '7px', fontSize: '1rem' }}  /> Profile</Nav.Link>
              </LinkContainer>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Menu;
