


import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import geneticSvg from '../genetic-data-svgrepo-com.svg'

const InputOTPForm = () => {
  const navigate = useNavigate()
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState('')
  const phoneNumber = sessionStorage.getItem('phoneNumber')
  useEffect(() => {
    if (!phoneNumber) {
      navigate('/login')
      return
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault() // Add this to prevent form default submission
    try {
      if (!phoneNumber) {
        throw new Error('Phone number not found. Please try again.')
      }

      const response = await fetch('http://localhost:5004/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: '+91' + phoneNumber,
          code: verificationCode // Change from data.pin to verificationCode
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Invalid OTP')
      }

      localStorage.setItem('token', result.access_token)
      navigate('/chatbox')
    } catch (error) {
      console.error('OTP verification failed:', error)
      setError(error.message)
    }
  }

  const handleResendOTP = async () => {
    try {
      const phoneNumber = sessionStorage.getItem('phoneNumber')
      if (!phoneNumber) {
        throw new Error('Phone number not found')
      }

      const response = await fetch('http://localhost:5004/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: '+91' + phoneNumber }),
      })

      if (!response.ok) {
        throw new Error('Failed to resend OTP')
      }

      setError('OTP resent successfully')
    } catch (error) {
      setError(error.message)
    }
  }


  return (
    <div className="bg-white flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), url('/images/04.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-8 flex items-center justify-center">
          <img 
            src={geneticSvg} 
            alt="Sathi Logo" 
            className="w-8 h-8 mr-2"
          />
          <span className="animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Sathi {' '}
          </span>
        </h1>
        <h2 className="text-2xl font-semibold mb-2">Check your phone</h2>
        <p className="text-gray-600 mb-6 ">
          Enter the verification code we just sent to {' '}
          <span className='font-semibold text-gray-900'>
            +91{phoneNumber}
          </span>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="code" className="block text-sm text-gray-800 mb-2">
              Code
            </label>
            <input
              type="text"
              id="code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="border-2 text-center border-blue-500 rounded-full px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-black text-white rounded-full px-10 py-2 mb-4 hover:bg-gray-800 transition-colors"
          >
            Continue
          </button>
        </form>
        <p className="text-gray-800 mb-8">
          <button
            onClick={handleResendOTP}
            className="bg-black text-white rounded-full px-6 py-2 mb-4 hover:bg-gray-800 transition-colors"
          >
            Resend OTP
          </button>
        </p>
        <div className="text-gray-600">
          <a href="/terms" className="underline hover:text-gray-800">
            Terms of Use
          </a>{" "}
          |{" "}
          <a href="/privacy" className="underline hover:text-gray-800">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  )
}

export default InputOTPForm