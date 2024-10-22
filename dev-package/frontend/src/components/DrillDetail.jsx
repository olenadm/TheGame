import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Container, Card, Col, Row } from "react-bootstrap";
import Board from "./Board"; // Import the Board component
import BoardChoices from "./choices/BoardChoices"; // Import Options
import axios from "axios";
import { porpoise as theme } from "./theme";
import "../styles/app.scss";
import "./DrillDetail.css";
import BglogContext from "../contexts/BgLogContext";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "";
const DrillDetail = () => {
  const { glossaryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const section = queryParams.get("section"); // Get the 'section' query parameter

  const [drill, setDrill] = useState(null);
  const [bestMoveData, setBestMoveData] = useState(null);
  const [explanationData, setExplanationData] = useState(null);
  const [nextButtonEnabled, setNextButtonEnabled] = useState(false); // Control the next button
  const [resetOptionsFunction, setResetOptionsFunction] = useState(null); // For resetting options
  const [validationMessage, setValidationMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { bglogLoaded } = useContext(BglogContext);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "";

  // Utility function to fetch drill and move data
  const fetchDrillAndMoves = async (glossaryId) => {
    try {
      // Fetch the drill (random position) from the backend
      const drillResponse = await axios.get(
        `${apiBaseUrl}/api/v1/position/glossary?id=${glossaryId}`,
        { withCredentials: true }
      );
      const drillData = drillResponse.data;

      setDrill(drillData);

      // Fetch the best moves for this drill (position)
      const moveResponse = await axios.post(
        `${apiBaseUrl}/api/v1/getmoves`,
        { args: drillData.Position },
        { withCredentials: true }
      );
      const moves = moveResponse.data;

      setBestMoveData(moves);

      // Now call the explain API with the first move and the board
      const explainData = {
        args: {
          ...drillData?.Position,
        },
        move: moves[0],
        comment: drillData?.Comment,
      };

      console.log("explain this:", explainData);
      // Call the explain endpoint
      const explanationResponse = await axios.post(
        `${apiBaseUrl}/api/v1/explain`,
        explainData,
        { withCredentials: true }
      );
      console.log("explanation ", explanationResponse.data);
      if (explanationResponse?.data.length > 0) {
        setExplanationData(explanationResponse.data[0]);
      }
    } catch (error) {
      console.error("Error fetching drill and moves:", error);
    }
  };

  useEffect(() => {
    if (!loading) {
      // Only fetch if not already loading
      fetchDrillAndMoves(glossaryId);
    }
  }, [glossaryId, loading]);

  const handleSelectionComplete = () => {
    setNextButtonEnabled(true); // Enable the "Next Drill" button when the user has completed the selection
  };

  const nextDrill = () => {
    setValidationMessage(""); // Hide the validation message
    setNextButtonEnabled(false); // Disable the next button for the new drill

    fetchDrillAndMoves(glossaryId); // Fetch the next random drill and moves

    if (resetOptionsFunction) {
      resetOptionsFunction(); // Reset options state for the new drill
    }
  };

  if (!drill) return <div>Loading...</div>;

  return (
    <Container>
      <section className="section-dark section pt-4 lesson">
      <Card className="mt-4">
      <Card.Header>
        <Row className="align-items-center justify-content-between">
          <Col xs={6}>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/drills")}
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                style={{ marginRight: "7px", fontSize: "1rem" }}
              />
              Back to Drills
            </button>
          </Col>
          <Col xs={6} className='text-end'>
          <button
                  className="btn btn-primary"
                  onClick={nextDrill}
                  disabled={false}
                >
                  Next Drill
                  <FontAwesomeIcon
                icon={faArrowRight}
                style={{ marginLeft: "7px", fontSize: "1rem" }}
              />
                </button>
          </Col>
        </Row>
        </Card.Header>
        
         
          <Card.Body>
          <h2 className='mb-3'>Drill Practice - {section}</h2>
            <Row>
              <Col md={8} className="board-container">
                <Row>
                  {drill.XGID && <Board xgid={drill.XGID} theme={theme} />}{" "}
                  {/* Display the board */}
                </Row>
               
              </Col>
              <Col md={4} className="info-container">
                <Card.Text>{drill.Comment}</Card.Text> {/* Drill description */}
               
                {bglogLoaded && (
                  <BoardChoices
                    moveData={bestMoveData}
                    hint={drill.Comment}
                    showBestMove={true} // Always show the best move
                    ShowComponent={true} // Since it's a drill, we always show the board
                    onSelectionComplete={handleSelectionComplete} // When user completes the selection
                    setResetOptionsFunction={setResetOptionsFunction} // Reset options for new drill
                    validationMessage={validationMessage}
                    setValidationMessage={setValidationMessage}
                    explanationMessage={explanationData}
                  />
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </section>
    </Container>
  );
};

export default DrillDetail;
