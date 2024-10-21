import React, { useState, useEffect } from 'react';
import { Button, Table, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCheck, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../../styles/app.scss';
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import ChoiceContentRenderer from "./ChoiceComponentRenderer";

//use this for ranked options rather than single options
const RankChoices = ({
                          choices: choicesData,
                          correctRanks, // The rank array provided by your backend (e.g., [2, 1, 3])
                          onSelectionComplete,
                          explanationMessage
                      }) => {
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [validationMessage, setValidationMessage] = useState(null)
    const [choices, setChoices] = useState([]); // The array holding the draggable choices
    useEffect(() => {
        if (choicesData?.length > 0) {
            setChoices(choicesData.map((choice, index) => ({ id: `choice-${index}`, content: choice })));
        }
    }, [choicesData]);

    // Handle drag end
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedChoices = Array.from(choices);
        const [moved] = reorderedChoices.splice(result.source.index, 1);
        reorderedChoices.splice(result.destination.index, 0, moved);

        setChoices(reorderedChoices);
    };

    // Check ranking correctness
    const handleCheckRanking = () => {
        const convertedRanks = correctRanks.split(',').map(num => parseInt(num.trim(), 10));
        const userRanking = choices.map((choice) => choicesData.indexOf(choice.content) + 1);

        console.log(userRanking, convertedRanks)
        // Compare userRanking with correctRanks
        const isCorrect = JSON.stringify(userRanking) === JSON.stringify(convertedRanks);
        console.log("isCorrect", isCorrect)
        if (isCorrect) {
            setValidationMessage('Correct ranking!');
        } else {
            setValidationMessage('Incorrect ranking. Please try again.');
        }

        // onSelectionComplete(); // Call this when the user completes the selection
    };

    return (
        <div className="move-options-container">
            <strong>Rank these moves in order of best first</strong>

            {choices?.length > 0 && (

                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="choices">
                        {(provided) => (
                            <Table
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                striped
                                bordered
                                hover
                                size="sm"
                                variant='dark'
                                className="drag-drop-table mt-2"
                            >
                                <tbody>
                                {choices.map((choice, index) => {
                                    // Identify the type of format
                                    const isMoveFormat = /\d+\/\d+/.test(choice.content); // Check if it matches move pattern
                                    const isHtmlFormat = /<\/?[^>]+(>|$)/.test(choice.content); // Check if it contains HTML tags

                                    return (
                                        <Draggable key={choice.id} draggableId={choice.id} index={index}>
                                            {(provided, snapshot) => (
                                                <tr
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={selectedIndex === index ? 'row-selected' : ''}
                                                    style={{
                                                        ...provided.draggableProps.style,
                                                        backgroundColor: snapshot.isDragging ? 'lightblue' : '',
                                                    }}
                                                >
                                                    <td style={{ display: 'flex', alignItems: 'center' }}>
                                                        {/* Drag handle icon */}
                                                        <FontAwesomeIcon icon={faGripVertical} className="drag-handle-icon" style={{ marginRight: '8px', cursor: 'grab' }} />

                                                        {/* Render the choice content using ChoiceContentRenderer */}
                                                        <ChoiceContentRenderer content={choice.content} />

                                                        {/* Checkmark when selected */}
                                                        {selectedChoice === choice.content && (
                                                            <FontAwesomeIcon icon={faCheck} style={{ color: 'green', marginLeft: '8px' }} />
                                                        )}
                                                    </td>
                                                </tr>
                                            )}
                                        </Draggable>
                                    );
                                })}


                                {provided.placeholder}
                                </tbody>
                            </Table>
                        )}
                    </Droppable>
                </DragDropContext>
            )}

            <button
                className="btn btn-success mb-3"
                onClick={handleCheckRanking}
            >
            {'Show answer'}
            </button>

            {validationMessage && (
                <>
                    <p>{validationMessage}</p>
                    <ReactMarkdown className='hint' remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {explanationMessage?.short}
                    </ReactMarkdown>
                </>)
            }
        </div>
    );
};

export default RankChoices;
