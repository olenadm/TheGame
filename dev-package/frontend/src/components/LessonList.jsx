// src/components/LessonList.js
import React, { useEffect, useState } from "react";
import { Accordion, Card, Row, Col, Container } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faCheck } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "react-bootstrap/ProgressBar";
import "../styles/app.scss";
import "./LessonList.css";
import { useProfile } from "../contexts/ProfileContext"; // Import the CSS file for the Home component
import Header from "./Header";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "";
const LessonList = () => {
  const { profile, refreshProfile } = useProfile(); // Use the context

  const [lessons, setLessons] = useState({
    basicconcepts: [],
    gameplans: [],
    advanced: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch lessons from backend
    axios
      .get(`${apiBaseUrl}/api/v1/lessons`, { withCredentials: true })
      .then(async (response) => {
        const lessonsData = response.data;
        // Organize lessons by section
        const organizedLessons = {
          basicconcepts: lessonsData.filter(
            (l) => l.section === "basicconcepts"
          ),
          gameplans: lessonsData.filter((l) => l.section === "gameplans"),
          advanced: lessonsData.filter((l) => l.section === "advanced"),
        };
        await setLessons(organizedLessons);
      })
      .catch((error) => console.error("Error fetching lessons:", error));
  }, []);

  const handleLessonClick = (lessonId) => {
    navigate(`/lessons/${lessonId}`);
  };

  const getRequiredPlan = (lesson) => {
    switch (lesson.section) {
      case "basicconcepts":
        return 4; // FreeUser
      case "gameplans":
        return 5; // GamePlans
      case "advanced":
        return 6; // Advanced
      default:
        return 0;
    }
  };

  const renderLessons = (lessonArray) => {
    return lessonArray.map((lesson) => {
      const isPaid = profile && profile.Paid >= getRequiredPlan(lesson);
      const progress = profile ? profile.LessonProgress[lesson.id] || 0 : 0;
      const totalSlides = lesson.slideCount || 0; // Get the total slides from lesson

      return (
        <Col md={4} key={lesson.id} className="mb-3">
          <Card
            className="lesson-card mb-3 h-100"
            onClick={() => handleLessonClick(lesson.id)}
          >
            <Card.Body>
              <Card.Title className="lesson-title">
                <span className='color-change-nav circle'>{lesson.id}</span> {lesson.title}
                {!isPaid && (
                  <FontAwesomeIcon
                    icon={faLock}
                    style={{ marginLeft: "10px", color: "red", fontSize:'1rem' }}
                  />
                )}
              </Card.Title>
              <Card.Text>{lesson.description}</Card.Text>
              {/* Display progress */}
              <div className="progress-container">
                {totalSlides > 0 ? (
                  <>
                    <ProgressBar
                      striped
                      now={((progress / totalSlides) * 100).toFixed(1)}
                      className="progress-bar-custom"
                      // variant="success" // You can change this to "info", "warning", "danger", or use custom color
                    />
                    {/*<span className="ml-2">Slide {progress + 1} of {totalSlides}</span>*/}
                  </>
                ) : (
                  <span className="ml-2">{totalSlides} slides</span>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      );
    });
  };
  // if (!profile) return <div>Loading profile...</div>;
  return (
    <Container className="mt-5">
      <Header
        title="Our lessons have been carefully curated and categorised."
        subTitle="Depending on your level we recommend you start at the top!"
        txt="Some lessons will require you to have completed other lessons. We
            realise that everyone's level is different but it can only do you
            good to practice those skills!"
      />

      <section class="section-dark section pt-3 lessons">
        <Row>
          <Col>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header> <FontAwesomeIcon
                      icon={faCheck}
                      style={{ marginRight: "15px", color: 'green' }}
                    /> Basic Concepts</Accordion.Header>
                <Accordion.Body>
                  <Row>{renderLessons(lessons.basicconcepts)}</Row>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  {!(profile?.Paid > 4) && (
                    <FontAwesomeIcon
                      icon={faLock}
                      style={{ marginRight: "15px" }}
                    />
                  )}
                  Game Plans
                </Accordion.Header>
                <Accordion.Body>
                  <Row>{renderLessons(lessons.gameplans)}</Row>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  {!(profile?.Paid > 5) && (
                    <FontAwesomeIcon
                      icon={faLock}
                      style={{ marginRight: "15px" }}
                    />
                  )}
                  Advanced
                </Accordion.Header>
                <Accordion.Body>
                  <Row>{renderLessons(lessons.advanced)}</Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </section>
    </Container>
  );
};

export default LessonList;
