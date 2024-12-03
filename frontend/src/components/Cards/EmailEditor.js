import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EmailEditor = ({ recipientList }) => {
    const [content, setContent] = useState('Hello $name, This is your email content.');

    const variables = recipientList[0]

    const interpolateVariables = (text, variables) => {
        return text.replace(/\$(\w+)/g, (match, variable) => {
            return variables[variable] || match;
        });
    };

    const getProcessedContent = () => {
        return interpolateVariables(content, variables);
    };

    const getAvailableVariables = () => {
        return Object.keys(variables).map(key => `$${key}`);
    };

    const availableVars = getAvailableVariables(variables);



    return (
        <div className='flex flex-col mb-5'>
            <div className=" text-sm mb-2">
                <span className='font-bold'>Available Variables: </span>
                {availableVars.map(variable => (
                    <span onClick={() => { setContent((prev) => `${prev} ${variable}`) }} key={variable} className="ml-2 bg-gray-500 py-1 px-2 rounded text-white cursor-pointer">
                        {variable}
                    </span>
                ))}
            </div>
            <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                style={{
                    borderRadius: "0.25rem"
                }}
                className='bg-white'
            />
            <div className='mt-5'>
                <h3 className=' font-bold'>Final Content:</h3>
            </div>
            <div className='mt-1' dangerouslySetInnerHTML={{ __html: getProcessedContent() }} />
        </div>
    );
};

export default EmailEditor;
