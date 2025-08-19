// import React from 'react'
// import Chatbox from "./components/Chatbox"
// import Auth from './components/Auth'

// const App = () => {
//   return (
//     <div className="min-h-screen bg-background flex items-center justify-center">
//       <Auth />
//     </div>
//   )
// }

// export default App
import { useState, useEffect } from 'react';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from './services/firebase_config';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Chatbox from "./pages/console";
import Login from './pages/login';
import AuthCallback from './pages/AuthCallback';
import ProtectedRoute from './pages/ProtectedRoute';
import { SidebarProvider } from './components/ui/sidebar';
import Phone from './pages/phone';
import InputOTPForm from './pages/inputotp';
import EmailVerification from './pages/emailotp';
import TestPhone from './pages/testphone';
import NamePage from './pages/namepage'


const App = () => {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     setUser(user);
  //     setCheckingAuth(false); // We are done loading
  //   });

  //   return () => unsubscribe();
  // }, []);

  const handlelogin = (token) => {
    window.location.href = '/chatbox';  // Fixed 'windows' to 'window'
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/login" element={<Login onLogin={handlelogin} />} />
          <Route path="/namepage" element={<NamePage/>} />
          <Route path="/testphone" element={<TestPhone/>} />
          <Route path="/phone" element={<Phone />} />
          <Route path="/inputotp" element={<InputOTPForm />} />
          <Route path="/emailotp" element={<EmailVerification />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route
            path="/chatbox"
            element={
              <ProtectedRoute>
                <SidebarProvider>
                  <Chatbox />
                </SidebarProvider>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
