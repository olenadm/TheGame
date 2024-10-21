// src/components/Login.js
import React, { useState } from "react";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext"; // Import profile context

import "./Login.css"; // Import the CSS file for the Home component
import Header from "./Header";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "";

const Login = ({ onLoginSuccess }) => {
  // Receive the onLoginSuccess callback
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { refreshProfile } = useProfile(); // Access refreshProfile from context

  const handleLogin = () => {
    axios
      .get(`${apiBaseUrl}/api/v1/login`, { withCredentials: true })
      .then((response) => {
        refreshProfile(); // Reload profile after successful login
        onLoginSuccess(); // Call the login success handler to update isLoggedIn
        navigate("/lessons");
      })
      .catch(() => {
        setError("Login failed. Please try again.");
      });
  };

  

  return (
    <Container className="mt-lg-5 mt-4">
      <Header title="Please log in" />
      {error && (
        <Row>
          <Col>
            <Alert key="warning" variant="warning">
            <img src='images/dice-game.png' alt='' className="character" /> {error}
            </Alert>
          </Col>
        </Row>
      )}
       

      <section className="section-dark section pt-3 login">
        <Row className="position-relative mx-lg-4">
          <Col md={6}>
            <img
              src="/images/character-board-3.png"
              alt="Backgammon game"
              className="position-absolute character"
            />
            <Card className="me-4">
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>
              </Form>
              <button
                className="btn-outline-secondary mb-2 mb-md-0 mt-md-4 py-2 custom-primary-button color-change-nav"
                onClick={handleLogin}
              >
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-circle-fill contact-us-circle"
                  viewBox="0 0 16 16"
                >
                  <circle cx="8" cy="8" r="8"></circle>
                </svg>
                <span className="px-3">Login</span>
              </button>
            </Card>
          </Col>
        </Row>
      </section>
    </Container>
  );
};

export default Login;
