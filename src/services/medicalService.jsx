import React, { useState, useEffect } from 'react';
import axios from 'axios';

const agent_dict = {
    'get_info': 'information_agent',
    'appointment_info': 'appointment_agent',
    'primary_assistant': 'supervisor_agent',
    'medical_info': 'medical_assistant',
    'hospital_info': 'hospital_assistant' 
};

const ChatUI = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [threadId, setThreadId] = useState('');

    useEffect(() => {
        // Generate UUID on component mount
        setThreadId(crypto.randomUUID());
    }, []);

    const makeApiCall = async (prompt) => {
        const API_URL = "http://localhost:8000/api/v1/generate-stream/";
        
        try {
            const response = await axios.post(API_URL, 
                { query: prompt },
                { 
                    headers: { 'X-THREAD-ID': threadId },
                    timeout: 60000 
                }
            );
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            return { answer: "Error retrieving response" };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);

        // Clear input
        setInput('');

        // Get API response
        const response_data = await makeApiCall(input);
        const dialog_state = response_data.dialog_state || 'primary_assistant';
        const answer = response_data.answer || "No response from API";

        // Add assistant message
        const assistantMessage = {
            role: 'assistant',
            content: answer,
            agent: agent_dict[dialog_state]
        };
        setMessages(prev => [...prev, assistantMessage]);
    };

    return (
        <div className="chat-container">
            <div className="messages-container">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.role}`}>
                        {message.role === 'assistant' && (
                            <div className="agent-tag" style={{ color: 'red' }}>
                                {message.agent}
                            </div>
                        )}
                        <div className="message-content">
                            {message.content}
                        </div>
                    </div>
                ))}
            </div>
            
            <form onSubmit={handleSubmit} className="input-form">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="What is up?"
                    className="chat-input"
                />
                <button type="submit" className="send-button">
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatUI;