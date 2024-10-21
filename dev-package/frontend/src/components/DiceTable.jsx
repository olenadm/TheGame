import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DiceTable.css"; // Custom CSS for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiceOne,
  faDiceTwo,
  faDiceThree,
  faDiceFour,
  faDiceFive,
  faDiceSix,
} from "@fortawesome/free-solid-svg-icons";

const getDiceIcon = (face, axis) => {
  const color = axis === "horizontal" ? "#dcd19b" : "#d1615d"; // Blue for horizontal, green for vertical
  const size = "2x"; // Font Awesome size modifier (makes icons bigger)

  switch (face) {
    case 1:
      return (
        <FontAwesomeIcon
          icon={faDiceOne}
          style={{
            color,
            fontSize: "2rem",
            paddingTop: "3px",
            paddingLeft: "3px",
          }}
        />
      );
    case 2:
      return (
        <FontAwesomeIcon
          icon={faDiceTwo}
          style={{
            color,
            fontSize: "2rem",
            paddingTop: "3px",
            paddingLeft: "3px",
          }}
        />
      );
    case 3:
      return (
        <FontAwesomeIcon
          icon={faDiceThree}
          style={{
            color,
            fontSize: "2rem",
            paddingTop: "3px",
            paddingLeft: "3px",
          }}
        />
      );
    case 4:
      return (
        <FontAwesomeIcon
          icon={faDiceFour}
          style={{
            color,
            fontSize: "2rem",
            paddingTop: "3px",
            paddingLeft: "3px",
          }}
        />
      );
    case 5:
      return (
        <FontAwesomeIcon
          icon={faDiceFive}
          style={{
            color,
            fontSize: "2rem",
            paddingTop: "3px",
            paddingLeft: "3px",
          }}
        />
      );
    case 6:
      return (
        <FontAwesomeIcon
          icon={faDiceSix}
          style={{
            color,
            fontSize: "2rem",
            paddingTop: "3px",
            paddingLeft: "3px",
          }}
        />
      );
    default:
      return "";
  }
};

const getColorForProbability = (probability, maxProbability) => {
  // Map the probability to the hue (120 for green, 0 for red), scaling based on maxProbability
  const hue = 120 - (probability / maxProbability) * 120;
  return `hsl(${hue}, 50%, 50%)`; // Adjust saturation and lightness as needed
};
const DiceTable = ({
  combinationsData,
  showCombinationsTable,
  showProbabilitiesTable,
}) => {
  const diceFaces = [1, 2, 3, 4, 5, 6];
  const totalCombinations = 36;
  const [highlightedNumber, setHighlightedNumber] = useState(null);
  const { combinationsForNumber, diceCombinations } = combinationsData;

  // Helper function to check if the current dice combination contributes to the highlighted number
  const isHighlighted = (die1, die2) => {
    if (!highlightedNumber) return false;
    const validCombinations = diceCombinations[highlightedNumber] || [];
    return validCombinations.some(
      ([d1, d2]) => (d1 === die1 && d2 === die2) || (d1 === die2 && d2 === die1)
    );
  };

  // Handler to show dice combinations for the highlighted row
  const handleRowHover = (number) => {
    setHighlightedNumber(number);
  };

  const clearHighlight = () => {
    setHighlightedNumber(null);
  };

  return (
    <Row>
      {showCombinationsTable && (
        <Col md={showProbabilitiesTable ? 6 : 12}>
          {/*<h2>Dice Combinations Table</h2>*/}
          <table className="dice-table table-responsive">
            <thead>
              <tr>
                <th></th>
                {diceFaces.map((face) => (
                  <th
                    key={`head-${face}`}
                    className={`die-face-header die-face-${face}`}
                  >
                    {getDiceIcon(face, "horizontal")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {diceFaces.map((die1) => (
                <tr key={`row-${die1}`}>
                  <td className={`die-face-header die-face-${die1}`}>
                    {getDiceIcon(die1, "vertical")}
                  </td>
                  {diceFaces.map((die2) => (
                    <td
                      key={`cell-${die1}-${die2}`}
                      className={isHighlighted(die1, die2) ? "highlighted" : ""}
                    >
                      {/* Use FontAwesomeIcon for dice faces */}

                      {getDiceIcon(die2, "horizontal")}
                      {getDiceIcon(die1, "vertical")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Col>
      )}

      {showProbabilitiesTable && (
        <Col md={showCombinationsTable ? 6 : 12}>
          {/*<h2>Hitting a number</h2>*/}
          <table className="dice-table table-responsive">
            <thead>
              <tr>
                <th>Number</th>
                <th>Number of Combinations</th>
                <th>Probability (%)</th>
                <th>Estimated Probability (%)</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(combinationsForNumber)
                .sort((a, b) => a - b)
                .map((number) => {
                  const combinations = combinationsForNumber[number];
                  const probability = (combinations / totalCombinations) * 100;
                  const estimatedProbability = combinations * 2.5;
                  const maxCombinations = Math.max(
                    ...Object.values(combinationsForNumber)
                  );
                  const maxProbability =
                    (maxCombinations / totalCombinations) * 100;

                  return (
                    <tr
                      key={number}
                      onMouseEnter={
                        showCombinationsTable
                          ? () => handleRowHover(number)
                          : null
                      }
                      onMouseLeave={clearHighlight}
                      className={
                        highlightedNumber === number ? "highlighted-row" : ""
                      }
                    >
                      <td>{number}</td>
                      <td>{combinations}</td>
                      <td
                        style={{
                          color: getColorForProbability(
                            probability,
                            maxProbability
                          ),
                          fontWeight: "bold",
                        }}
                      >
                        {probability.toFixed(2)}%
                      </td>
                      <td
                        style={{
                          color: getColorForProbability(
                            estimatedProbability,
                            maxProbability
                          ),
                          fontWeight: "bold",
                        }}
                      >
                        {estimatedProbability.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </Col>
      )}
    </Row>
  );
};

export default DiceTable;
