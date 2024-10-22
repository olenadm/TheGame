import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// import DiceTable from "./DiceTable";

const Home = () => {
  const navigate = useNavigate();
  const navigateToLessons = () => navigate("/lessons");
  const myStyle = {
    backgroundImage: "url('/images/home-page-hero-bg-grid-ch1.svg') ",
    backgroundRepeat: "repeat-y",
    backgroundSize: "4500px",
    backgroundPosition: "center top",
  };
  return (
    <>
      <section className="section-dark hero borderBottom">
        <div className="section" style={myStyle}>
          <Container >
            <Row className="align-items-center">
              <Col md={6} className="px-xl-4">
                <h1 className="heading mb-lg-5 mb-3 mt-5 mt-lg-3">
                  Learn to Master{" "}
                  <span className="text-color-change">Backgammon</span>
                </h1>

                <Row className="mb-3 mb-lg-4 text-left stroke-text">
                  <Col lg={5} className="px-xl-4">
                    <Row className="align-items-center">
                      <Col xs={7} md={5} lg={7}>
                        <h2 className="stroke-color-change">5000</h2>
                      </Col>
                      <Col xs={5}>
                        <span>Years of history</span>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={3}>
                    <Row className="align-items-center">
                      <Col xs={5}>
                        <h2 className="stroke-color-change">80</h2>
                      </Col>
                      <Col xs={7}>
                        <span>
                          {" "}
                          <strong>+</strong> Lessons
                        </span>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={3}>
                    <Row className="align-items-center">
                      <Col xs={5}>
                        <h2 className="stroke-color-change">30</h2>
                      </Col>
                      <Col xs={7}>
                        <span>Drills</span>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <p className="text-content">
                  Backgammon Academy is the ultimate platform to improve your
                  backgammon skills. Dive deep into strategies, tactics, and
                  learn from the best.
                </p>
                <button
                  className="btn-outline-secondary mb-2 mb-md-0 mt-md-4 py-2 custom-primary-button color-change-nav"
                  onClick={navigateToLessons}
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
                  <span className="px-3">Start learning now!</span>
                </button>
              </Col>
              <Col md={6} className="px-xl-4 position-relative">
                <img
                  src="/images/bg-club-laughing.jpg"
                  alt="Backgammon game"
                  className="float-md-end mt-3"
                />
                <img
                  src="/images/board-character.png"
                  alt="Backgammon game"
                  className="position-absolute character"
                />
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      <section className="section section-light borderBottom">
        <Container>
          <Row className="align-items-center">
            <Col md={5} className="px-xl-4">
              <img src="/images/game.jpg" alt="Backgammon social" />
            </Col>
            <Col md={7} className="px-xl-4">
              <h2 className="heading text-start mb-lg-5 mb-3 mt-5 mt-lg-3">
                Why <span className="text-color-change">Backgammon Academy</span>?
              </h2>
              <p className="text-content">
                Our lesson plans are carefully curated and structured so that
                you learn at your pace. With every lesson we have practice
                drills for you to challenge yourself against.
              </p>
              <button className="btn-outline-secondary mb-2 mb-md-0 mt-md-4 py-2 custom-primary-button color-change-nav">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-circle-fill contact-us-circle"
                  viewBox="0 0 16 16"
                >
                  <circle cx="8" cy="8" r="8"></circle>
                </svg>
                <span className="px-3">Find Out more</span>
              </button>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section section-dark borderBottom">
        <Container>
          <Row className="align-items-center">
            <Col md={7} className="px-lg-4">
              <h2 className="heading mb-lg-5 mb-3  mt-lg-3 text-start">
                Beautiful <span className="text-color-change">interactive boards</span> to learn from
              </h2>
              <p className="text-content">
                The boards we use allow you to really understand why a move is
                better than another
              </p>
            </Col>
            <Col md={5} className="px-lg-4">
              <img src="/images/bg-cocktails.jpg" alt="Backgammon board" className="float-md-end mt-3" />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section section-light">
        <Container>
          <Row className="align-items-center">
            <Col md={5} className="px-lg-4">
              <img src="/images/bg-academy.png" alt="Backgammon board" className='img-fluid' />
            </Col>
            <Col md={7} className="px-lg-4">
              <h2 className="heading text-start mb-lg-5 mb-3 mt-5 mt-lg-3">AI powered decisions</h2>
              <p className="text-content">
                Our backgammon engine is one of the best out there. As a result
                you will get to see how good your moves are compared to the best
                of the best. Not only that, using the latest AI we not only show
                you <em>what</em> is the best move, but <em>why</em> its the
                best move.
              </p>
              <button className="btn-outline-secondary mb-2 mb-md-0 mt-md-4 py-2 custom-primary-button color-change-nav">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-circle-fill contact-us-circle"
                  viewBox="0 0 16 16"
                >
                  <circle cx="8" cy="8" r="8"></circle>
                </svg>
                <span className="px-3">Find Out more</span>
              </button>
            </Col>
          </Row>
        </Container>
      </section>
    
    </>
  );
};

export default Home;
