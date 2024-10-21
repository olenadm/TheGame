import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import yaml from "js-yaml";
import YAMLViewer from "./YAMLViewer";


const SlideCreator = () => {
    const [slides, setSlides] = useState([
        {
            quoteText: 'sadfasdf',
            quoteAuthor: 'asdfasdf',
            description: 'asdfasdfasdf\nasdfasdfasdf',
            xgid: 'XGID=----bBBBBAB-A-AaabbbbcAA--:0:0:1:66:0:0:0:0:10',
            hint: 'asdfasdfasdf\n',
            showBoard: true,
            choices: ['asdfasdf', 'asdgasdgasdgsa'],
            correct: 2,
            slideType: 'board',
            showComponent: true,
            showBestMove: false,
            showDice: false,
        },
    ]);

    const [generatedYaml, setGeneratedYaml] = useState(''); // For storing the YAML output

    const addChoice = (index) => {
        const newSlides = [...slides];
        newSlides[index].choices.push('');
        setSlides(newSlides);
    };

    const updateSlide = (index, field, value) => {
        const newSlides = [...slides];
        newSlides[index][field] = value;
        setSlides(newSlides);
    };

    const updateChoice = (slideIndex, choiceIndex, value) => {
        const newSlides = [...slides];
        newSlides[slideIndex].choices[choiceIndex] = value;
        setSlides(newSlides);
    };

    const addSlide = () => {
        setSlides([
            ...slides,
            {
                quoteText: '',
                quoteAuthor: '',
                description: '',
                xgid: '',
                hint: '',
                showBoard: false,
                choices: [],
                correct: 0,
                slideType: '',
                showComponent: false,
                showBestMove: false,
                showDice: false,
            },
        ]);
    };


    const generateYAML = () => {
        const yamlSlides = slides.map(slide => {
            return {
                quote: slide.quoteText.trim() ? slide.quoteText.trim() + `\n\n_${slide.quoteAuthor.trim()}_` : '',
                description: slide.description.trim() || '',
                xgid: slide.xgid || '',
                hint: slide.hint.trim() || '',
                showBoard: slide.showBoard,
                choices: slide.choices.length > 0 ? slide.choices.map(choice => choice.trim()) : [],
                correct: slide.correct > 0 ? slide.correct : null,
                slideType: slide.slideType || undefined,
                showComponent: slide.showComponent,
                showBestMove: slide.showBestMove,
                showDice: slide.showDice,
            };
        });

        // Clean up null or undefined fields
        const cleanedYamlSlides = yamlSlides.map(slide =>
            Object.fromEntries(Object.entries(slide).filter(([_, v]) => v !== undefined && v !== null))
        );

        // Use js-yaml to dump the cleaned data, ensuring block scalar formatting
        const yamlOutput = yaml.dump({ slides: cleanedYamlSlides }, {
            lineWidth: -1, // Ensure no line wrapping
            noCompatMode: true,
            replacer: (key, value) => {
                // Force block scalar for description and hint
                if (typeof value === 'string' && ['description', 'hint'].includes(key)) {
                    return `\n${value}`; // Ensure this string is treated as a block scalar
                }
                // Force block scalar for quote and ensure each line is prefixed with '>'
                if (typeof value === 'string' && key === 'quote') {
                    const lines = value.split('\n');
                    const formattedQuote = lines.map(line => `> ${line}`).join('\n');
                    return `\n${formattedQuote}`;
                }
                // For choices array, ensure each element is treated as a block scalar
                if (Array.isArray(value) && key === 'choices') {
                    return value.map(item => `\n${item}`);
                }

                return value; // Return other values as they are
            }
        });

        setGeneratedYaml(yamlOutput);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Left column - Input Editor */}
                <div className="col-md-6 p-4">
                    <h3>Create Slides</h3>
                    {slides.map((slide, index) => (
                        <div key={index} className="card mb-4">
                            <div className="card-body">
                                <h5>Slide {index + 1}</h5>
                                <div className="mb-3">
                                    <label>Quote Text:</label>
                                    <textarea
                                        className="form-control"
                                        value={slide.quoteText}
                                        onChange={(e) => updateSlide(index, 'quoteText', e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Quote Author:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={slide.quoteAuthor}
                                        onChange={(e) => updateSlide(index, 'quoteAuthor', e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Description:</label>
                                    <textarea
                                        className="form-control"
                                        value={slide.description}
                                        onChange={(e) => updateSlide(index, 'description', e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>XGID:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={slide.xgid}
                                        onChange={(e) => updateSlide(index, 'xgid', e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Hint:</label>
                                    <textarea
                                        className="form-control"
                                        value={slide.hint}
                                        onChange={(e) => updateSlide(index, 'hint', e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Slide Type:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={slide.slideType}
                                        onChange={(e) => updateSlide(index, 'slideType', e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Choices (Array):</label>
                                    {slide.choices.map((choice, choiceIndex) => (
                                        <input
                                            key={choiceIndex}
                                            type="text"
                                            className="form-control mb-2"
                                            value={choice}
                                            onChange={(e) => updateChoice(index, choiceIndex, e.target.value)}
                                        />
                                    ))}
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => addChoice(index)}
                                    >
                                        Add Choice
                                    </button>
                                </div>
                                <div className="mb-3">
                                    <label>Correct Choice (Index):</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={slide.correct}
                                        onChange={(e) => updateSlide(index, 'correct', e.target.value)}
                                    />
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={slide.showBoard}
                                        onChange={(e) => updateSlide(index, 'showBoard', e.target.checked)}
                                    />
                                    <label className="form-check-label">Show Board</label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={slide.showComponent}
                                        onChange={(e) => updateSlide(index, 'showComponent', e.target.checked)}
                                    />
                                    <label className="form-check-label">Show Component</label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={slide.showBestMove}
                                        onChange={(e) => updateSlide(index, 'showBestMove', e.target.checked)}
                                    />
                                    <label className="form-check-label">Show Best Move</label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={slide.showDice}
                                        onChange={(e) => updateSlide(index, 'showDice', e.target.checked)}
                                    />
                                    <label className="form-check-label">Show Dice</label>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="btn btn-primary" onClick={addSlide}>
                        Add Slide
                    </button>
                    <button className="btn btn-success mt-3" onClick={generateYAML}>
                        Generate YAML
                    </button>
                </div>

                {/* Right column - YAML Output */}
                <YAMLViewer generatedYaml={generatedYaml} />
            </div>
        </div>
    );
};

export default SlideCreator;
