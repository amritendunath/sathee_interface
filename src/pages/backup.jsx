import React, { useEffect, useState } from 'react';

const Chatbox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserEmail(payload.sub);

            // Fetch chat history directly
            fetch('http://127.0.0.1:5001/chat-history', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.chat_history) {
                    const formattedHistory = data.chat_history.map(msg => ({
                        name: msg.type === 'user' ? 'User' : 'Sam',
                        message: msg.message,
                        timestamp: new Date(msg.timestamp)
                    }));
                    setMessages(formattedHistory);
                }
            })
            .catch(error => {
                console.error('Error fetching chat history:', error);
            });
        } else {
            setUserEmail('Guest');
        }
    }, []);

    const toggleChatbox = () => setIsOpen(!isOpen);

    const formatResponse = (response) => {
        // Example: Split the response into sections based on bullet points or numbered lists
        const lines = response.split('\n');
        return lines.map((line, i) => {
            if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.')) {
                return (
                    <div key={i} style={{ marginTop: '10px', fontWeight: 'bold' }}>
                        {line}
                    </div>
                );
            } else if (line.startsWith('-')) {
                return (
                    <div key={i} style={{ marginLeft: '20px', color: '#555' }}>
                        {line}
                    </div>
                );
            } else {
                return (
                    <div key={i} style={{ marginTop: '5px' }}>
                        {line}
                    </div>
                );
            }
        });
    };



    const handleSendMessage = () => {
        if (input.trim() === '') return;

        const userMessage = { name: 'User', message: input };
        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);

        const endpoint = isSearchMode ? 'http://127.0.0.1:5000/search' : 'http://127.0.0.1:5001/predict';

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ message: input }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Received data:', data);
                const botMessage = {
                    name: 'Sam',
                    message: isSearchMode ? formatResponse(data.answer) : data.response
                };
                setMessages((prev) => [...prev, botMessage]);
            })
            .catch((error) => {
                console.error('Error:', error);
                const errorMessage = {
                    name: 'Sam',
                    message: 'Sorry, I encountered an error processing your request.'
                };
                setMessages((prev) => [...prev, errorMessage]);
            })
            .finally(() => {
                setLoading(false);
                setInput('');
            });
    };

    return (
        <div className="chatbox">
            <div className={`chatbox__support ${isOpen ? 'chatbox--active' : ''}`}>
                <div className="chatbox__header">
                    <div className="chatbox__image--header">
                        <img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png" alt="support avatar" />
                    </div>
                    <div className="chatbox__content--header">
                        <h4 className="chatbox__heading--header">ID:{userEmail}</h4>

                        <p className="chatbox__description--header">Hi. My name is Sam. How can I help you?</p>
                    </div>
                </div>
                <div className="chatbox__messages">
                    {[...messages.map((msg, index) => (
                            <div
                                key={`msg-${index}`}
                                className={`messages__item ${msg.name === 'Sam' ? 'messages__item--visitor' : 'messages__item--operator'
                                    }`}
                            >
                                {msg.message}
                            </div>
                        )), // Reverse the order of messages,
                        loading && (
                            <div key="loading" className="messages__item messages__item--visitor">
                                <em>Sam is thinking...</em>
                            </div>
                        )
                    ].reverse()}
                </div>
                <div className="chatbox__footer">
                    <div className="switch-container-wrapper">
                        <div className="switch-container">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={isSearchMode}
                                    onChange={() => setIsSearchMode(!isSearchMode)}
                                />
                                <span className="slider round"></span>
                            </label>
                            <span className="mode-label">{isSearchMode ? 'DEEP MODE' : 'CHAT MODE'}</span>
                        </div>
                    </div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Write a message..."
                    />
                    <button onClick={handleSendMessage} className="chatbox__send--footer send__button">
                        Send
                    </button>
                </div>
            </div>
            <div className="chatbox__button">
                <button onClick={toggleChatbox}>
                    <img src="./images/chatbox-icon.svg" alt="Chat Icon" />
                </button>
            </div>
        </div>
    );
};

export default Chatbox;
