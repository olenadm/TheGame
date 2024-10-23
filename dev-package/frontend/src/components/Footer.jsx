import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
const Footer = (isLoggedIn) => {
  return (
    <section className="footer mt-auto">
      <Container className="py-2">
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start">
            {" "}
            <a className="navbar-brand text-color-change" href="/">
              <img src="/images/logo.png" alt="Backgammon Academy" />
              Backgammon Academy
            </a>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <FontAwesomeIcon icon={faPaperPlane} />
            <a href="/">Get in touch</a>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default Footer;
