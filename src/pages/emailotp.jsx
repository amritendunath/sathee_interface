import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import geneticSvg from '../genetic-data-svgrepo-com.svg'
import RightPanelContent from '../components/ui/rightpanel'
import { Phone } from "lucide-react"
import { ClipLoader } from 'react-spinners';

const EmailVerification = () => {
  const navigate = useNavigate()
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const storedEmail = sessionStorage.getItem('email')
  const storedName = sessionStorage.getItem('name')
  console.log('verificationCode', verificationCode)

  useEffect(() => {
    if (!storedEmail) {
      navigate('/login')
      return
    }
    setEmail(storedEmail)
    setName(storedName)
  }, [navigate])


  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true)
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_POINT_AUTH}/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          verificationCode,
          name
        })
      });

      const data = await response.json();
      const token = data.token

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed', data);
      }
      if (token) {
        localStorage.setItem('token', token);
      } else {
        console.warn("No token received from the server")
      }
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
    } finally {
      setLoading(false)
    }
  };

  const handleResendEmail = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_POINT_AUTH}/login/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

    } catch (err) {
      setError('Failed to resend verification email')
    }
  }
  const handleOAuthLogin = (provider) => {
    if (provider === 'google') {
      window.location.href = `${process.env.REACT_APP_POINT_AUTH}/login/${provider}`
    }
    else if (provider === 'twitter') {
      window.location.href = `${process.env.REACT_APP_POINT_AUTH}/login/${provider}`
    }
    else if (provider === 'microsoft') {
      window.location.href = `${process.env.REACT_APP_POINT_AUTH}/login/${provider}`
    }
    else if (provider === 'phone') {
      navigate('/phone')
    }
  }

  return (
    // Match body and main container classes from index.html
    // Note: The index.html body has bg-[#0a0a0a] and flex centering.
    // The main div has flex, w-full max-w-full, h-screen, rounded-xl, overflow-hidden, shadow-lg
    <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center "> {/* Added body classes */}
      {/* Updated main container classes for responsiveness */}
      {/* Added flex-col for mobile, lg:flex-row for desktop */}
      {/* Removed max-w-full as it's redundant with w-full */}
      <div className="flex flex-col lg:flex-row w-full min-h-screen rounded-xl overflow-hidden shadow-lg"> {/* Updated main container classes */}
        {/* Left side - Match classes from index.html */}
        {/* Added items-center */}
        {/* Changed w-1/2 to w-full lg:w-1/2 for responsiveness */}
        <div className="bg-[#0a0a0a] flex flex-col justify-center items-center px-10 py-12 w-full lg:w-1/2 text-white"> {/* Updated left column classes */}
          {/* Logo/Brand - Match structure and classes from index.html */}
          <div className="flex items-center space-x-2 mb-20 md:absolute top-0 left-0 mt-5 ml-5">
            <img
              src={geneticSvg}
              alt="Sathi Logo"
              className="w-10 h-10 mr-2 "
            />
            <span className="font-semibold text-white text-[20px] leading-none"> {/* Added text classes */}
              Sathi Inc.
            </span>
          </div>

          <p className="text-gray-200 mb-6">
            Please enter the verification code sent to, {' '}
            <span className='font-semibold text-gray-200 text-lg '>
              {email}
            </span>
          </p>
          <form className="w-full max-w-md" onSubmit={handleVerify}>

            <input
              className="text-center bg-[#121212] mb-4 mt-4 border border-gray-700 rounded-[32px] px-3 py-2  w-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(66,133,244,0.5)] hover:scale-[1.02] button-glow-google"
              type="text"
              id="code"
              placeholder="Enter One Time Passcode (OTP)"
              value={verificationCode}
              onFocus={(e) => e.target.placeholder = ""}
              onBlur={(e) => e.target.placeholder = "Enter One Time Passcode (OTP)"}
              onChange={(e) => setVerificationCode(e.target.value)}
            // required
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {/* <div>

            <button
              // className="w-full bg-gray-300 text-black rounded-md py-2 mb-8 text-sm font-medium hover:bg-gray-400 transition" 
              className="border border-gray-700 rounded-[32px] py-2 mb-8 w-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(66,133,244,0.5)] hover:scale-[1.02] button-glow-google"
              type="submit"
            >
              Continue
            </button>
            <button className='flex items-center justify-center flex:col'>s</button>
            </div> */}
            <div>
              <div className='flex'>
                <button
                  // className="w-full bg-gray-300 text-black rounded-md py-2 mb-8 text-sm font-medium hover:bg-gray-400 transition" 
                  className="border border-gray-700 rounded-[32px] py-2 mb-8 w-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(66,133,244,0.5)] hover:scale-[1.02] button-glow-google"
                  type="submit"
                >
                  {loading ? <ClipLoader size={16} color="#fff" /> : 'Continue'}
                </button>
                <button
                  className='flex items-center justify-center flex:col w-1/2 border border-gray-700 rounded-[32px] py-2 mb-8 ml-3 transition-all duration-300 hover:shadow-[0_0_15px_rgba(66,133,244,0.5)] hover:scale-[1.02]'
                  type="submit"
                  // onClick={handleResendEmail}
                >
                  {/* {loading ? <ClipLoader size={16} color="#fff" /> : 'Resend OTP'} */}
                  Resend OTP
                </button>
              </div>
            </div>
            <div className="flex items-center mb-6"> {/* Added container classes */}
              <hr className="flex-grow border-gray-700" /> {/* Added hr classes */}
              <span className="mx-3 text-gray-200 text-xs"> {/* Added span classes */}
                OR
              </span>
              <hr className="flex-grow border-gray-700" /> {/* Added hr classes */}
            </div>
            <button
              // Added flex, items-center, justify-center, and bg-[#121212]
              className="flex items-center justify-center bg-[#121212] border border-gray-700 rounded-[32px] py-2 w-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(66,133,244,0.5)] hover:scale-[1.02] button-glow-google" // Updated button classes
              type="button"
              // onClick={() => handleOAuthLogin('google')} // Add click handler (assuming handleOAuthLogin exists and handles 'google')
              onClick={() => handleOAuthLogin('google')} // Add click handler (assuming handleOAuthLogin exists and handles 'google')
            >
              {/* Use SVG icon instead of Font Awesome */}
              <svg className="mr-4 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="font-semibold">
                {" "}Login with Google
              </span>

            </button>
            <button
              className="mt-4 flex items-center justify-center bg-[#121212] border border-gray-700 rounded-[32px] py-2 w-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(66,133,244,0.5)] hover:scale-[1.02] button-glow-google" // Updated button classes
              type="button"
              // onClick={() => handleOAuthLogin('google')} // Add click handler (assuming handleOAuthLogin exists and handles 'google')
              onClick={() => handleOAuthLogin('phone')} // Add click handler (assuming handleOAuthLogin exists and handles 'google')
            >
              <Phone className="mr-6 h-5 w-5" />
              <span className="font-semibold">
                {"  "} Login with Phone
              </span>

            </button>

            <button
              className="mt-4 flex items-center justify-center bg-[#121212] border border-gray-700 rounded-[32px] py-2 w-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(66,133,244,0.5)] hover:scale-[1.02] button-glow-google" // Updated button classes
              type="button"
              // onClick={() => handleOAuthLogin('google')} // Add click handler (assuming handleOAuthLogin exists and handles 'google')
              onClick={() => handleOAuthLogin('facebook')} // Add click handler (assuming handleOAuthLogin exists and handles 'google')
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 45 45">
                <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path><path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path>
              </svg>
              <span className="font-semibold">
                {"  "} Login with Facebook
              </span>

            </button>

            <button
              className="mt-4 flex items-center justify-center bg-[#121212] border border-gray-700 rounded-[32px] py-2 w-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(66,133,244,0.5)] hover:scale-[1.02] button-glow-google" // Updated button classes
              type="button"
              // onClick={() => handleOAuthLogin('google')} // Add click handler (assuming handleOAuthLogin exists and handles 'google')
              onClick={() => handleOAuthLogin('twitter')} // Add click handler (assuming handleOAuthLogin exists and handles 'google')
            >
              <svg className="mr-4 h-5 w-5" viewBox="0 0 40 40">
                <path fill="#03A9F4"
                  d="M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429"></path>
              </svg>
              {/* <FontAwesomeIcon className="mr-4 h-5 w-5" icon={} /> */}
              <span className="font-semibold">
                {"  "} Login with Twitter / X
              </span>

            </button>

            <button
              className="mt-4 flex items-center justify-center bg-[#121212] border border-gray-700 rounded-[32px] py-2 w-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(66,133,244,0.5)] hover:scale-[1.02] button-glow-google" // Updated button classes
              type="button"
              // onClick={() => handleOAuthLogin('google')} // Add click handler (assuming handleOAuthLogin exists and handles 'google')
              onClick={() => handleOAuthLogin('microsoft')} // Add click handler (assuming handleOAuthLogin exists and handles 'google')
            >
              <svg className="mr-4 h-5 w-5" viewBox="0 0 48 48">
                <path fill="#ff5722" d="M6 6H22V22H6z" transform="rotate(-180 14 14)"></path><path fill="#4caf50" d="M26 6H42V22H26z" transform="rotate(-180 34 14)"></path><path fill="#ffc107" d="M26 26H42V42H26z" transform="rotate(-180 34 34)"></path><path fill="#03a9f4" d="M6 26H22V42H6z" transform="rotate(-180 14 34)"></path>
              </svg>
              <span className="font-semibold">
                {"  "} Login with Microsoft
              </span>

            </button>




            {/* Sign Up Link */}
            <p className="text-center text-gray-400 text-xs mt-8"> {/* Added paragraph classes */}
              Don't have an account?
              <a className="underline hover:text-gray-200" href="#"> {/* Added link classes */}
                Sign up
              </a>
            </p>
          </form>
        </div>
        <div
          className="bg-[#121212] w-full lg:w-1/2 flex items-center justify-center"

        >

          <RightPanelContent />
        </div>

      </div>
    </div>
  )
}

export default EmailVerification

