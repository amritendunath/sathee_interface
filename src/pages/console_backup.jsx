import React, { useEffect, useState, useRef, useCallback } from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import "tailwindcss/tailwind.css";
import "../components/styles/App.css";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarProvider,
  // SidebarTrigger,
//   useSidebar
// } from "../components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import axios from "axios";
import { set } from "react-hook-form";
import { QuickResponseDropdown } from "../components/ui/custom1";
import { CustomQuickResponseDropdown } from "../components/ui/modebutton";
import ReactMarkdown from 'react-markdown';
import geneticSvg from '../genetic-data-svgrepo-com.svg'
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarTrigger,
  useSidebar
} from '../components/ui/sidebar_all';

const ChatUI = ({ onCreateNewSession }) => {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [user_id, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('https://storage.googleapis.com/a1aa/image/WkpYEcLxO0KkSzrfJExcmisxBg5otmGO4IHGBHlju5Q.jpg');
  const [attachedFile, setAttachedFile] = useState(null);
  const [threadId, setThreadId] = useState('');
  const [responseType, setResponseType] = useState("quick");
  const [showWelcome, setShowWelcome] = useState(true)
  const [welcomeMounted, setWelcomeMounted] = useState(true);
  const [socket, setSocket] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('connected')
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const startTime = performance.now()
  const {isOpen} = useSidebar()
  const refetchChatSessions = useCallback(() => {
    fetch('http://localhost:8000/api/v1/generate-stream/chat-sessions', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.sessions) {
          const sortedSessions = data.sessions.sort((a, b) =>
            new Date(b.timestamp) - new Date(a.timestamp)
          );
          // Call a function in AppSidebar to update the chat sessions
          handleUpdateChatSessions(sortedSessions);
        }
      })
      .catch(error => console.error('Error fetching chat sessions:', error));
  }, []);

  // Function to update chat sessions in AppSidebar
  const handleUpdateChatSessions = useCallback((newSessions) => {
    // Use a ref to pass the function to AppSidebar
    if (updateChatSessionsRef.current) {
      updateChatSessionsRef.current(newSessions);
    }
  }, []);
  // Ref to pass the function to AppSidebar
  const updateChatSessionsRef = useRef();
  useEffect(() => {
    updateChatSessionsRef.current = handleUpdateChatSessions;
  }, [handleUpdateChatSessions]);

  // ------------------------------------------------------------------------
  const agent_dict = {
    'get_info': 'information_agent',
    'appointment_info': 'appointment_agent',
    'primary_assistant': 'supervisor_agent',
    'medical_info': 'medical_assistant'
  };

  useEffect(() => {
    // Generate UUID on component mount
    setThreadId(crypto.randomUUID());

  }, []);

  useEffect(() => {
    // Establish WebSocket connection
    const newSocket = new WebSocket('ws://localhost:3001'); // Replace with your WebSocket URL
    newSocket.onopen = () => {
      console.log('WebSocket connected');
      setConnectionStatus('connected');
    };

    newSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const endTime = performance.now()
      const responseTime = endTime - startTime
      if (typeof message.message !== "string") {
        message.message = "";
      }
      setMessages((prev) => [...prev, message]);
      console.log(`WebSocket Response Time: ${responseTime}ms`);
    };

    newSocket.onclose = () => {
      console.log('WebSocket disconnected');
      setConnectionStatus('disconnected');
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(newSocket);

    // Cleanup function to close the WebSocket connection
    return () => {
      newSocket.close();
    };
  }, []);

  // useEffect(() => {
  //   if (messages.length > 0) {
  //     setShowWelcome(false); // Start fade out
  //     setTimeout(() => setWelcomeMounted(false), 300); // Unmount after transition
  //   } else {
  //     setWelcomeMounted(true); // Mount immediately
  //     setTimeout(() => setShowWelcome(true), 300); // Fade in
  //   }
  // }, [messages]);

  const makeApiCall = async (prompt) => {
    const API_URL = `${process.env.REACT_APP_POINT_AGENT}/api/v1/generate-stream/`;
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await axios.post(API_URL,
        {
          query: prompt,
          queryModeType: responseType
        },
        {
          headers: {
            'X-THREAD-ID': threadId,
            'Authorization': `Bearer ${token}`
          },
          timeout: 60000
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      console.error('API Error:', error);
      return { answer: "Error retrieving response" };
    }
  };


  const handleFileAttachment = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/dicom', 'application/pdf'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        alert('Please upload only images (JPEG, PNG), DICOM files, or PDF documents');
        return;
      }

      if (file.size > maxSize) {
        alert('File size should be less than 10MB');
        return;
      }

      setAttachedFile(file);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll whenever messages change

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    setUserEmail(payload.sub);
    setUserName(payload.name);
    setUserId(payload.user_ehr_id);
    if (payload.picture) {
      setUserImage(payload.picture);
    }
  }, []);

  const endSession = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_POINT_AGENT}/api/v1/generate-stream/end-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to end session');
      }

      // Clear current session state
      // setMessages([]);
      // setCurrentSessionId(null);

    } catch (error) {
      console.error('Error ending session:', error);
      throw error; // Propagate error to caller
    }
  };

  const handleLogout = async () => {
    try {
      await endSession(); // End the session before logging out
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
      // Still proceed with logout even if session end fails
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }

  // const handleSendMessage = async () => {
  //   const userMessage = {
  //     name: 'User',
  //     message: input
  //   }
  //   setMessages((prev) => [...prev, userMessage]);
  //   setInput('')
  //   const messageToSend = {
  //     name: userMessage.name,
  //     messages: userMessage.message
  //   }
  //   const response_data = await makeApiCall(messageToSend.messages);
  //   const answer = response_data.answer || "No response from API";
  //   const botMessage = {
  //     name: 'Sathi',
  //     message: answer,
  //   };
  //   setMessages((prev) => [...prev, botMessage]);
  // }


  const handleSendMessage = async () => {
    if (input.trim() === '' && !attachedFile) return;

    const userMessage = {
      name: 'User',
      message: input,
      file: attachedFile
    };
    if (welcomeMounted) {
      setShowWelcome(false);
      setTimeout(() => {
        setWelcomeMounted(false);
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        if (textareaRef.current) {
          textareaRef.current.style.height = '20px';
        }
        setLoading(true);
      }, 200)
    }
    else {
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '20px';
      }
      setLoading(true);
    }
    const response = await makeApiCall(input);
    const answer = response.answer || "No response from API";
    const botMessage = {
      name: 'Sathi',
      message: answer,
    };
    setLoading(false)
    setMessages((prev) => [...prev, botMessage])

  }
  // if (socket) {
  //   socket.send(JSON.stringify(messageToSend));
  //   setMessages((prev) => [...prev, userMessage]);
  //   setInput('');
  //   if (textareaRef.current) {
  //     textareaRef.current.style.height = '20px';
  //   }
  //   setLoading(true);
  // }
  // if (connectionStatus === 'connected' && socket) {
  //   socket.send(JSON.stringify(messageToSend))
  // }
  // else {
  //   await makeApiCall(messageToSend)

  // }

  //   try {
  //     if (isSearchMode) {
  //       // Process file if attached
  //       const processFile = attachedFile ? new Promise((resolve) => {
  //         const reader = new FileReader();
  //         reader.onloadend = () => {
  //           const base64String = reader.result.split(',')[1];
  //           resolve(base64String);
  //         }
  //         reader.readAsDataURL(attachedFile);
  //       }) : Promise.resolve(null);

  //       const base64String = await processFile;
  //       const response = await fetch('http://127.0.0.1:5000/search', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${localStorage.getItem('token')}`
  //         },
  //         body: JSON.stringify({
  //           message: input,
  //           session_id: currentSessionId,
  //           fileData: base64String
  //         }),
  //       });

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       const botMessage = {
  //         name: 'Sathi',
  //         message: formatResponse(data.answer)
  //       };
  //       setMessages((prev) => [...prev, botMessage]);
  //       refetchChatSessions()
  //     }
  //     else {
  // const response_data = await makeApiCall(input);
  // // const dialog_state = response_data.dialog_state || 'primary_assistant';
  // const answer = response_data.answer || "No response from API";
  // const botMessage = {
  //   name: 'Sathi',
  //   message: answer,
  //   // agent: agent_dict[dialog_state]
  // };
  // setMessages((prev) => [...prev, botMessage]);
  //       refetchChatSessions()
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     setMessages((prev) => [...prev, {
  //       name: 'Sathi',
  //       message: "I'm sorry, I encountered an error processing your request."
  //     }]);
  //   } finally {
  //     setAttachedFile(null);
  //     setLoading(false);
  //   }
  // };

  const formatResponse = (response) => {
    const lines = response.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.')) {
        return <div key={i} style={{ marginTop: '10px', fontWeight: 'bold' }}>{line}</div>;
      } else if (line.startsWith('-')) {
        return <div key={i} style={{ marginLeft: '20px', color: '#555' }}>{line}</div>;
      } else {
        return <div key={i} style={{ marginTop: '5px' }}>{line}</div>;
      }
    });
  };

  const handleDeepSearchToggle = (e) => {
    e.stopPropagation();
    setIsSearchMode(!isSearchMode);
  };


  const handleNewSessionClick = () => {
    setMessages([]); // Clear existing messages
    setShowWelcome(true); // Show the welcome screen
    setWelcomeMounted(true); // Mount the welcome component

  };


  const handleSelectChatSession = useCallback((sessionId) => {
    setCurrentSessionId(sessionId);
    setMessages([]); // Clear current messages
    setLoading(false);
    setShowWelcome(false)
    fetch(`${process.env.REACT_APP_POINT_AGENT}/api/v1/generate-stream/chat-history/${sessionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.chat_history) {
          const formattedHistory = data.chat_history.map(msg => ({
            name: msg.type === 'user' ? 'User' : 'Sathi',
            message: msg.message,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(formattedHistory);
        }
      })
      .catch(error => {
        console.error('Error fetching chat history:', error);
        setMessages([{
          name: 'Sathi',
          message: 'Failed to load chat history. Please try again.'
        }]);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [messages]);

  const quickActions = [
    "Write a first draft",
    "Get advice",
    "Learn something new",
    "Create an image",
    "Make a plan",
    "Brainstorm ideas",
    "Practice a language",
    "Take a quiz",
  ];

  const getGreeting = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) {
      return "Good morning 🌄";
    } else if (hour < 18) {
      return "Good afternoon 🌇";
    } else {
      return "Good evening 🌆";
    }
  };
      {/* <Sidebar>
      </Sidebar> */}
      {/* <SidebarProvider>

        <AppSidebar
          onSelectChatSession={handleSelectChatSession}
          refetchChatSessions={refetchChatSessions}
          onNewSessionClick={handleNewSessionClick}
        />
      </SidebarProvider> */}
  // Modify the return statement to pass the handler to AppSidebar
  const consoleRef = useRef(null);
  return (
    <div className="h-screen bg-[#0f1117] w-full flex font-inter">

      <SidebarProvider>
        <Sidebar>
          <AppSidebar
            onSelectChatSession={handleSelectChatSession}
            refetchChatSessions={refetchChatSessions}
            onNewSessionClick={handleNewSessionClick}
          />
        </Sidebar>
        <SidebarTrigger className="text-gray-400" />
      </SidebarProvider>


      <div className=" flex-1 bg-[#0f1117] text-white w-full flex flex-col">
        {/* Header section */}
        {/* <div className="flex items-center border-b border-[#1e2233] p-1"> */}
        <div className="flex items-center p-1">
          {/* <SidebarTrigger className="text-gray-400" /> */}

          <div className="flex justify-center items-center flex-grow mt-2">
            <img
              alt="Copilot logo with blue, purple, and pink gradient shapes"
              className="w-10 h-10"
              height="20"
              src={geneticSvg}
              width="20"
            />
            <span className="font-semibold text-gray-200 text-base select-none">
              {/* Sathi */}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="ml-auto p-3 rounded-full hover:bg-gray-800 transition-colors button-hover">
            <i className="fas fa-sign-out-alt text-gray-200"></i>
          </button>
        </div>
        {/* Suggetion content */}
        {welcomeMounted && (messages.length === 0 || input === 300) && input.length <= 300 && (
          <div
            className={`text-center w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto justify-center mt-24 sm:mt-40 md:mt-[100px] lg:mt-[200px]  transition-opacity duration-500 ease-in-out
              ${showWelcome ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}
          >

            <div className="text-center w-full px-2 sm:px-4">
              <h1 className="text-white font-semibold text-2xl md:text-4xl leading-tight mb-2">
                {getGreeting()}, {userName.split(" ")[0]}.😊
              </h1>
              <h2 className="text-white font-semibold text-lg md:text-3xl leading-tight mb-6">
                ❤️ What can I help you with today?
              </h2>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-xs sm:max-w-xl mx-auto">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    // className="bg-[#3B4A5A] rounded-full px-3 py-2 text-xs sm:text-sm font-normal text-white whitespace-nowrap border border-[#3B4A5A] hover:bg-[#141820] "
                    className=" px-3 py-2 font-normal sm:text-sm md:text-md lg:text-md text-white whitespace-nowrap rounded-2xl shadow-lg max-w-[80%] border border-[#3B4A5A] hover:bg-[#3B4A5A]"
                    type="button"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat area */}
        {/* <div
            className=" flex flex-col items-center justify-center mt-[100px] "
          // className={`text-center max-w-3xl mx-auto mt-[100px]
          // text-center max-w-3xl mx-auto justify-center mt-[100px] 
          // transition-opacity duration-500 ease-in-out
          // ${messages.length === 0 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          // `}
          > */}

        {/* <div className="h-screen flex-1 flex flex-col h-full overflow-hidden "> */}
        <div className="h-screen flex-1 flex flex-col h-full overflow-hidden">
          {/* </div> */}
          {/* Messages section */}
          <div className="flex-1 text-gray-300 text-sm overflow-y-auto px-5 scrollbar scrollbar-thumb-[#262d3d] scrollbar-track-[#0f1117]">
            <div className="max-w-2xl mx-auto w-full py-6 space-y-2">
              {/* {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.name === 'User' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl shadow-lg max-w-[80%] break-words ${msg.name === 'User' ? 'bg-[#1e2942] bg-opacity-50' : 'bg-[#1e2233]'
                    }`}>
                    {msg.name == 'Sathi' && (
                      <div className="text-xs text-blue-400 mb-1">
                        {msg.agent}
                      </div>
                    )}
                    {msg.file && msg.file.type && msg.file.name (
                      <div className="mb-2">
                        {msg.file.type.startsWith('image/') ? (
                          <img src={URL.createObjectURL(msg.file)} alt="Attached" className="max-w-full rounded" />
                        ) : (
                          <div className="flex items-center text-blue-400">
                            <i className="fas fa-file mr-2"></i>
                            <span>{msg.file.name}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {msg.message}
                  </div>
                </div>
              ))} */}
              {messages.map((msg, index) => (
                (msg.message && msg.message.trim() !== "") ? (
                  <div key={index} className={`flex ${msg.name === 'User' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`mt-2 mb-2  ${msg.name === 'User' ? 'px-3 py-2 shadow-lg max-w-[80%] break-words rounded-2xl bg-[#1e2942] bg-opacity-50' : ''}`}>
                      <ReactMarkdown >
                        {msg.message}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : null
              ))}
              {loading && (
                <div className="flex justify-start">
                  {/* <div className="bg-[#1e2233] p-3 rounded-2xl shadow-lg max-w-[80%] break-words"> */}
                  <div>
                    {/* <em>Sathi is thinking...</em> */}
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          {/* Input section */}
          <div className="rounded-xl mx-auto w-full max-w-[710px] px-4">
            <div className="bg-[#0B0E17] rounded-[32px] p-[18px] mb-[10px] shadow-[0_3px_20px_0_rgba(40,50,70,0.95)] border border-[#181B24]">
              <div className="flex flex-col">
                {/* <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask anything"
                  className="pl-2 bg-transparent text-gray-200 w-full focus:outline-none text-sm mb-2 placeholder-gray-500 placeholder:font-semibold"
                /> */}
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}

                  onInput={e => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask anything"
                  rows={1}
                  className="pl-2 bg-transparent text-gray-200 w-full focus:outline-none text-sm mb-2 placeholder-gray-500 placeholder:font-semibold resize-none overflow-hidden scrollbar"
                  style={{ minHeight: '20px', maxHeight: '420px' }}
                />
              </div>
              <div className="flex gap-2">
                <div className=" flex items-center gap-2 ">
                  {/* Quick Response button */}
                  <CustomQuickResponseDropdown
                    value={responseType}
                    onChange={setResponseType}
                  />
                  {/* <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileAttachment}
                    accept=".jpg,.jpeg,.png,.pdf,.dcm"
                    style={{ display: 'none' }}
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="text-gray-300 hover:text-blue-400 px-2.5 py-1 rounded-3xl focus:outline-none button-hover flex items-center gap-1 border border-gray-500 hover:border-blue-400 transition-colors"
                  >
                    <i className="fas fa-paperclip"></i>
                    <span className="text-sm">
                      {attachedFile ? attachedFile.name.slice(0, 20) : 'Attach'}
                    </span>
                  </button>
                  <button
                    onClick={handleDeepSearchToggle}
                    className={`toggle-glow bg-opacity-30 text-gray-300 px-2.5 py-1 rounded-3xl flex items-center gap-1.5 focus:outline-none hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-shadow duration-300 ${isSearchMode ? 'active-glow' : ''}`}
                  >
                    <i className="fas fa-globe"></i>
                    <span className="text-sm">DeepSearch</span>
                  </button> */}
                </div>
                <div className=" flex items-center gap-2 ml-auto ">
                  {/* <button className="toggle-glow text-gray-400 hover:text-yellow-400 p-2 rounded-xl focus:outline-none button-hover glow-on-click">
                    <i className="fas fa-lightbulb"></i>
                  </button>
                  <button className="toggle-glow text-gray-400 hover:text-green-400 p-2 rounded-xl focus:outline-none button-hover glow-on-click">
                    <i className="fas fa-pen"></i>
                  </button>
                  <button className="toggle-glow text-gray-400 hover:text-purple-400 p-2 rounded-xl focus:outline-none button-hover glow-on-click">
                    <i className="fas fa-sliders-h"></i>
                  </button> */}
                  <button
                    onClick={handleSendMessage}
                    className={`w-8 h-8 rounded-full hover:bg-white hover:text-black focus:outline-none transition-colors border border-[#363c4d] ${input
                      ? 'bg-white text-black'
                      : 'bg-[#141820] text-white '
                      }`}
                  // className="hover:bg-white text-white hover:text-black w-8 h-8 rounded-full focus:outline-none transition-colors bg-transparent border border border-[#23283a]"
                  >
                    <i className="fas fa-arrow-up"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-[#5A5F7D] text-center mb-2 mt-5 max-w-4xl mx-auto px-4 leading-tight">
            Sathi uses AI. Check for mistakes. Conversations are used to train AI and
            Sathi can learn about your interests. Change this anytime in your{" "}
            <button className="underline text-[#5A5F7D] hover:text-white font-semibold" type="button">
              settings
            </button>
            {" "} or {" "}
            <button className="underline text-[#5A5F7D] hover:text-white font-semibold" type="button">
              learn more
            </button>
            .
          </p>
        </div>


      </div>
    </div>
  );
}


export default ChatUI;




  // return (
  //   <div className="h-screen bg-[#0f1117] w-full flex font-inter">

  // <SidebarProvider>
  //   <Sidebar>
  //     <AppSidebar
  //       onSelectChatSession={handleSelectChatSession}
  //       refetchChatSessions={refetchChatSessions}
  //       onNewSessionClick={handleNewSessionClick}
  //     />
  //   </Sidebar>
  //   <SidebarTrigger className="text-gray-400" />
  // </SidebarProvider>
  //     <div className=" flex-1 bg-[#0f1117] text-white w-full flex flex-col">
  //       {/* Header section */}
  //       <div className="flex items-center p-1">
  //         <div className="flex justify-center items-center flex-grow mt-2">
  //           <img
  //             alt="Copilot logo with blue, purple, and pink gradient shapes"
  //             className="w-10 h-10"
  //             height="20"
  //             src={geneticSvg}
  //             width="20"
  //           />
  //         </div>
  //         <button
  //           onClick={handleLogout}
  //           className="ml-auto p-3 rounded-full hover:bg-gray-800 transition-colors button-hover">
  //           <i className="fas fa-sign-out-alt text-gray-200"></i>
  //         </button>
  //       </div>
  //       {/* Suggetion content */}
  // {welcomeMounted && (messages.length === 0 || input === 300) && input.length <= 300 && (
  //   <div
  //     className={`text-center w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto justify-center mt-24 sm:mt-40 md:mt-[100px] lg:mt-[200px]  transition-opacity duration-500 ease-in-out
  //       ${showWelcome ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
  //     `}
  //   >

  //     <div className="text-center w-full px-2 sm:px-4">
  //       <h1 className="text-white font-semibold text-2xl md:text-4xl leading-tight mb-2">
  //         {getGreeting()}, {userName.split(" ")[0]}.😊
  //       </h1>
  //       <h2 className="text-white font-semibold text-lg md:text-3xl leading-tight mb-6">
  //         ❤️ What can I help you with today?
  //       </h2>
  //       <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-xs sm:max-w-xl mx-auto">
  //         {quickActions.map((action, idx) => (
  //           <button
  //             key={idx}
  //             className=" px-3 py-2 font-normal sm:text-sm md:text-md lg:text-md text-white whitespace-nowrap rounded-2xl shadow-lg max-w-[80%] border border-[#3B4A5A] hover:bg-[#3B4A5A]"
  //             type="button"
  //           >
  //             {action}
  //           </button>
  //         ))}
  //       </div>
  //     </div>
  //   </div>
  // )}
  //       {/* Chat area */}
  //       <div className="h-screen flex-1 flex flex-col h-full overflow-hidden">
  //         {/* Messages section */}
  //         <div className="flex-1 text-gray-300 text-sm overflow-y-auto px-5 scrollbar scrollbar-thumb-[#262d3d] scrollbar-track-[#0f1117]">
  //           <div className="max-w-2xl mx-auto w-full py-6 space-y-2">
  // {messages.map((msg, index) => (
  //   (msg.message && msg.message.trim() !== "") ? (
  //     <div key={index} className={`flex ${msg.name === 'User' ? 'justify-end' : 'justify-start'}`}>
  //       <div className={`mt-2 mb-2  ${msg.name === 'User' ? 'px-3 py-2 shadow-lg max-w-[80%] break-words rounded-2xl bg-[#1e2942] bg-opacity-50' : ''}`}>
  //         <ReactMarkdown >
  //           {msg.message}
  //         </ReactMarkdown>
  //       </div>
  //     </div>
  //   ) : null
  // ))}
  // {loading && (
  //   <div className="flex justify-start">
  //     <div className="typing-indicator">
  //       <span></span>
  //       <span></span>
  //       <span></span>
  //     </div>
  //   </div>
  // )}
  //             <div ref={messagesEndRef} />
  //           </div>
  //         </div>
  //         {/* Input section */}
  // <div className="rounded-xl mx-auto w-full max-w-[710px] px-4">
  //   <div className="bg-[#0B0E17] rounded-[32px] p-[18px] mb-[10px] shadow-[0_3px_20px_0_rgba(40,50,70,0.95)] border border-[#181B24]">
  //     <div className="flex flex-col">
  //       <textarea
  //         ref={textareaRef}
  //         value={input}
  //         onChange={(e) => setInput(e.target.value)}

  //         onInput={e => {
  //           e.target.style.height = 'auto';
  //           e.target.style.height = e.target.scrollHeight + 'px';
  //         }}
  //         onKeyDown={(e) => {
  //           if (e.key === 'Enter' && !e.shiftKey) {
  //             e.preventDefault();
  //             handleSendMessage();
  //           }
  //         }}
  //         placeholder="Ask anything"
  //         rows={1}
  //         className="pl-2 bg-transparent text-gray-200 w-full focus:outline-none text-sm mb-2 placeholder-gray-500 placeholder:font-semibold resize-none overflow-hidden scrollbar"
  //         style={{ minHeight: '20px', maxHeight: '420px' }}
  //       />
  //     </div>
  //     <div className="flex gap-2">
  //       <div className=" flex items-center gap-2 ">
  //         {/* Quick Response button */}
  //         <CustomQuickResponseDropdown
  //           value={responseType}
  //           onChange={setResponseType}
  //         />
  //       </div>
  //       <div className=" flex items-center gap-2 ml-auto ">
  //         <button
  //           onClick={handleSendMessage}
  //           className={`w-8 h-8 rounded-full hover:bg-white hover:text-black focus:outline-none transition-colors border border-[#363c4d] ${input
  //             ? 'bg-white text-black'
  //             : 'bg-[#141820] text-white '
  //             }`}
  //         >
  //           <i className="fas fa-arrow-up"></i>
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // </div>
  //         <p className="text-[10px] text-[#5A5F7D] text-center mb-2 mt-5 max-w-4xl mx-auto px-4 leading-tight">
  //           Sathi uses AI. Check for mistakes. Conversations are used to train AI and
  //           Sathi can learn about your interests. Change this anytime in your{" "}
  //           <button className="underline text-[#5A5F7D] hover:text-white font-semibold" type="button">
  //             settings
  //           </button>
  //           {" "} or {" "}
  //           <button className="underline text-[#5A5F7D] hover:text-white font-semibold" type="button">
  //             learn more
  //           </button>
  //           .
  //         </p>
  //       </div>
  //     </div>
  //   </div>
  // );


