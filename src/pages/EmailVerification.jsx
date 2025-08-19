import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const EmailVerification = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5004/send-email-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send verification code');
      }

      const data = await response.json();
      setCodeSent(true);
    } catch (err) {
      if (!window.navigator.onLine) {
        setError('Please check your internet connection');
      } else if (err.message === 'Failed to fetch') {
        setError('Unable to connect to the server. Please make sure the server is running.');
      } else {
        setError(err.message || 'Failed to send verification code');
      }
      console.error('Error:', err);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5004/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          code: verificationCode
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      localStorage.setItem('token', data.token);
      navigate('/chatbox');
    } catch (err) {
      if (!window.navigator.onLine) {
        setError('Please check your internet connection');
      } else if (err.message === 'Failed to fetch') {
        setError('Unable to connect to the server. Please make sure the server is running.');
      } else {
        setError(err.message);
      }
      console.error('Error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {!codeSent ? 'Enter your email to receive a verification code' : 'Enter the verification code sent to your email'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!codeSent ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full bg-black">
                Send Verification Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <Input
                type="text"
                placeholder="Verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">
                Verify Email
              </Button>
            </form>
          )}
          {error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
  // return (
  //   <div
  //     className="bg-white flex items-center justify-center min-h-screen"
  //     style={{
  //       backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.05)), url('/images/04.jpg')",
  //       backgroundSize: "cover",
  //       backgroundPosition: "center",
  //       backgroundRepeat: "no-repeat"
  //     }}
  //   >
  //     <div className="text-center">
  //       <h1 className="text-2xl font-semibold mb-8">Sathi@AI</h1>
  //       <h2 className="text-2xl font-semibold mb-2">Check your inbox</h2>
  //       <p className="text-gray-600 mb-6">
  //         Enter the verification code we just sent to {email}
  //       </p>
  //       <form onSubmit={handleSendCode}>
  //         <div className="mb-6">
  //           <label htmlFor="code" className="block text-sm text-gray-600 mb-2">
  //             Code
  //           </label>
  //           <input
  //             type="text"
  //             id="code"
  //             value={verificationCode}
  //             onChange={(e) => setVerificationCode(e.target.value)}
  //             className="border-2 border-blue-500 rounded-full px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //           />
  //         </div>
  //         {error && <p className="text-red-500 mb-4">{error}</p>}
  //         <button
  //           type="submit"
  //           className="bg-black text-white rounded-full px-6 py-2 mb-4 hover:bg-gray-800 transition-colors"
  //         >
  //           Continue
  //         </button>
  //       </form>
  //       <p className="text-gray-600 mb-8">
  //         <button
  //           onClick={handleResendEmail}
  //           className="underline hover:text-gray-800"
  //         >
  //           Resend email
  //         </button>
  //       </p>
  //       <div className="text-gray-600">
  //         <a href="/terms" className="underline hover:text-gray-800">
  //           Terms of Use
  //         </a>{" "}
  //         |{" "}
  //         <a href="/privacy" className="underline hover:text-gray-800">
  //           Privacy Policy
  //         </a>
  //       </div>
  //     </div>
  //   </div>
  // )
};

export default EmailVerification;