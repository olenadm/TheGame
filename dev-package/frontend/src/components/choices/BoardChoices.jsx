import React, { useState, useEffect } from 'react';
import { Button, Card, Table, Collapse } from 'react-bootstrap'; // Added Collapse for toggling explanation
import Form from 'react-bootstrap/Form';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCheck } from '@fortawesome/free-solid-svg-icons';

import '../../styles/app.scss'
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import RankChoices from "../choices/RankChoices";
import BooleanChoices from "../choices/BooleanChoices";
const BoardChoices = ({
                    choices,
                    correct,
                    correctRank,
                    moveData,
                    hint,
                    showBestMove,
                    ShowComponent,
                    onSelectionComplete,
                    setResetOptionsFunction,
                    validationMessage,
                    explanationMessage,
                    setValidationMessage,
                 }) => {
    const [randomMoves, setRandomMoves] = useState([]);
    const [randomChoices, setRandomChoices] = useState([]);
    const [highlightedMove, setHighlightedMove] = useState(null);
    const [correctMove, setCorrectMove] = useState(null);
    const [showHint, setShowHint] = useState(false);
    const [selectionValidated, setSelectionValidated] = useState(false);
    const [selectedMove, setSelectedMove] = useState(null);
    // const [selectedChoice, setSelectedChoice] = useState(null);/**/
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showEquityInfo, setShowEquityInfo] = useState(false); // For equity info
    const [bestMoveRevealed, setBestMoveRevealed] = useState(false); // Track best move reveal
    const [showLongExplanation, setShowLongExplanation] = useState(false); // Toggle between short and long explanation

    useEffect(() => {
        setResetOptionsFunction(() => () => {
            setRandomMoves([]);
            setRandomChoices([]);
            setHighlightedMove(null);
            setCorrectMove(null);
            setShowHint(false);
            setValidationMessage('');
            setSelectionValidated(false);
            setSelectedMove(null);
            // setSelectedChoice(null);
            setShowEquityInfo(false); // Reset equity info visibility
            setBestMoveRevealed(false);
            setShowLongExplanation(false); // Reset the explanation toggle
        });
    }, [setResetOptionsFunction]);

    useEffect(() => {
        // if (choices?.length > 0) {//don't handle randomly, this is a defined question
        //     const markedChoices = choices.map((choice, index) => ({
        //         choice: choice,
        //         isCorrect: index === correct-1
        //     }));
        //     setRandomChoices(markedChoices)
        // } else
        if (moveData) {//we just need moveData to process the question.
            generateRandomMoves(moveData);
        }
    }, [moveData]);

    const generateRandomMoves = (moveData, totalMoves = 5) => {
        if (!moveData || moveData.length === 0) return;

        // Shuffle the moveData
        const shuffledMoves = [...moveData].sort(() => 0.5 - Math.random());

        // Always include the best and worst move
        const bestMove = moveData[0];
        const worstMove = moveData[moveData.length - 1];

        // Ensure the total number of moves does not exceed available moves
        const numberOfAdditionalMoves = Math.min(totalMoves - 2, moveData.length - 2);

        // Select additional moves, excluding the best and worst moves
        const additionalMoves = shuffledMoves
            .filter((move) => move !== bestMove && move !== worstMove)
            .slice(0, numberOfAdditionalMoves);

        // Final moves, including best and worst, shuffled
        const finalMoves = [bestMove, ...additionalMoves, worstMove].sort(() => 0.5 - Math.random());
        setRandomMoves(finalMoves);
    };

    const handleShowArrows = (move) => {
        if (move) {
            const arrowMoves = move.play.map((m) => {
                const from = m.from === 'bar' ? 25 - 1 : m.from === 'off' ? 0 - 1 : parseInt(m.from) - 1;
                const to = m.to === 'bar' ? 25 - 1 : m.to === 'off' ? 0 - 1 : parseInt(m.to) - 1;
                return [from, to];
            });
            window.bglog.setArrows(arrowMoves);
        }
    };

    const handleMoveHover = (move) => {
        handleShowArrows(move);
    };

    const handleMoveLeave = () => {
        if (bestMoveRevealed) {
            // After the best move has been revealed, revert to best move arrows
            handleShowArrows(correctMove);
        } else if (!highlightedMove) {
            window.bglog.resetArrows(); // Reset arrows when not hovering
        } else {
            handleShowArrows(highlightedMove); // Keep arrows for highlighted move
        }
    };

    const handleMoveClick = (index, move) => {
        setSelectedIndex(index)
        console.log("selected index", selectedIndex)

        if (!bestMoveRevealed) {
            setSelectedMove(move);
            setHighlightedMove(move);
            handleShowArrows(move);
        }
        console.log("selected index", selectedIndex)
    };

    const showAnswer = () => {
        // if (randomChoices.length > 0 && selectedChoice) {
        //     if (selectedIndex === correct - 1) {
        //         setValidationMessage('Correct!');
        //     } else {
        //         setValidationMessage('Not quite.');
        //     }

            //this is a manual question. We want to tell them whether they selected the right answer.
            // setBestMoveRevealed(true); // Best move has been revealed
            /*setSelectionValidated(true);
            onSelectionComplete();*/
        //     return
        // }
        if (!selectedMove) return;

        const bestMove = moveData[0];
        const moveToShow = showBestMove ? bestMove : moveData[moveData.length - 1];
        setCorrectMove(moveToShow);

        if (selectedMove === moveToShow) {
            setValidationMessage('Correct!');
        } else {
            setValidationMessage('Not quite.');
        }

        setRandomMoves((prevMoves) => {
            // Sort moves by win probability
            return [...prevMoves].sort((a, b) =>
                showBestMove
                    ? b.evaluation.probability.win - a.evaluation.probability.win
                    : a.evaluation.probability.win - b.evaluation.probability.win
            );
        });

        handleShowArrows(moveToShow);
        setBestMoveRevealed(true); // Best move has been revealed
        setShowEquityInfo(true); // Show equity info when best/worst move is shown
        setSelectionValidated(true);
        onSelectionComplete();
    };
    return (
        <div className="move-options-container">
            {ShowComponent && (
                <>
                    {explanationMessage?.hint && (
                        <>
                            <button className="custom-secondary-button" onClick={() => setShowHint(!showHint)}>
                                {showHint ? 'Hide Hint' : 'Show Hint'}
                            </button>
                            {showHint && (
                                <p style={{ margin: '4px' }}>
                                    {/*<em>*/}
                                    {/*    <Card.Text dangerouslySetInnerHTML={{ __html: hint }} />*/}
                                    {/*</em>*/}
                                    {/* Show the explanation hint if available */}
                                    {explanationMessage?.hint && <p><strong>Hint: </strong>{explanationMessage.hint}</p>}
                                </p>
                            )}
                        </>
                    )}
                    {/*<RankChoices*/}
                    {/*    choicesData={choices}*/}
                    {/*    correctRanks={correctRank}*/}
                    {/*    setValidationMessage={setValidationMessage}*/}
                    {/*    onSelectionComplete={onSelectionComplete}*/}
                    {/*/>*/}

                    {/*<BooleanChoices*/}
                    {/*    choicesData={choices}*/}
                    {/*    correct={correct}*/}
                    {/*    setValidationMessage={setValidationMessage}*/}
                    {/*    setSelectionValidated={setSelectionValidated}*/}
                    {/*/>*/}

                    {randomMoves.length > 0 && (
                        <Table striped bordered hover responsive size="sm" variant='dark'>
                            <thead>
                            <tr>
                                <th style={{ width: '50px' }}></th>
                                <th>Move</th>
                                {selectionValidated && <th>Chance of winning</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {randomMoves.map((move, index) => (
                                <tr
                                    key={index}
                                    onMouseEnter={() => handleMoveHover(move)}
                                    onMouseLeave={handleMoveLeave}
                                    onClick={() => handleMoveClick(index, move)}
                                    className={selectedIndex === index ? 'row-selected' : ''}
                                    style={{ color: selectedIndex === index ? '#7CB342' : '' }} // Text color for the best move
                                >
                                    <td className='text-center'>
                                        {selectedMove === move && <FontAwesomeIcon icon={faCheck} style={{ color: '#7CB342' }} />}
                                    </td>

                                    <td>
                                        {move.play.map((p, index) => (
                                            <span key={index}>
                                              {p.from} <FontAwesomeIcon icon={faArrowRight} /> {p.to}
                                                    {index < move.play.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </td>

                                    {selectionValidated && (
                                        <td>{(move.evaluation.probability.win * 100).toFixed(2)}%</td>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    )}

                    <button
                        className="btn btn-success mb-3"
                        onClick={showAnswer}
                        disabled={(!selectedMove) || selectionValidated}
                    >
                        {'Show answer'}
                    </button>

                    {validationMessage && (
                        <>
                            <p>
                                <strong>{validationMessage}</strong>
                            </p>
                            { explanationMessage.long && <Form.Check
                                type="switch"
                                id="explanation-switch"
                                label={showLongExplanation ? 'Show Short Explanation' : 'Show Full Explanation'}
                                checked={showLongExplanation} // Use the checked property to toggle the switch
                                onChange={() => setShowLongExplanation(!showLongExplanation)} // Handle the toggle change
                            />
                            }
                            <Collapse in={showLongExplanation}>
                                <div>
                                <ReactMarkdown className='hint' remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                    {explanationMessage?.long}
                                </ReactMarkdown>
                                </div>
                            </Collapse>

                            {!showLongExplanation && <p>
                                <ReactMarkdown className='hint' remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                    {explanationMessage?.short}
                                </ReactMarkdown>
                                </p>}
                        </>
                    )}
                </>
            )}

            {showEquityInfo && moveData && moveData.length > 0 && (
                <div className="equity-info mt-3">
                    <h5 className='mb-3 text-color-change'>{showBestMove ? 'Best' : 'Worst'} move breakdown</h5>
                    <Table striped bordered hover size="sm" variant='dark' responsive>
                        <thead>
                        <tr>
                            <th>Win</th>
                            <th>Win Gammon</th>
                            <th>Win Backgammon</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{(randomMoves[0].evaluation.probability.win * 100).toFixed(2)}%</td>
                            <td>{(randomMoves[0].evaluation.probability.winG * 100).toFixed(2)}%</td>
                            <td>{(randomMoves[0].evaluation.probability.winBG * 100).toFixed(2)}%</td>
                        </tr>
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default BoardChoices;
