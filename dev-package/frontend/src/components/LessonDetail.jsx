import React, { forwardRef, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Optional, for GitHub Flavored Markdown
import rehypeRaw from "rehype-raw"; // For rendering HTML inside Markdown
import { Tooltip as ReactTooltip } from "react-tooltip";
import Board from "./Board"; // Import the Board component
import BoardChoices from "./choices/BoardChoices";
import CombinatoricsOptions from "./options/CombinatoricsOptions";
import { useProfile } from "../contexts/ProfileContext";
import axios from "axios";
import { porpoise as theme } from "./theme";
import { backgammonPlayerNames } from "./players";
import "../styles/app.scss";
import "./LessonDetail.css";
import namer from "color-namer";
import DiceTable from "./DiceTable";
import RankChoices from "./choices/RankChoices";
import BooleanChoices from "./choices/BooleanChoices";
import ImgViewer from "./slides/ImgViewer";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "";

function getSimpleColorName(hexCode) {
  const result = namer(hexCode, { pick: ["pantone"] }).pantone;

  // Find the first color name that is only one word
  const simpleName = result.find((color) => color.name.split(" ").length === 1);

  return simpleName ? simpleName.name : result[0].name; // Fallback to first if none found
}
// Function to calculate luminance and determine if the color is "light"
const isLightColor = (hex) => {
  const rgb = hexToRgb(hex); // Convert hex to RGB
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.7; // Threshold to decide if the color is light (adjust if needed)
};

// Helper function to convert hex to RGB
const hexToRgb = (hex) => {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const replacePlaceholdersWithColor = (
  textOrArray,
  useName,
  playerColor,
  playerHex,
  playerName,
  opponentColor,
  opponentHex,
  opponentName
) => {
  // Helper function to replace placeholders in text
  const replaceInText = (text) => {
    // Determine background colors based on the luminance of the player and opponent colors
    const playerBgColor = isLightColor(playerHex) ? "#333" : "#f0f0f0";
    const opponentBgColor = isLightColor(opponentHex) ? "#333" : "#f0f0f0";

    // Apply text color, background color, bold text, padding, and rounded corners
    return text
      .replace(
        /{{player}}/g,
        `<span style="color: ${playerHex}; background-color: ${playerBgColor}; padding: 3px 6px; border-radius: 8px;"><strong>${
          useName ? playerName : playerColor
        }</strong></span>`
      )
      .replace(
        /{{opponent}}/g,
        `<span style="color: ${opponentHex}; background-color: ${opponentBgColor}; padding: 3px 6px; border-radius: 8px;"><strong>${
          useName ? opponentName : opponentColor
        }</strong></span>`
      );
  };

  // Check if the input is an array (for choices) or a string (for description, quote, hint)
  if (Array.isArray(textOrArray)) {
    // If it's an array, apply the replacement to each item in the array
    return textOrArray.map((item) => replaceInText(item));
  } else if (typeof textOrArray === "string") {
    // If it's a string, apply the replacement directly
    return replaceInText(textOrArray);
  } else {
    return textOrArray; // Return unchanged if neither string nor array
  }
};

const calculateCombinationsForNumber = () => {
  const diceFaces = [1, 2, 3, 4, 5, 6];
  const combinationsForNumber = {};
  const diceCombinations = {};

  diceFaces.forEach((die1) => {
    diceFaces.forEach((die2) => {
      const numbers = new Set([die1, die2, die1 + die2]);

      if (die1 === die2) {
        numbers.add(die1 * 2);
        numbers.add(die1 * 3);
        numbers.add(die1 * 4);
      }

      numbers.forEach((num) => {
        if (combinationsForNumber[num]) {
          combinationsForNumber[num] += 1;
          diceCombinations[num].push([die1, die2]);
        } else {
          combinationsForNumber[num] = 1;
          diceCombinations[num] = [[die1, die2]];
        }
      });
    });
  });

  return { combinationsForNumber, diceCombinations };
};

// GlossaryTerm component to handle glossary terms with tooltips
const GlossaryTerm = ({ term, definition, tooltipId }) => {
  return (
    <>
      <span
        className="glossary-term"
        data-tooltip-id={tooltipId} // Attach the tooltip ID
        style={{
          cursor: "pointer",
          textDecoration: "underline",
          color: "#007bff",
        }}
      >
        {term}
      </span>
      {/* Define the tooltip with the same ID */}
      <ReactTooltip
        id={tooltipId}
        place="top" // Set the placement
        content={definition} // Content for the tooltip
        effect="solid"
      />
    </>
  );
};

// SlideDescription component for rendering the description
const SlideDescription = ({ description }) => {
  return (
    <Card.Text className="description">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]} // Enable raw HTML rendering
        components={{
          span({ node, ...props }) {
            // Check if the span contains a glossary term
            if (props.className === "glossary-term") {
              const definition = props.title; // Get definition from the title attribute
              const term = node.children[0].value; // The glossary term itself
              const tooltipId = `tooltip-${term.replace(/\s+/g, "-")}`; // Create a unique ID for the tooltip
              return (
                <GlossaryTerm
                  term={term}
                  definition={definition}
                  tooltipId={tooltipId}
                />
              );
            }
            return <span {...props} />;
          },
        }}
      >
        {description}
      </ReactMarkdown>
    </Card.Text>
  );
};
const LessonDetail = () => {
  const { profile, refreshProfile } = useProfile();
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(-1);
  const [errorMessage, setErrorMessage] = useState("");
  const [bestMoveData, setBestMoveData] = useState(null);
  const [nextButtonEnabled, setNextButtonEnabled] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [resetOptionsFunction, setResetOptionsFunction] = useState(
    () => () => {}
  );

  const totalCombinations = 36;
  const [combinationsData, setCombinationsData] = useState(null);
  const [ourPlayer, oppPlayer] = backgammonPlayerNames
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);
  // Calculate the combinations data (moved from DiceTable)
  useEffect(() => {
    const result = calculateCombinationsForNumber();
    setCombinationsData(result);
  }, []);

  const slideComponents = {
    combinatorics: {
      component: DiceTable,
      getProps: (slide) => {
        return {
          combinationsData: combinationsData, // Pass combinationsData dynamically
          showCombinationsTable: slide.showCombinationsTable || false,
          showProbabilitiesTable: slide.showProbabilitiesTable || false,
          dynamic: slide.dynamic || false, //todo bad name, should be whether to allow user to continue without answering a question which is part of options. However combinatorics needs a way to automate the questions seperately
          // Any other props needed by DiceTable
        };
      },
    },
    image: {
      component: ImgViewer,
      getProps: (slide) => {
        console.log("slide = ", slide);
        return {
          imgSrc: slide.image,
        };
      },
    },
    board: {
      component: Board,
      getProps: (slide) => {
        console.log("slide = ", slide);
        return {
          xgid: slide.xgid,
          theme: {
            ...theme,
            showDice: slide?.showDice !== undefined ? slide.showDice : true, // Adjust showDice based on slide, default to true
          },
        };
      },
    },
    // Add other slide types here with their corresponding component and getProps if needed
  };
  const optionsComponentsMap = {
    combinatorics: {
      component: CombinatoricsOptions, // Custom options for combinatorics slides
      getProps: (slide) => ({
        choices: slide.choices,
        correct: slide.correct,
        hint: slide.hint,
        ShowComponent: slide.ShowComponent,
        combinationsData: combinationsData,
        onSelectionComplete: handleSelectionComplete,
        setValidationMessage: setValidationMessage,
        setResetOptionsFunction: setResetOptionsFunction,
        dynamic: slide.dynamic || false,
      }),
    },
    noop: {
      component: <></>,
      getProps: () => {
        return {};
      },
    },
    rank: {
      component: RankChoices,
      getProps: (slide) => {
        console.log("choices for rank ", slide.choices);
        return {
          choices: slide.choices,
          correctRanks: slide.rank,
          hint: slide.hint,
          onSelectionComplete: handleSelectionComplete,
          explanationMessage: {
            short: slide.hint,
          },
          // validationMessage: validationMessage,
          // setValidationMessage: setValidationMessage,
        };
      },
    },
    choice: {
      component: BooleanChoices,
      getProps: (slide) => {
        console.log("choices for choices ", slide.choices);
        return {
          choices: slide.choices,
          correct: slide.correct,
          hint: slide.hint,
          onSelectionComplete: handleSelectionComplete,
          explanationMessage: {
            short: slide.hint,
          },
          // validationMessage: validationMessage,
          // setValidationMessage: setValidationMessage,
        };
      },
    },
    // Add more mappings for other slide types
    board: {
      component: BoardChoices, // Default to BoardChoices
      getProps: (slide) => {
        return {
          choices: slide.choices,
          correct: slide.correct,
          correctRank: slide.rank,
          moveData: bestMoveData,
          hint: slide.hint,
          showBestMove: slide.ShowBestMove,
          ShowComponent: slide.ShowComponent,
          onSelectionComplete: handleSelectionComplete,
          setResetOptionsFunction: setResetOptionsFunction,
          dynamic: slide.dynamic || false,
          validationMessage: validationMessage,
          setValidationMessage: setValidationMessage,
          explanationMessage: {
            short: slide.hint,
          },
        };
      },
    },
  };
  useEffect(() => {
    theme.topPlayer = oppPlayer;
    theme.bottomPlayer = ourPlayer;
    axios
      .get(`${apiBaseUrl}/api/v1/lessons/${lessonId}`, {
        withCredentials: true,
      })
      .then((response) => {
        const fetchedLesson = response.data.lesson;
        const useName = true;
        const playerColor = getSimpleColorName(theme.ourCheckerColor);
        const opponentColor = getSimpleColorName(theme.oppCheckerColor);
        const playerName = theme.bottomPlayer;
        const opponentName = theme.topPlayer;
        const updatedSlides = fetchedLesson.slides.map((slide) => ({
          ...slide,
          description: replacePlaceholdersWithColor(
            slide.description,
            useName,
            playerColor,
            theme.ourCheckerColor,
            playerName,
            opponentColor,
            theme.oppCheckerColor,
            opponentName
          ),
          quote: replacePlaceholdersWithColor(
            slide.quote,
            useName,
            playerColor,
            theme.ourCheckerColor,
            playerName,
            opponentColor,
            theme.oppCheckerColor,
            opponentName
          ),
          hint: replacePlaceholdersWithColor(
            slide.hint,
            useName,
            playerColor,
            theme.ourCheckerColor,
            playerName,
            opponentColor,
            theme.oppCheckerColor,
            opponentName
          ),
          choices: replacePlaceholdersWithColor(
            slide.choices,
            useName,
            playerColor,
            theme.ourCheckerColor,
            playerName,
            opponentColor,
            theme.oppCheckerColor,
            opponentName
          ), // Handle choices array
        }));

        setLesson({ ...fetchedLesson, slides: updatedSlides });
        setCurrentSlide(-1); // Start with the intro slide
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.error || "Error fetching lesson");
      });
  }, [lessonId, theme]);

  useEffect(() => {
    if (currentSlide >= 0 && currentSlide < lesson?.slides?.length) {
      const slide = lesson.slides[currentSlide];
      if (slide?.move) {
        axios
          .post(
            `${apiBaseUrl}/api/v1/getmoves`,
            { args: slide.move },
            { withCredentials: true }
          )
          .then((response) => setBestMoveData(response.data))
          .catch((err) => console.error("Error fetching best moves:", err));
      }
    }
  }, [currentSlide, lesson]);

  const handleSelectionComplete = () => {
    setNextButtonEnabled(true);
  };

  const nextSlide = () => {
    setValidationMessage("");
    slide.dynamic ? setNextButtonEnabled(false) : setNextButtonEnabled(true);
    // setNextButtonEnabled(false);

    if (currentSlide === -1) {
      setCurrentSlide(0);
    } else if (lesson && currentSlide < lesson.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      axios
        .post(
          `${apiBaseUrl}/api/v1/lessons/${lessonId}/progress`,
          { currentSlide: currentSlide + 1 },
          { withCredentials: true }
        )
        .then(() => {
          refreshProfile(); // Update the profile
        })
        .catch((err) => console.error("Error updating progress:", err));

      // Reset options state when going to a new slide
      resetOptionsFunction(); // Call the reset function here
    } else if (currentSlide === lesson.slides.length - 1) {
      setCurrentSlide(lesson.slides.length); // Go to the final "congratulations" slide
    }
  };

  const navigateToDrills = () => navigate("/drills");

  if (errorMessage) return <Alert variant="danger">{errorMessage}</Alert>;
  if (!lesson) return <div>Loading...</div>;

  const slide = lesson.slides?.[currentSlide] || {};
  //need to look into purifying the markdown.
  // const safeHtml = DOMPurify.sanitize(markdownContent);
  // 2. Get the component for the slide type, default to Board if not found
  let SlideComponentObj;
  let optionsComponentData;
  console.log("slide ", slide, slide.rank === "");
  if (slide.slideType === "image") {
    console.log("slide is image. Setting component");
    SlideComponentObj = slideComponents["image"];
    optionsComponentData = optionsComponentsMap["noop"];
  } else if (slide.correct) {
    SlideComponentObj = slideComponents[slide?.slideType]; //implicitaally assume we want a rank question
    optionsComponentData = optionsComponentsMap["choice"];
  } else if (slide.rank !== "") {
    SlideComponentObj = slideComponents[slide?.slideType]; //implicitaally assume we want a rank question
    optionsComponentData = optionsComponentsMap["rank"];
  } else {
    console.log("alternative slide type ", slide?.slideType);
    SlideComponentObj = slide?.ShowComponent
      ? slideComponents[slide?.slideType] || slideComponents["board"]
      : null;
    optionsComponentData = slide?.ShowComponent
      ? optionsComponentsMap[slide.slideType] || optionsComponentsMap["board"]
      : null;
  }
  const SlideComponent = SlideComponentObj?.component;
  const slideComponentProps = SlideComponentObj?.getProps
    ? SlideComponentObj?.getProps(slide)
    : {};

  const OptionsComponent = optionsComponentData?.component;
  const optionsProps = optionsComponentData?.getProps(slide);

  return (
    <Container>
      <section className="section-dark section pt-4 lesson">
        <Card className="mt-4">
          <Card.Header>
            <Row className="align-items-center justify-content-between">
              <Col xs={5} md={3} className="text-start">
                <button
                  onClick={() => navigate("/lessons")}
                  className="btn btn-primary"
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    style={{ marginRight: "7px", fontSize: "1rem" }}
                  />{" "}
                  Back to Lessons
                </button>
              </Col>

              {/* XGID and current slide info aligned in the center */}
              <Col xs={2} md={6} className="text-center">
                {/*<pre>{slide?.xgid}</pre>*/}
                <span>
                  {currentSlide + 1} / {lesson?.slides?.length}
                </span>
              </Col>

              {/* Next Slide button aligned to the right */}
              <Col xs={5} md={3} className="text-end">
                <button
                  onClick={nextSlide}
                  disabled={slide.ShowComponent && !nextButtonEnabled}
                  className="btn btn-primary"
                >
                  Next Slide{" "}
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    style={{ marginLeft: "7px", fontSize: "1rem" }}
                  />
                </button>
              </Col>
            </Row>
          </Card.Header>
          {currentSlide === -1 ? (
            <Card.Body>
              <Row>
                <Col>
                  <h2 className="mb-3">
                    {" "}
                    {/*<button onClick={() => navigate('/lessons')} className="custom-secondary-button">Back to Lessons</button>*/}
                    Lesson {lessonId} - {lesson.title} - {currentSlide + 1} /{" "}
                    {lesson?.slides?.length}
                    {/*<button onClick={nextSlide} disabled={slide.ShowComponent && !nextButtonEnabled} className="custom-secondary-button">Next Slide</button>*/}
                    {/*<pre>{slide?.xgid}</pre>*/}
                  </h2>
                </Col>
              </Row>
              <Row>
                <Col md={7}>
                  <div className="description p-4">
                    <Card.Text>{lesson.description}</Card.Text>
                    <button
                      onClick={nextSlide}
                      className="mb-2 mb-md-0 mt-md-4 py-2 custom-primary-button color-change-nav"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="bi bi-circle-fill contact-us-circle"
                        viewBox="0 0 16 16"
                      >
                        <circle cx="8" cy="8" r="8"></circle>
                      </svg>
                      <span className="px-3">Start Lesson</span>
                    </button>
                  </div>
                </Col>
                <Col md={5}>
                  <img
                    src="/images/character-checker.png"
                    className="img-fluid character"
                    alt="Start a lesson"
                  />
                </Col>
              </Row>
            </Card.Body>
          ) : currentSlide === lesson.slides.length ? (
            <Card.Body>
              <h2 className="mb-3">Congratulations</h2>
              <Card.Text>
                You have completed this lesson. Now go and practice with some
                drills!
              </Card.Text>
              <button
                className="custom-primary-button  color-change-nav"
                onClick={navigateToDrills}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-circle-fill contact-us-circle"
                  viewBox="0 0 16 16"
                >
                  <circle cx="8" cy="8" r="8"></circle>
                </svg>
                Go to Drills
              </button>
            </Card.Body>
          ) : (
            <Card.Body>
              <Row>
                <Col>
                  <h2 className="mb-3">
                    Lesson {lessonId} - {lesson.title}
                  </h2>
                </Col>
              </Row>
              <Row>
                <Col md={8}>
                  {SlideComponent ? (
                    <SlideComponent {...slideComponentProps} />
                  ) : (
                    slide.quote && (
                      <Card.Text className="quote">
                        <ReactMarkdown
                          className="blockquote"
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]} // Enable raw HTML rendering
                        >
                          {slide.quote}
                        </ReactMarkdown>
                      </Card.Text>
                    )
                  )}
                </Col>
                <Col md={4} className="info-container">
                  {SlideComponent && slide.quote && (
                    <Card.Text className="quote">
                      <ReactMarkdown
                        className="blockquote"
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]} // Enable raw HTML rendering
                      >
                        {slide.quote}
                      </ReactMarkdown>
                    </Card.Text>
                  )}
                  {slide.description && (
                    <SlideDescription
                      description={slide.description}
                    ></SlideDescription>
                  )}
                  {slide.ShowComponent && OptionsComponent && (
                    <OptionsComponent {...optionsProps} />
                  )}
                </Col>
              </Row>
            </Card.Body>
          )}
        </Card>
      </section>
    </Container>
  );
};

export default LessonDetail;
