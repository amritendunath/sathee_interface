  // return (
  //   <Sidebar className="bg-[#161923] text-white">
  //     {/* <SidebarHeader className="bg-[#161923] border-b border-gray-700/50">
  //       <div className="p-6 flex flex-col space-y-3">
  //         <div className="flex items-center justify-between">
  //           <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
  //             Sathi 1.0
  //           </span>
  //         </div>
  //       </div>
  //     </SidebarHeader> */}
  //     <SidebarContent className="bg-[#161923] p-4">
  //       <SidebarGroup>
  //         <SidebarGroupContent >
  //           <SidebarGroupLabel className="px-2 py-8 text-gray-400 text-sm font-bold border-t border-gray-700/50 mt-8">
  //             Previous Chat Sessions
  //           </SidebarGroupLabel>
  //           <SidebarMenu className="flex-col text-sm overflow-y-auto max-h-[calc(100vh-300px)] scrollbar scrollbar-thumb-[#262d3d] scrollbar-track-[#0f1117]">
  //             {chatSessions && chatSessions.length > 0 ? (
  //               chatSessions.map((sessions) => (
  //                 <SidebarMenuItem key={sessions.session_id} >
  //                   <SidebarMenuButton
  //                     className="w-full text-left p-8 hover:bg-[#1e2233] transition-all duration-200 rounded-xl 
  //                     border border-gray-700/30 hover:border-gray-700/50 hover:shadow-lg"
  //                     onClick={() => onSelectChatSession(sessions.session_id)}
  //                   >
  //                     <div className="flex flex-col space-y-3">
  //                       <div className="flex items-center space-x-3">
  //                         <span className="text-sm font-medium text-blue-400">
  //                           {sessions.title || 'Chat Session'}
  //                         </span>
  //                       </div>
  //                       <span className="text-xs text-gray-400">
  //                         {new Date(sessions.timestamp).toLocaleString()}
  //                       </span>
  //                     </div>
  //                   </SidebarMenuButton>
  //                 </SidebarMenuItem>
  //               ))
  //             ) : (
  //               <div className="text-center py-8 text-gray-500 bg-gray-800/20 rounded-xl border border-gray-700/30">
  //                 <p className="text-sm">No chat sessions yet</p>
  //               </div>
  //             )}
  //           </SidebarMenu>

  //           <SidebarGroupLabel className="px-2 py-8 text-gray-400 text-sm font-bold border-t border-gray-700/50 mt-8">
  //             Upcoming Appointments
  //           </SidebarGroupLabel>
  //           <SidebarMenu className="space-y-3">
  //             {appointments && appointments.length > 0 ? (
  //               appointments.map((appointment) => (
  //                 <SidebarMenuItem key={appointment.appointment_date}>
  //                   <SidebarMenuButton
  //                     className="w-full text-left p-10 hover:bg-[#1e2233] transition-all duration-200 rounded-xl 
  //                     border border-gray-700/30 hover:border-gray-700/50 hover:shadow-lg"
  //                   >
  //                     <div className="flex flex-col space-y-3">
  //                       <div className="flex items-center justify-between">
  //                         <span className="text-sm font-medium text-purple-400">Dr. {appointment.doctor_name}</span>
  //                         <span className={`text-xs px-4 py-1.5 rounded-full ${appointment.status === 'confirmed'
  //                             ? 'bg-green-500/20 text-green-400'
  //                             : appointment.status === 'pending'
  //                               ? 'bg-yellow-500/20 text-yellow-400'
  //                               : 'bg-blue-500/20 text-blue-400'
  //                           }`}>
  //                           {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
  //                         </span>
  //                       </div>
  //                       <span className="text-xs text-gray-400">
  //                         {new Date(appointment.appointment_date).toLocaleString()}
  //                       </span>
  //                     </div>
  //                   </SidebarMenuButton>
  //                 </SidebarMenuItem>
  //               ))
  //             ) : (
  //               <div className="text-center py-8 text-gray-500 bg-gray-800/20 rounded-xl border border-gray-700/30">
  //                 <p className="text-sm">No upcoming appointments</p>
  //               </div>
  //             )}
  //           </SidebarMenu>
  //         </SidebarGroupContent>
  //       </SidebarGroup>
  //     </SidebarContent>
  //   </Sidebar>
  // );





// import * as React from "react";
// import { useState, useEffect } from "react";
// import "../styles/styles.css";
// import "../components/styles/App.css";

// export function AppSidebar({ onSelectChatSession }) {
//   const [chatSessions, setChatSessions] = useState([]);
//   const [appointments, setAppointments] = useState([]);

//   useEffect(() => {
//     // Fetch chat sessions from the server
//     fetch('http://localhost:8000/api/v1/generate-stream/chat-sessions', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//       }
//     })
//       .then(response => response.json())
//       .then(data => {
//         if (data.sessions) {
//           // Sort sessions by timestamp in descending order
//           const sortedSessions = data.sessions.sort((a, b) =>
//             new Date(b.timestamp) - new Date(a.timestamp)
//           );
//           setChatSessions(sortedSessions);
//         }
//       })
//       .catch(error => console.error('Error fetching chat sessions:', error));

//     fetch('http://localhost:8000/api/v1/generate-stream/appointment/', {  // Note the trailing slash
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'application/json'
//       }
//     })
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then(data => {
//         if (data.appointments) {
//           console.log('Appointments loaded:', data.appointments);
//           setAppointments(data.appointments);
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching appointments:', error);
//       });
//   }, []);

//   return (
//     // Replaced custom Sidebar component with <aside> and applied styles from index.html
//     <aside className="w-64 bg-[#0D111F] flex flex-col justify-between p-4 text-white">
//       <div>
//         {/* Copilot logo and text section from index.html */}
//         <div className="flex items-center gap-2 mb-6">
//           <img
//             alt="Copilot logo with blue, purple, and pink gradient shapes"
//             className="w-5 h-5"
//             height="20"
//             src="https://storage.googleapis.com/a1aa/image/e878a716-f73d-49d3-f0df-7697b0b89a40.jpg"
//             width="20"
//           />
//           <span className="font-semibold text-white text-base select-none">
//             Sathi 1.0 {/* Changed text to Sathi 1.0 */}
//           </span>
//           {/* Removed extra buttons from index.html example if not needed */}
//           {/* <button className="ml-2 text-white opacity-80 hover:opacity-100">
//             <i className="fas fa-book-open text-sm"></i>
//           </button>
//           <button className="ml-1 text-white opacity-80 hover:opacity-100">
//             <i className="fas fa-pen-nib text-sm"></i>
//           </button>
//           <button className="ml-1 text-white opacity-80 hover:opacity-100">
//             <i className="fas fa-check text-sm"></i>
//           </button>
//           <button className="ml-1 text-white opacity-80 hover:opacity-100">
//             <i className="fas fa-caret-down text-sm"></i>
//           </button> */}
//         </div>

//         {/* Previous Chat Sessions Section */}
//         {/* Replaced SidebarGroupLabel with div and applied styles */}
//         <div className="text-xs font-semibold text-white mb-1 select-none">
//           Previous Chat Sessions
//         </div>
//         {/* Replaced SidebarMenu and its content structure */}
//         <div className="flex flex-col text-sm overflow-y-auto max-h-[calc(100vh-300px)] scrollbar scrollbar-thumb-[#262d3d] scrollbar-track-transparent"> {/* Added scrollbar classes */}
//           {chatSessions && chatSessions.length > 0 ? (
//             chatSessions.map((session) => (
//               // Replaced SidebarMenuItem and SidebarMenuButton with a button
//               <button
//                 key={session.session_id}
//                 className="text-sm font-normal text-white mb-1 text-left truncate w-full hover:underline" // Applied styles from index.html button
//                 onClick={() => onSelectChatSession(session.session_id)}
//                 type="button"
//               >
//                 {/* Display session title and timestamp */}
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-blue-400">
//                     {session.title || `Chat Session ${session.session_id.slice(-4)}`} {/* Added fallback title */}
//                   </span>
//                   <span className="text-xs text-gray-400">
//                     {new Date(session.timestamp).toLocaleString()}
//                   </span>
//                 </div>
//               </button>
//             ))
//           ) : (
//             <div className="text-center py-4 text-gray-500 text-sm"> {/* Simplified styling */}
//               No chat sessions yet
//             </div>
//           )}
//         </div>

//         {/* Upcoming Appointments Section */}
//         {/* Replaced SidebarGroupLabel with div and applied styles */}
//         {/* Added margin-top to separate from chat sessions */}
//         <div className="text-xs font-semibold text-white mb-1 mt-3 select-none">
//           Upcoming Appointments
//         </div>
//         {/* Replaced SidebarMenu and its content structure */}
//         <div className="flex flex-col space-y-3"> {/* Added space-y-3 for spacing between items */}
//           {appointments && appointments.length > 0 ? (
//             appointments.map((appointment) => (
//               // Replaced SidebarMenuItem and SidebarMenuButton with a button
//               <button
//                 key={appointment.appointment_date} // Using date as key, consider a unique ID if available
//                 className="w-full text-left p-2 hover:bg-[#1e2233] transition-all duration-200 rounded-md border border-gray-700/30 hover:border-gray-700/50 hover:shadow-lg" // Applied simplified styling
//                 type="button"
//               >
//                  <div className="flex flex-col space-y-1"> {/* Adjusted spacing */}
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-medium text-purple-400">Dr. {appointment.doctor_name}</span>
//                       <span className={`text-xs px-2 py-0.5 rounded-full ${ // Adjusted padding
//                         appointment.status === 'confirmed'
//                           ? 'bg-green-500/20 text-green-400'
//                           : appointment.status === 'pending'
//                           ? 'bg-yellow-500/20 text-yellow-400'
//                           : 'bg-blue-500/20 text-blue-400'
//                       }`}>
//                         {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
//                       </span>
//                     </div>
//                     <span className="text-xs text-gray-400">
//                       {new Date(appointment.appointment_date).toLocaleString()}
//                     </span>
//                   </div>
//               </button>
//             ))
//           ) : (
//             <div className="text-center py-4 text-gray-500 text-sm bg-gray-800/20 rounded-md border border-gray-700/30"> {/* Simplified styling */}
//               <p className="text-sm">No upcoming appointments</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* User profile picture at the bottom */}
//       <div className="flex justify-center mt-6"> {/* Added mt-6 for spacing */}
//         <img
//           alt="User profile picture"
//           className="rounded-full"
//           height="40"
//           src="https://storage.googleapis.com/a1aa/image/bd97d4e4-725a-4957-c42f-19e3741f081a.jpg" // Replace with actual user image source if available
//           width="40"
//         />
//       </div>
//     </aside>
//   );
// }


// const fetchAppointments = () => {
//   fetch('http://localhost:8000/api/v1/generate-stream/appointment/', {
//     method: 'GET',
//     headers: {
//       'Authorization': `Bearer ${localStorage.getItem('token')}`,
//       'Content-Type': 'application/json'
//     }
//   })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       return response.json();
//     })
//     .then(data => {
//       if (data.appointments) {
//         console.log('Appointments loaded:', data.appointments);
//         setAppointments(data.appointments);
//       }
//     })
//     .catch(error => {
//       console.error('Error fetching appointments:', error);
//     });
// };

// useEffect(() => {
//   // Initial fetch
//   fetchAppointments();

//   // Set up an interval to refresh appointments every 30 seconds
//   const intervalId = setInterval(fetchAppointments, 30000);

//   // Cleanup interval on component unmount
//   return () => clearInterval(intervalId);
// }, []);










// import * as React from "react";
// import { useState, useEffect } from "react";
// import "../styles/styles.css";
// import "../components/styles/App.css";

// export function AppSidebar({ onSelectChatSession }) {
//   const [chatSessions, setChatSessions] = useState([]);
//   const [appointments, setAppointments] = useState([]);

//   useEffect(() => {
//     // Fetch chat sessions
//     fetch('http://localhost:8000/api/v1/generate-stream/chat-sessions', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//       }
//     })
//       .then(response => response.json())
//       .then(data => {
//         if (data.sessions) {
//           const sortedSessions = data.sessions.sort((a, b) =>
//             new Date(b.timestamp) - new Date(a.timestamp)
//           );
//           setChatSessions(sortedSessions);
//         }
//       })
//       .catch(error => console.error('Error fetching chat sessions:', error));

//     // Fetch appointments
//     fetch('http://localhost:8000/api/v1/generate-stream/appointment/', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'application/json'
//       }
//     })
//       .then(response => {
//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//         return response.json();
//       })
//       .then(data => {
//         if (data.appointments) setAppointments(data.appointments);
//       })
//       .catch(error => console.error('Error fetching appointments:', error));
//   }, []);

//   return (
//     <aside className="w-64 bg-[#0D111F] flex flex-col justify-between p-4 text-white font-inter min-h-screen">
//       <div>
//         {/* Logo and Title */}
//         <div className="flex items-center gap-2 mb-6">
//           <img
//             alt="Copilot logo"
//             className="w-5 h-5"
//             height="20"
//             src="https://storage.googleapis.com/a1aa/image/e878a716-f73d-49d3-f0df-7697b0b89a40.jpg"
//             width="20"
//           />
//           <span className="font-semibold text-white text-base select-none">
//             Sathi 1.0
//           </span>
//         </div>

//         {/* Chat Sessions */}
//         <nav className="text-xs font-semibold text-white mb-1 select-none">
//           Previous Chat Sessions
//         </nav>
//         <div className="flex flex-col text-sm overflow-y-auto max-h-52 scrollbar scrollbar-thumb-[#262d3d] scrollbar-track-transparent">
//           {chatSessions.length > 0 ? (
//             chatSessions.map((session) => (
//               <button
//                 key={session.session_id}
//                 className="text-sm font-normal text-white mb-1 text-left truncate w-full hover:underline"
//                 onClick={() => onSelectChatSession(session.session_id)}
//                 type="button"
//               >
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-blue-400">
//                     {session.title || `Chat Session ${session.session_id.slice(-4)}`}
//                   </span>
//                   <span className="text-xs text-gray-400">
//                     {new Date(session.timestamp).toLocaleString()}
//                   </span>
//                 </div>
//               </button>
//             ))
//           ) : (
//             <div className="text-center py-4 text-gray-500 text-sm">
//               No chat sessions yet
//             </div>
//           )}
//         </div>

//         {/* Appointments */}
//         <div className="text-xs font-semibold text-white mb-1 mt-3 select-none">
//           Upcoming Appointments
//         </div>
//         <div className="flex flex-col space-y-3">
//           {appointments.length > 0 ? (
//             appointments.map((appointment) => (
//               <button
//                 key={appointment.appointment_date}
//                 className="w-full text-left p-2 hover:bg-[#1e2233] transition-all duration-200 rounded-md border border-gray-700/30 hover:border-gray-700/50 hover:shadow-lg"
//                 type="button"
//               >
//                 <div className="flex flex-col space-y-1">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm font-medium text-purple-400">
//                       Dr. {appointment.doctor_name}
//                     </span>
//                     <span className={`text-xs px-2 py-0.5 rounded-full ${
//                       appointment.status === 'confirmed'
//                         ? 'bg-green-500/20 text-green-400'
//                         : appointment.status === 'pending'
//                         ? 'bg-yellow-500/20 text-yellow-400'
//                         : 'bg-blue-500/20 text-blue-400'
//                     }`}>
//                       {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
//                     </span>
//                   </div>
//                   <span className="text-xs text-gray-400">
//                     {new Date(appointment.appointment_date).toLocaleString()}
//                   </span>
//                 </div>
//               </button>
//             ))
//           ) : (
//             <div className="text-center py-4 text-gray-500 text-sm bg-gray-800/20 rounded-md border border-gray-700/30">
//               <p className="text-sm">No upcoming appointments</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* User Profile */}
//       <div className="flex justify-center mt-6">
//         <img
//           alt="User profile picture"
//           className="rounded-full"
//           height="40"
//           src="https://storage.googleapis.com/a1aa/image/bd97d4e4-725a-4957-c42f-19e3741f081a.jpg"
//           width="40"
//         />
//       </div>
//     </aside>
//   );
// }
