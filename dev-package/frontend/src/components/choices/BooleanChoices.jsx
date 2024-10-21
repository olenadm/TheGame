import React, {useEffect, useState} from "react";
import {Card, Table} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ChoiceContentRenderer from "./ChoiceComponentRenderer";

const BooleanChoices = ({
                            choices: choicesData,
                            correct,
                            onSelectionComplete,
                            explanationMessage
                        }) => {
    const [validationMessage, setValidationMessage] = useState(null)
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [choices, setChoices] = useState([]); // The array holding the draggable choices

    useEffect(() => {
        if (choicesData?.length > 0) {//don't handle randomly, this is a defined question
            const markedChoices = choicesData.map((choice, index) => ({
                choice: choice,
                isCorrect: index === correct-1
            }));
            setChoices(markedChoices)
        }
    }, [choicesData]);

    const showAnswer = () => {
        if (choices.length > 0 && selectedChoice) {
            if (selectedIndex === correct - 1) {
                setValidationMessage('Correct!');
            } else {
                setValidationMessage('Not quite.');
            }
            // setSelectionValidated(true);
            onSelectionComplete();
        }
    }
            return (
        <div className="move-options-container">
        {choices?.length > 0 && (
            <Table striped bordered hover responsive size="sm" variant='dark'>
                <tbody>
                {choices.map((choice, index) => (
                    <tr
                        key={index}
                        // onMouseEnter={() => handleMoveHover(move)}
                        // onMouseLeave={handleMoveLeave}
                        onClick={() => {
                            setSelectedChoice(choice.choice)
                            setSelectedIndex(index)
                        }}
                        className={selectedIndex === index ? 'row-selected' : ''}
                        style={{ color: selectedIndex === index ? '#7CB342' : '' }} // Text color for the best move
                    >
                        <td>
                            <ChoiceContentRenderer content={choice.choice} />
                        </td>
                        <td className='text-center'>
                            {selectedChoice === choice.choice && <FontAwesomeIcon icon={faCheck} style={{ color: '#7CB342' }} />}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        )}
        <button
            className="btn btn-success mb-3"
            onClick={showAnswer}
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
    )
}

export default BooleanChoices;
