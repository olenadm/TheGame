import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { yaml } from '@codemirror/lang-yaml';
import 'bootstrap/dist/css/bootstrap.min.css';

const YAMLViewer = ({ generatedYaml }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(generatedYaml)
            .then(() => alert('YAML copied to clipboard!'))
            .catch(err => console.error('Failed to copy YAML: ', err));
    };

    return (
        <div className="col-md-6 p-4">
            <h3>YAML Output</h3>
            <CodeMirror
                value={generatedYaml}
                height="400px"
                extensions={[yaml()]}
                theme="dark" // You can use 'dark' or other themes if needed
                readOnly={true}
                basicSetup={{ lineNumbers: true }}
                style={{ border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <button className="btn btn-primary mt-3" onClick={handleCopy}>
                Copy YAML
            </button>
        </div>
    );
};

export default YAMLViewer;
