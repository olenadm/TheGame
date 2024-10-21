import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
const Footer = (isLoggedIn) => {
  return (
    <Container className="py-2 footer" fluid>
      <Row className="align-items-center px-xl-5 px-4">
        <Col md={6}  className="text-center text-md-start">
          {" "}
          <a className="navbar-brand text-color-change" href="/">
            <img src="/images/logo.png" alt="Backgammon Academy" />
            Backgammon Academy
          </a>
        </Col>
        <Col md={6} className="text-center text-md-end">
          <FontAwesomeIcon icon={faPaperPlane}  />
          <a href="/">Get in touch</a>
        </Col>
      </Row>
    </Container>
  );
};
export default Footer;
