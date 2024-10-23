import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import "../styles/app.scss";
import { useProfile } from "../contexts/ProfileContext";
import Header from "./Header";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "";

const DrillList = () => {
  const { profile } = useProfile(); // Use the context
  const [glossary, setGlossary] = useState([]); // Store glossary terms (drills topics)
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch glossary terms from backend
    axios
      .get(`${apiBaseUrl}/api/v1/glossary?filter=filter`, {
        withCredentials: true,
      })
      .then((response) => {
        setGlossary(response.data); // Set the glossary data (drill topics)
      })
      .catch((error) => console.error("Error fetching glossary:", error));
  }, []);

  const handleDrillClick = (item) => {
    // Navigate to the specific drill (glossary item)
    navigate(`/drills/${item?.id}?section=${item.term}`);
  };

  const getRequiredPlan = () => {
    // For now, we’ll assume drills are free for all users
    return 4; // Placeholder, assuming all drills are free for basic users
  };

  const renderDrills = () => {
    return glossary?.map((item) => {
      const isPaid = profile && profile.Paid >= getRequiredPlan(); // Check if user has access
      return (
        <Col md={4} key={item.id} className="mb-3">
          <Card
            className="drill-card h-100"
            onClick={() => handleDrillClick(item)}
          >
            <Card.Body>
              <Card.Title className="drill-title text-color-change">
                {item.term}
                {!isPaid && (
                  <FontAwesomeIcon
                    icon={faLock}
                    style={{ marginRight: "10px", color: "red" }}
                  />
                )}
              </Card.Title>
              <Card.Text>{item.final_definition}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      );
    });
  };

  return (
    <Container className="mt-5">
      <Header
        title="Drills are a great way to hone your skills once you have completed
            your lessons"
        txt=" Each drill is categorised based on things you will learn during
              the lesson plans, but its best you learn the way that works for
              you"
        img="character-evil.png"
      />
      <section class="section-dark section pt-3 lessons drills">
        <Row>
          <Col smxs={12} className=" mb-3 text-start">
            <h5 className="d-inline-block ms-4">Drill Count: </h5>{" "}
            <span className="color-change-nav me-0 circle ms-2">
              {glossary?.length}
            </span>
          </Col>
        </Row>
        <Row>{renderDrills()}</Row>
      </section>
    </Container>
  );
};

export default DrillList;
