import React, { useEffect, useState, useRef, useCallback } from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import "tailwindcss/tailwind.css";
import "../components/styles/App.css";
import { useIsMobile } from "../hooks/use-mobile";
import { AppSidebar } from "./app-sidebar";
import { HiOutlineLightBulb } from "react-icons/hi";
import axios from "axios";
import { CustomQuickResponseDropdown } from "../components/ui/modebutton";
import MessageBubble from "../components/ui/message_markdown";
import {
  Lightbulb, GraduationCap, PanelLeftOpen, PanelRightOpen, NotepadText,
  PencilLine, HeartHandshake, LogOut
} from 'lucide-react';
import AssistantService from "../AssistantService";
import SendButton from '../components/ui/send_button'




const ChatUI = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [responseType, setResponseType] = useState("quick");
  const [showWelcome, setShowWelcome] = useState(true)
  const [welcomeMounted, setWelcomeMounted] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const startAccumulatedResponseRef = useRef("");
  const [hasStarted, setHasStarted] = useState(false)
  const [threadId, setThreadId] = useState('')




  useEffect(() => {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token.split('.')[1]));
    setUserName(payload.name)
    if (!token) {
      window.location.href = '/login';
      return;
    }
    scrollToBottom()
  }, [messages]);

  // Greeting the user as per time shift = (morning/afternoon/evening)
  const getGreetingUI = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) {
      return "Good morning";
    } else if (hour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  // Holding the last message at the most of the end to get the recent ones in a chat session
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Create a new view if new_session button has clicked in the @app-sidebar
  const handleNewSession = () => {
    setMessages([]);
    setShowWelcome(true);
    setWelcomeMounted(true);
  };

  // End the current session
  const handleEndSession = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_POINT_AGENT}/api/v1/generate-stream/end-session`,
        {},
        {
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
      setMessages([]);
      setCurrentSessionId(null);

    } catch (error) {
      console.error('Error ending session:', error);
      throw error; // Propagate error to caller
    }
  };

  // Logout from the current session
  const handleLogout = async () => {
    try {
      await handleEndSession(); // End the session before logging out
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
      // Still proceed with logout even if session end fails
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }

  // Start the Server Side Events 
  const startSSE = async (e) => {
    let messageToSend = null;

    if (e && e.target && e.target.textContent) {
      messageToSend = String(e.target.textContent);
    } else {
      messageToSend = input;
    }

    const userMessage = {
      name: 'User',
      message: messageToSend,
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
      }, 200);
    } else {
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '20px';
      }
      setLoading(true)
    }
    try {
      // Streaming API call
      const data = await AssistantService.createStreamingConversation(
        messageToSend,
        responseType
      );
      setHasStarted(true)
      setThreadId(data.thread_id);
      const token = localStorage.getItem('token');

      // Reset the accumulated response ref for this session
      startAccumulatedResponseRef.current = "";
      // setMessages((prev) => [...prev, ""])
      // setMessages((prevMessages) => [
      //   ...prevMessages,
      //   { name: 'Sathi', message: '' } // Initialize Sathi's message
      // ]);

      // Start streaming the response
      const eventSource = AssistantService.streamResponse(
        data.thread_id,
        (data) => {
          if (data && data.content) {
            // Update our ref with the new content
            startAccumulatedResponseRef.current += data.content;
            // setHasStarted(true)
            setLoading(false)
            setMessages((prev) => {
              const lastMessage = prev.length > 0 ? prev[prev.length - 1] : null;
              if (lastMessage && lastMessage.name === 'Sathi') {
                // If the last message is from Sathi, update it
                const updatedMessages = [...prev];
                updatedMessages[prev.length - 1] = {
                  ...lastMessage,
                  message: startAccumulatedResponseRef.current,
                };
                return updatedMessages;
              } else {
                // If the last message is not from Sathi, create a new message
                return [...prev, { name: 'Sathi', message: startAccumulatedResponseRef.current }];
              }
            });

          }
        },
        // Error callback
        (error) => {
          console.error("Streaming error:", error);
          // Check if error has a message property before using it
          const errorMessage = error && error.message ? error.message : "Unknown error";
          alert("Streaming error: " + errorMessage);
          setHasStarted(false)
        },
        // Complete callback
        () => {
          console.log("Stream completed");
          setHasStarted(false)
          // Final history update is already handled in the message callback
        }

      );
    } catch (err) {
      setMessages("");
      // Check if error has a message property before using it
      const errorMessage = err && err.message ? err.message : "Unknown error";
      alert("Failed to contact backend: " + errorMessage);
      setHasStarted(false)
    }

  };

  // Stop the Server Side Events 
  const stopSSE = async () => {
    AssistantService.stopStreaming();
    setHasStarted(false)
    setLoading(false)
  }

  // Refresh the chat_history if new chat_session has been created
  const handleSelectChatSession = (sessionId) => {
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
  };


  // const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768)

  useEffect(() => {
    if (!isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);
  const closeSidebar = () => setIsOpen(false);

  // useEffect(() => {
  //   const handleResize = () => {
  //     const mobile = window.innerWidth < 768
  //     setIsMobile(mobile)
  //     setIsOpen(!mobile)
  //   }

  //   window.addEventListener('resize', handleResize)
  //   return () => window.removeEventListener('resize', handleResize)
  // }, [])

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
  const handleSendMessage = async () => {
    const userMessage = {
      name: 'User',
      message: input
    }
    setMessages((prev) => [...prev, userMessage]);
    setInput('')
    const messageToSend = {
      name: userMessage.name,
      messages: userMessage.message
    }
    const response_data = await makeApiCall(messageToSend.messages);
    const answer = response_data.answer || "No response from API";
    const botMessage = {
      name: 'Sathi',
      message: answer,
    };
    setMessages((prev) => [...prev, botMessage]);
  }
  return (

    <div className="h-screen w-full flex bg-[#0f1117]" >
      <div className="pointer-events-none fixed inset-0" aria-hidden>
        {/* Top center animated glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-gradient-to-br from-sky-400/10 via-blue-500/10 to-indigo-400/5 blur-[140px] animate-glow" />

        {/* Bottom right animated glow */}
        <div className="absolute bottom-[-200px] right-[-150px] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-cyan-400/10 via-blue-500/5 to-indigo-500/3 blur-[140px] animate-glow delay-2000" />

        {/* Bottom left animated glow */}
        <div className="absolute bottom-[-250px] left-[-150px] w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-indigo-500/10 via-blue-400/5 to-sky-400/3 blur-[140px] animate-glow delay-4000" />
      </div>




      {/* Sidebar Overlay for Mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          // className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      {/* Sidebar */}
      <div
        // className={`
        // w-64 bg-muted flex flex-col transition-all duration-300
        // ${isMobile ? `fixed z-30 h-full ${isOpen ? 'translate-x-0' : '-translate-x-full'}` : 'relative'}
        // `}
        className={`
      w-64 h-full bg-muted flex flex-col transition-transform duration-300
      fixed z-30 
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}

    `}
      >
        <AppSidebar
          onSelectChatSession={handleSelectChatSession}
          onNewSessionClick={handleNewSession}
          onCurrentSessionId={hasStarted}
        />
      </div>


      {/* Main content */}
      <div className="flex-1 flex flex-col bg-[#0f1117] text-white w-full">
        <div className="absolute flex items-center p-1 ">
          {isMobile && (
            <button
              className={
                `mt-4 text-gray-200 absolute top-0 left-0 m-2 focus:outline-none transition-transform transform button-hover hover:text-cyan-400
                `
              }
              onClick={() => setIsOpen(true)}
            >
              <PanelLeftOpen size={22} />
            </button>
          )}
          {!isMobile && (
            <>
              {isOpen ? (
                <button
                  className="translate-x-64 text-gray-200 top-0 left-0 m-2 z-40 focus:outline-none "
                  onClick={() => setIsOpen(prev => !prev)}
                >
                  <PanelRightOpen size={22} />
                </button>
              ) : (

                <button
                  className="text-gray-200 top-0 left-0 m-2 z-40 focus:outline-none button-hover hover:text-cyan-400"
                  onClick={() => setIsOpen(prev => !prev)}
                >
                  <PanelLeftOpen />
                </button>
              )}
            </>
          )}
          {/* <img
            alt="Copilot logo with blue, purple, and pink gradient shapes"
            className="w-10 h-10 flex justify-center items-center flex-grow"
            height="20"
            src={geneticSvg}
            width="20"
          /> */}
        </div>
        <button
          onClick={handleLogout}
          // className="ml-auto p-3 rounded-full transition-colors button-hover hover:text-red-200">
          className="absolute top-0 right-0 m-1 mr-2 p-3 rounded-full transition-colors button-hover hover:text-red-200">
          <LogOut size={20} />
        </button>
        {welcomeMounted && (messages.length === 0 || input === 300) && input.length <= 300 && (
          <div
            className={`text-center w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto justify-center mt-24 sm:mt-40 md:mt-[40px] lg:mt-[80px]  transition-opacity duration-500 ease-in-out
              ${showWelcome ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}
          >

            <div className="text-center w-full px-2 sm:px-4 ">
              <h1 className="text-white font-semibold text-[28px] leading-tight mb-2">
                {getGreetingUI()}, {userName.split(" ")[0]}
              </h1>
              <h2 className="text-white font-semibold text-[28px] leading-tight mb-6">
                What can I help you with today?
              </h2>
              {/* <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-xs sm:max-w-xl mx-auto">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    className=" px-3 py-2 font-normal sm:text-sm md:text-md lg:text-md text-white whitespace-nowrap rounded-2xl shadow-lg max-w-[80%] border border-[#3B4A5A] hover:bg-[#3B4A5A]"
                    type="button"
                  >
                    {action}
                  </button>
                ))}
              </div> */}
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="max-w-3xl text-center">
                  {/* Quick Start Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="p-4 border-2 border-[#363C4D] border-opacity-60 rounded-[32px] hover:bg-[#1f212c] cursor-pointer transition-colors"
                      onClick={(e) => {
                        startSSE(e);
                      }}
                    >
                      <div className="text-left">
                        <h3 className="font-medium mb-1 flex">
                          <Lightbulb className="h-5 w-5 text-yellow-500 mb-2 mr-2" />
                          Brainstroms
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Brainstorm creative solutions like you want
                        </p>

                      </div>
                    </div>
                    <div className="p-4 border-2 border-[#363C4D] border-opacity-60 rounded-[32px] hover:bg-[#1f212c] cursor-pointer transition-colors"
                      onClick={(e) =>
                        startSSE(e)
                      }
                    >
                      <div className="text-left">
                        <h3 className="font-medium mb-1 flex"

                        >
                          <HeartHandshake className="h-5 w-5 text-blue-500 mb-2 mr-2" />
                          Heart help
                        </h3>
                        <p className="text-sm text-muted-foreground">Diagnose your heart and body</p>
                      </div>
                    </div>
                    <div className="p-4 border-2 border-[#363C4D] border-opacity-60 rounded-[32px] hover:bg-[#1f212c] cursor-pointer transition-colors"
                      onClick={(e) =>
                        startSSE(e)
                      }
                    >
                      <div className="text-left">
                        <h3 className="font-medium mb-1 flex"

                        >
                          <GraduationCap className="h-5 w-5 text-green-500 mb-2 mr-2" />
                          Learn more
                        </h3>
                        <p className="text-sm text-muted-foreground">Understand complex topics</p>
                      </div>
                    </div>
                    <div className="p-4 border-2 border-[#363C4D] border-opacity-60 rounded-[32px] hover:bg-[#1f212c] cursor-pointer transition-colors"
                      onClick={(e) =>
                        startSSE(e)
                      }
                    >
                      <div className="text-left">
                        <h3 className="font-medium mb-1 flex"

                        >
                          <NotepadText className="h-5 w-5 text-violet-500 mb-2 mr-2" />
                          Take a quiz
                        </h3>
                        <p className="text-sm text-muted-foreground">Quiz on the topics you like</p>
                      </div>
                    </div>
                    <div className="p-4 border-2 border-[#363C4D] border-opacity-60 rounded-[32px] hover:bg-[#1f212c] cursor-pointer transition-colors"
                      onClick={(e) =>
                        startSSE(e)
                      }
                    >
                      <div className="text-left">
                        <h3 className="font-medium mb-1 flex"

                        >
                          <PencilLine className="h-5 w-5 text-pink-500 mb-2 mr-2" />
                          Get advice
                        </h3>
                        <p className="text-sm text-muted-foreground">Get advice on topics you like</p>
                      </div>
                    </div>
                    <div className="p-4 border-2 border-[#363C4D] border-opacity-60 rounded-[32px] hover:bg-[#1f212c] cursor-pointer transition-colors"
                      onClick={(e) =>
                        startSSE(e)
                      }
                    >
                      <div className="text-left">
                        <h3 className="font-medium mb-1 flex"
                          onClick={(e) =>
                            startSSE(e)
                          }
                        >
                          <HiOutlineLightBulb className="h-5 w-5 text-cyan-500 mb-2 mr-2" />
                          Make a plan
                        </h3>
                        <p className="text-sm text-muted-foreground">Plans that make a day more</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto scrollbar">
          <div className="mt-10 mb-[150px] sm:p-4 sm:space-y-2 md:space-y-4 max-w-4xl mx-auto text-gray-200 text-[14px]">
            {messages.map((msg, index) => (
              (typeof msg.message === 'string') ? (
                <MessageBubble
                  message={{
                    role: msg.name === 'User' ? 'user' : 'assistant',
                    content: msg.message
                  }}
                />
              ) : null))}
            {loading && (
              <div className="flex justify-start">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 left-0 right-0 from-[#0f1117] via-[#0f1117]/90 to-transparent bg-gradient-to-t ">
          <div className="p-6 max-w-2xl mx-auto">
            <div className="bg-[#0B0E17] rounded-[32px] p-[18px] mb-[10px] shadow-[0_3px_20px_0_rgba(40,50,70,0.95)] border border-[#181B24]">
              <div className="flex flex-col">
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
                      startSSE()
                    }
                  }}
                  placeholder="Ask anything"
                  rows={1}
                  className="pl-2 bg-transparent text-gray-200 w-full focus:outline-none text-sm mb-2 placeholder-gray-500 placeholder:font-semibold resize-none overflow-hidden scrollbar-input_box"
                  style={{ minHeight: '20px', maxHeight: '420px' }}
                />
              </div>
              <div className="flex gap-2 ">
                <CustomQuickResponseDropdown
                  value={responseType}
                  onChange={setResponseType}
                />
                <SendButton
                  isStarting={hasStarted}
                  input={input}
                  startSSE={startSSE}
                  stopSSE={stopSSE}
                />
              </div>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}


export default ChatUI;



// export default function WrappedChatUI(props) {
//   return (
//     <SidebarProvider>
//       <ChatUI {...props} />
//     </SidebarProvider>
//   );
// }
// {Array.isArray(messages) ? (
//   messages.map((msg, index) => {
//     if (typeof msg.message === 'string') {
//       const trimmedMessage = msg.message.trim();
//       if (trimmedMessage !== "") {
//         return (
//           <MessageBubble
//             key={index}
//             message={{
//               role: msg.name === 'User' ? 'user' : 'assistant',
//               content: msg.message,
//             }}
//           />
//         );
//       }
//     }
//     return null;
//   })
// ) : (
//   null
// )}

// <div className="flex-1 overflow-y-auto scrollbar">
//   <div className="mb-[150px] p-6 space-y-6 max-w-4xl mx-auto text-gray-200 text-[14px]">
// {messages.map((msg, index) => {
//   if (typeof msg.message === 'string') {
//     const trimmedMessage = msg.message.trim();
//     if (trimmedMessage !== "") {
//       return (
//         <MessageBubble
//           key={index}
//           message={{
//             role: msg.name === 'User' ? 'user' : 'assistant',
//             content: msg.message,
//           }}
//         />
//       );
//     }
//   }
//   return null;
// })}

// {messages.map((msg, index) => (
//   (typeof msg.message && msg.message.trim() !== "") ? (
//     <MessageBubble
//       message={{
//         role: msg.name === 'User' ? 'user' : 'assistant',
//         content: msg.message
//       }}
//     />
//   ) : null

// <div className="flex-1 overflow-y-auto scrollbar">
//   <div className="mb-[150px] p-6 space-y-6 max-w-4xl mx-auto text-gray-200 text-[14px]">
//     {messages.map((msg, index) => (
//       (msg.message && msg.message.trim() !== "") ? (
//         <div key={index} className={`flex ${msg.name === 'User' ? 'justify-end' : 'justify-start'}`}>
//           <div className={`mt-2 mb-2  ${msg.name === 'User' ? 'px-3 py-2 shadow-lg max-w-[80%] break-words rounded-2xl bg-[#1e2942] bg-opacity-50' : ''}`}>
//             {msg.message}
//           </div>
//         </div>
//       ) : null
//     ))}


// ##############################################################################################################################################################
// ##############################################################################################################################################################
// const updateChatSessionsRef = useRef();
// // Function to update chat sessions in AppSidebar
// const handleUpdateChatSessions = useCallback((newSessions) => {
//   setChatSessions(newSessions);
// }, []);
// useEffect(() => {
//   updateChatSessionsRef.current = handleUpdateChatSessions;
// }, [handleUpdateChatSessions]);

// const refetchChatSessions = useCallback(() => {
//   fetch(`${process.env.REACT_APP_POINT_AGENT}/api/v1/generate-stream/chat-sessions`, {
//     method: 'GET',
//     headers: {
//       'Authorization': `Bearer ${localStorage.getItem('token')}`,
//     }
//   })
//     .then(response => response.json())
//     .then(data => {
//       if (data.sessions) {
//         const sortedSessions = data.sessions.sort((a, b) =>
//           new Date(b.timestamp) - new Date(a.timestamp)
//         );
//         // Call a function in AppSidebar to update the chat sessions
//         handleUpdateChatSessions(sortedSessions);
//       }
//     })
//     .catch(error => console.error('Error fetching chat sessions:', error));
// }, []);
