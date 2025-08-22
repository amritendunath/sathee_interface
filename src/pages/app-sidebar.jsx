import * as React from "react"
import { useState, useEffect } from "react"
import "../styles/styles.css"
import "../components/styles/App.css";
import axios from 'axios';
import { SquarePen, MessageCircle, CalendarCheck2, Loader } from "lucide-react"


export function AppSidebar({ onSelectChatSession, onNewSessionClick, onCurrentSessionId }) {
  const [chatSessions, setChatSessions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [userImage, setUserImage] = useState('')
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchChatSessions();
    fetchAppointments();
    console.log("fetchChatSessions&fetchAppointments")
  }, [onCurrentSessionId])

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserEmail(payload.sub);
      setUserName(payload.name);
      setUserId(payload.user_ehr_id);
      if (payload.picture) {
        setUserImage(payload.picture);
      }
      else {
        setUserImage('https://storage.googleapis.com/a1aa/image/WkpYEcLxO0KkSzrfJExcmisxBg5otmGO4IHGBHlju5Q.jpg')
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      window.location.href = '/login';
    }
  });

  const fetchChatSessions = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_POINT_AGENT}/api/v1/generate-stream/chat-sessions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response.data && response.data.sessions) {
        const sortedSessions = response.data.sessions.sort((a, b) =>
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        setChatSessions(sortedSessions);
      } else {
        console.warn("No sessions data received or sessions is undefined");
      }
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      if (error.response) {
        console.error('HTTP error:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up the request:', error.message);
      }
    }
  };

  const fetchAppointments = async () => {
    try {
      const appointmentsResponse = await axios.post(`${process.env.REACT_APP_POINT_REC}/booked`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const appointmentsData = await appointmentsResponse.data;
      console.log(appointmentsData)
      if (appointmentsData.data) {
        console.log('Appointments loaded:', appointmentsData.data);
        setAppointments(appointmentsData.data);
      }
    }
    catch (error) {
      console.error('Error fetching appointments:', error);
    }
  }

  const newSession = async () => {
    setLoading(true)
    try {
      const createSession = await axios.post(`${process.env.REACT_APP_POINT_AGENT}/api/v1/generate-stream/new-session`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log("NewSessionCreated", createSession)
      if (onNewSessionClick) {
        onNewSessionClick();
      }
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  return (
    <aside className="bg-[#141820] flex flex-col justify-between p-2 text-white h-screen" >
      <div >
        <div className="flex items-center px-1 py-[2px] mb-3 hover:bg-[#141820] bg-[#1e2233] transition-all duration-200 rounded-md border border-gray-700/30 hover:border-gray-700/50 hover:shadow-lg">
          <img
            src={userImage}
            alt="User avatar"
            className="rounded-full w-9 h-9 mr-3"
            width="10"
            height="10"
          />
          <div>
            <div className="text-gray-300 text-xs font-semibold">{userName}</div>
            <div className="text-gray-400 text-xs font-semibold">ID: {userId} | Free </div>
            <div className="text-gray-400 text-xs font-semibold">{userEmail}</div>
          </div>
        </div>
      </div>
      <div>
        <button
          onClick={newSession}
          type="button"
          className="text-[13px] text-white mb-1 text-left truncate w-full rounded-lg px-2 hover:bg-[#1e2942] py-[6px]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <SquarePen size={15} className="mr-[6px] mt-[1px]" /> New Chat
            </div>
            {loading ? <Loader size={16} color="#fff" className="loader" /> : ''}
          </div>
        </button>
      </div>
      {chatSessions.length > 0 ? (

        <div className="flex justify-between items-center w-full max-w-[300px] text-[13px] mb-2 mt-2 text-gray-300">
          <div className="flex items-center text-xs">
            Chats <MessageCircle className="ml-1" size={12} />
          </div>
        </div>

      ) : (
        null
      )}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-side ">
        <div className="flex flex-col text-sm overflow-y-auto "
        >
          {chatSessions && chatSessions.length > 0 ? (
            chatSessions.map((session) => (
              <button
                key={session._id}
                className="text-white mb-1 text-left truncate w-full rounded-lg px-2 hover:bg-[#1e2942] py-[6px]"
                onClick={() => onSelectChatSession(session.session_id)}
                type="button"
              >
                <div className="flex flex-col">
                  <span className="text-white">
                    {session.session_title || `Chat Session ${session.session_id.slice(-4)}`}
                  </span>
                </div>
              </button>
            ))
          ) : (
            null
          )}
        </div>
      </div>
      <div className="text-xs font-semibold text-white mb-1 mt-3 select-none">
        {appointments.length > 0 ? (
          <div className="flex items-center text-xs text-gray-300 select-none font-semibold">
            Appointments <CalendarCheck2 className="ml-1" size={12} />
          </div>
        ) : null}
      </div>
      <div className="mt-2 flex-shrink-0">
        <div className="flex flex-col space-y-3">
          {appointments && appointments.length > 0 ? (
            appointments.map((appointment) => (
              <button
                key={appointment.date_slot}
                className="text-xs w-full text-left px-2 py-1 hover:bg-[#1e2233] transition-all duration-200 rounded-md border border-gray-700/30 hover:border-gray-700/50 hover:shadow-lg " // Applied simplified styling
                type="button"
              >
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400">Dr. {appointment.doctor_name.toUpperCase()}</span>
                    <span className="text-gray-400">
                      {appointment.specialization.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">
                      {appointment.hospital_name.toUpperCase()}
                    </span>
                    <span className="text-gray-100 ml-1">
                      {appointment.date_slot}
                    </span>
                  </div>
                </div>
              </button>
            ))
          ) : null
          }
        </div>
      </div>
    </aside>
  );
}
