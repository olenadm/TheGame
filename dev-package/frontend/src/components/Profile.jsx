import React from "react";
import { useProfile } from "../contexts/ProfileContext";
import {
  Container,
  Card,
  ListGroup,
  Table,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const { profile, loading, error } = useProfile();

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error loading profile: {error.message}</div>;

  const renderProgress = () => {
    if (!profile || !profile.LessonProgress) return null;

    return Object.entries(profile.LessonProgress).map(
      ([lessonId, slideNumber]) => {
        const lesson = profile.CompletedLessons[lessonId] || "Unknown Lesson";
        const totalSlides = lesson.slideCount || 0;
        const progress =
          totalSlides > 0
            ? `${slideNumber + 1} of ${totalSlides} (${(
                (slideNumber / totalSlides) *
                100
              ).toFixed(1)}% complete)`
            : "No progress";

        return (
          <tr key={lessonId}>
            <td>{lesson.title}</td>
            <td>{progress}</td>
          </tr>
        );
      }
    );
  };

  return (
    <Container className="mt-5">
      <Header title="Profile" />
      <section className="section-dark section pt-4 lesson">
        <Row>
          <Col sm={6} >
            <Card className="p-3 h-100">
              <Card.Body>
                <ListGroup>
                  <ListGroup.Item
                    variant="dark"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <h3 className="my-0 align-items-center d-flex"> <FontAwesomeIcon icon={faUserAlt} style={{ marginRight: '9px', fontSize: '1rem' }}  /> Username:</h3>{" "}
                    <h3 className="my-0 text-color-change">{profile.Username}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item variant="info" className="d-flex justify-content-between align-items-start">
                    <div className="me-auto fw-bold">Completed Lessons:</div>
                    <Badge bg="primary" pill>
                      {Object.keys(profile.CompletedLessons).length}
                    </Badge>
                  </ListGroup.Item>
                  <ListGroup.Item variant="info" className="d-flex justify-content-between align-items-start">
                    <strong>Payment Plan:</strong>{" "}
                    <Badge bg="warning" pill>
                      {profile.Paid}
                    </Badge>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6}>
            <Card className="p-3 h-100">
              <Card.Header as="h4">Lesson Progress</Card.Header>
              <Card.Body>
                <Table
                  striped
                  bordered
                  hover
                  responsive
                  size="sm"
                  variant="dark"
                >
                  <thead>
                    <tr>
                      <th className="p-2">Lesson</th>
                      <th className="p-2">Progress</th>
                    </tr>
                  </thead>
                  <tbody>{renderProgress()}</tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </Container>
  );
};

export default Profile;
