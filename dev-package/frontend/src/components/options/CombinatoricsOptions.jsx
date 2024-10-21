import React, {useEffect, useState} from 'react';
import { Button, Table } from 'react-bootstrap';
import '../../styles/app.scss';

const CombinatoricsOptions = ({
                                   combinationsData,
                                   onSelectionComplete,
                                   setResetOptionsFunction,
                                   validationMessage,
                                   setValidationMessage,
                                    dynamic,
                               }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [targetNumber, setTargetNumber] = useState(null);
    const [randomChoices, setRandomChoices] = useState([]);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [selectionValidated, setSelectionValidated] = useState(false);

    const { combinationsForNumber } = combinationsData;

    useEffect(() => {
        setResetOptionsFunction(() => () => {
            console.log("calling random reset options function")
            setSelectedOption(null);
            setTargetNumber(null);
            setRandomChoices([]);
            setCorrectAnswer(null);
            setSelectionValidated(false);
            setValidationMessage('');

            generateQuestion();
        });

        generateQuestion();
    }, [combinationsData, setResetOptionsFunction]);

    const generateQuestion = () => {
        const diceNumbers = Object.keys(combinationsForNumber);
        const randomTarget = diceNumbers[Math.floor(Math.random() * diceNumbers.length)];
        setTargetNumber(randomTarget);

        const correct = combinationsForNumber[randomTarget];
        setCorrectAnswer(correct);

        const allOptions = Object.values(combinationsForNumber);
        const incorrectChoices = allOptions
            .filter(option => option !== correct)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);

        const rChoices = [correct, ...incorrectChoices].sort(() => 0.5 - Math.random())
        console.log("rChoices ", rChoices)
        setRandomChoices(rChoices);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setSelectionValidated(true);

        if (option === correctAnswer) {
            setValidationMessage('Correct!');
        } else {
            setValidationMessage('Not quite.');
        }
        onSelectionComplete();
    };
    console.log("dynamic ", dynamic)
    return dynamic && (
        <div className="move-options-container">
            {targetNumber && (
                <h4 className='my-4'>What are the odds of rolling a {targetNumber}?</h4>
            )}

            {randomChoices.length > 0 && (
                <Table striped bordered hover responsive size="sm" variant='dark'>
                    <thead>
                    <tr>
                        <th>Select a Probability</th>
                    </tr>
                    </thead>
                    <tbody>
                    {randomChoices.map((option, index) => {
                        console.log("option ", option)
                       return  (
                        <tr
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            className={selectedOption === option ? 'table-highlight-blue' : ''}
                        >
                            <td>{option} / 36</td>
                        </tr>
                    )})}
                    </tbody>
                </Table>
            )}

            {validationMessage && <p>{validationMessage}</p>}
        </div>
    );
    return null;
};

export default CombinatoricsOptions;
