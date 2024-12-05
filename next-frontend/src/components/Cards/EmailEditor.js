'use client'
import React, { useState } from 'react';
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const EmailEditor = ({ recipientList }) => {
    const [content, setContent] = useState('Use variables like this $name and draft a confirmation email for recipient');
    const [isSending, setIsSending] = useState(false);
    const [sendStatus, setSendStatus] = useState(null);

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

    const handleSendEmails = async () => {
        setIsSending(true);
        setSendStatus(null);

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipients: recipientList,
                    emailTemplate: (recipient) => ({
                        subject: `Payment Confirmation for ${recipient.name}`,
                        htmlContent: getProcessedContent()
                    })
                })
            });

            const result = await response.json();

            if (response.ok) {
                setSendStatus({ 
                    success: true, 
                    message: result.message 
                });
            } else {
                setSendStatus({ 
                    success: false, 
                    message: result.error 
                });
            }
        } catch (error) {
            setSendStatus({ 
                success: false, 
                message: 'Failed to send emails' 
            });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className='flex flex-col mb-5'>
            <h3 className="font-semibold text-lg text-blueGray-700 mb-5">
                Draft Confirmation Email 
            </h3>
            <div className="text-sm mb-2">
                <span className='font-semibold text-blueGray-700'>Available Variables: </span>
                {availableVars.map(variable => (
                    <span 
                        onClick={() => { setContent((prev) => `${prev} ${variable}`) }} 
                        key={variable} 
                        className="ml-2 bg-gray-500 py-1 px-2 rounded text-white cursor-pointer"
                    >
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
                <span className='text-sm font-semibold text-blueGray-700'>Email Preview:</span>
            </div>
            <div className='mt-1' dangerouslySetInnerHTML={{ __html: getProcessedContent() }} />
        <div className="mt-10">
            <button 
                    onClick={handleSendEmails}
                    disabled={isSending}
                    className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mr-4"
                >
                    {isSending ? 'Sending...' : 'Send Emails'}
            </button>
        </div>



            {sendStatus && (
                <div className={`mt-2 p-2 rounded ${sendStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {sendStatus.message}
                </div>
            )}
        </div>
    );
};

export default EmailEditor;