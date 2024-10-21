// ChoiceContentRenderer.js
import React from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

// The reusable ChoiceContentRenderer component
const ChoiceContentRenderer = ({ content }) => {
    // Identify the type of format
    const isMoveFormat = /\d+\/\d+/.test(content); // Check if it matches move pattern
    const isHtmlFormat = /<\/?[^>]+(>|$)/.test(content); // Check if it contains HTML tags

    // Render move format
    if (isMoveFormat) {
        return content.split(' ').map((segment, segIndex) => (
            <span key={segIndex}>
                {segment.split('/').map((movePart, partIndex) => (
                    <React.Fragment key={partIndex}>
                        {movePart}
                        {partIndex < segment.split('/').length - 1 && (
                            <FontAwesomeIcon icon={faArrowRight} style={{ margin: '0 4px' }} />
                        )}
                    </React.Fragment>
                ))}
                {segIndex < content.split(' ').length - 1 && ', '}
            </span>
        ));
    }

    // Render HTML format
    if (isHtmlFormat) {
        return <Card.Text dangerouslySetInnerHTML={{ __html: content }} />;
    }

    // Render plain text as fallback
    return <span>{content}</span>;
};

export default ChoiceContentRenderer;
