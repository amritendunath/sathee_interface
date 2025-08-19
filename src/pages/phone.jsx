import React, { useState, useEffect } from 'react' // Import useEffect
import { useNavigate } from 'react-router-dom'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Label } from "../components/ui/label"
import geneticSvg from '../genetic-data-svgrepo-com.svg'
// Import RecaptchaVerifier
import { auth, signInWithPhoneNumber, RecaptchaVerifier } from '../services/firebase_config' // Ensure RecaptchaVerifier is exported from firebase_config

const Phone = ({ onLogin }) => {
  const [phoneNumber, setphoneNumber] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null); // State to hold the reCAPTCHA verifier

  // Initialize reCAPTCHA verifier on component mount
  useEffect(() => {
    // Check if reCAPTCHA is already initialized to prevent re-rendering issues
    if (!window.recaptchaVerifier) {
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible', // Use 'invisible' for a less intrusive experience
        'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // You might want to automatically submit the form here if using visible reCAPTCHA
          console.log("reCAPTCHA solved");
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          console.log("reCAPTCHA expired");
          // Optionally reset the reCAPTCHA here
          if (window.recaptchaVerifier && window.recaptchaVerifier.current) {
             window.recaptchaVerifier.current.reset();
          }
        }
      });
      verifier.render().then((widgetId) => {
         // Store the widget ID if needed, though not strictly necessary for invisible
         console.log("reCAPTCHA rendered with widget ID:", widgetId);
      });
      // Store the verifier instance globally or in state
      window.recaptchaVerifier = verifier; // Store globally for easy access
      setRecaptchaVerifier(verifier); // Also store in state
    } else {
       // If already initialized, just set the state from the global variable
       setRecaptchaVerifier(window.recaptchaVerifier);
    }

     // Cleanup function to destroy reCAPTCHA on unmount if needed
     // Note: For invisible reCAPTCHA, it might be okay to leave it,
     // but for visible, you might want to clean up.
     // return () => {
     //   if (window.recaptchaVerifier && window.recaptchaVerifier.current) {
     //     window.recaptchaVerifier.current.clear();
     //     delete window.recaptchaVerifier;
     //   }
     // };

  }, [auth]); // Depend on auth object


  const validatePhone = (value) => {
    // Basic validation for 10 digits
    return /^\d{10}$/.test(value);
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validatePhone(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number')
      return
    }

    // Ensure reCAPTCHA verifier is available
    if (!recaptchaVerifier) {
        setError("reCAPTCHA not initialized. Please try again.");
        console.error("reCAPTCHA verifier is null.");
        return;
    }

    try {
      // Firebase requires the phone number in E.164 format (e.g., +1234567890)
      const fullPhoneNumber = '+91' + phoneNumber; // Assuming +91 is the country code

      // Use signInWithPhoneNumber with the reCAPTCHA verifier
      const confirmationResult = await signInWithPhoneNumber(auth, fullPhoneNumber, recaptchaVerifier);

      // Store the confirmation result globally or in state to use in the OTP input component
      window.confirmationResult = confirmationResult; // Storing globally for simplicity

      // Store phone number in session storage for OTP verification (optional, can get from confirmationResult)
      sessionStorage.setItem('phoneNumber', phoneNumber); // Store just the 10 digits if needed

      // Navigate to the OTP input page AFTER successfully sending the code
      navigate('/inputotp');


    } catch (err) {
      console.error('Phone submission error:', err);
      // Handle specific Firebase errors
      if (err.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number format.');
      } else if (err.code === 'auth/too-many-requests') {
         setError('Too many requests. Please try again later.');
      } else if (err.code === 'auth/captcha-check-failed') {
         setError('reCAPTCHA verification failed. Please try again.');
      }
      else {
        setError(err.message || 'Failed to send verification code.');
      }
       // Reset reCAPTCHA if there was an error
       if (window.recaptchaVerifier && window.recaptchaVerifier.current) {
          window.recaptchaVerifier.current.reset();
       }
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <Card className="bg-white/90 backdrop-blur-sm w-[300px] mx-auto p-5 shadow-xl rounded-[32px]">
        <CardHeader className="space-y-0.5 p-0">
          <CardTitle className="text-2xl text-center flex items-center justify-center">
            <img
              src={geneticSvg}
              alt="Sathi Logo"
              className="w-8 h-8 mr-2"
            />
            <span className="animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Sathi {' '}
            </span>
          </CardTitle>
          <CardDescription className="text-3xl text-center">
            Welcome back !
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 p-0">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <div className="flex gap-2">
                <Input
                  type="tel"
                  placeholder="+91"
                  value="+91"
                  disabled
                  className="text-md rounded-[32px] px-4 h-12 border-2 w-[70px] bg-gray-50"
                />
                <Input
                  id="phone"
                  type="number"
                  inputMode="numeric"
                  placeholder="98XXXXXXXX"
                  value={phoneNumber}
                  // pattern="[0-9]{10}" // Pattern is better handled by validatePhone function
                  onChange={(e) => setphoneNumber(e.target.value)}
                  minLength={10}
                  maxLength={10}
                  required
                  className="text-md rounded-[32px] px-4 h-12 border-2 focus:border-blue-500 focus:ring-0 transition-colors duration-200 flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <Button
              type="submit"
              className="text-md font-semibold rounded-[32px] px-4 h-12 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
            >
              Continue
            </Button>
            {/* <div className="text-center">
              <a href="/" className="text-blue-600">
                Back to login
              </a>
            </div> */}
          </form>
        </CardContent>
      </Card>
       {/* reCAPTCHA container - Firebase will render the invisible reCAPTCHA here */}
       {/* Make sure this div is present in your HTML structure */}
       <div id="recaptcha-container"></div>
    </div>
  )
}

export default Phone
// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { Button } from "../components/ui/button"
// import { Input } from "../components/ui/input"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
// import { Label } from "../components/ui/label"
// import geneticSvg from '../genetic-data-svgrepo-com.svg'
// import { provider_twitter, TwitterAuthProvider, auth, provider_facebook, signInWithRedirect, GoogleAuthProvider, signInWithPhoneNumber, FacebookAuthProvider, getRedirectResult, signInWithPopup } from '../services/firebase_config'

// const Phone = ({ onLogin }) => {
//   const [phoneNumber, setphoneNumber] = useState('')
//   const [error, setError] = useState('')
//   const navigate = useNavigate()  // Add this

//   const validatePhone = (value) => {
//     return value.length === 10;
//   }


//   const handleSubmit = async (e) => {  // Fixed function signature
//     e.preventDefault()
//     setError('')

//     if (!validatePhone(phoneNumber)) {
//       setError('Please enter a valid 10-digit phone number')
//       return
//     }

//     try {
//       // Store phone number in session storage for OTP verification
//       sessionStorage.setItem('phoneNumber', phoneNumber)
//       navigate('/inputotp')  // Use navigate instead of window.location
//       const result = signInWithPhoneNumber(auth, phoneNumber);
//       if (confirmationResult) {
//         window.confirmationResult = confirmationResult;
//       }

//       // const response = await fetch('http://localhost:5004/send-verification', {
//       //   method: 'POST',
//       //   headers: {
//       //     'Content-Type': 'application/json',
//       //   },
//       //   body: JSON.stringify({ phoneNumber: '+91' + phoneNumber }), // Add country code
//       // })

//       // const data = await response.json()

//       // if (!response.ok) {
//       //   throw new Error(data.error || 'Failed to send OTP')
//       // }


//     } catch (err) {
//       console.error('Phone submission error:', err)
//       setError(err.message)
//     }
//   }

//   return (
//     <div
//       className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50"
//       style={{
//         backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat"
//       }}
//     >
//       <Card className="bg-white/90 backdrop-blur-sm w-[300px] mx-auto p-5 shadow-xl rounded-[32px]">
//         <CardHeader className="space-y-0.5 p-0">
//           <CardTitle className="text-2xl text-center flex items-center justify-center">
//             <img
//               src={geneticSvg}
//               alt="Sathi Logo"
//               className="w-8 h-8 mr-2"
//             />
//             <span className="animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
//               Sathi {' '}
//             </span>
//           </CardTitle>
//           <CardDescription className="text-3xl text-center">
//             Welcome back !
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="grid gap-2 p-0">
//           <form onSubmit={handleSubmit} className="space-y-3">
//             <div className="relative">
//               <div className="flex gap-2">
//                 <Input
//                   type="tel"
//                   placeholder="+91"
//                   value="+91"
//                   disabled
//                   className="text-md rounded-[32px] px-4 h-12 border-2 w-[70px] bg-gray-50"
//                 />
//                 <Input
//                   id="phone"
//                   type="number"
//                   inputMode="numeric"
//                   placeholder="98XXXXXXXX"
//                   value={phoneNumber}
//                   pattern="[0-9]{10}"
//                   onChange={(e) => setphoneNumber(e.target.value)}
//                   minLength={10}
//                   maxLength={10}
//                   required
//                   className="text-md rounded-[32px] px-4 h-12 border-2 focus:border-blue-500 focus:ring-0 transition-colors duration-200 flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                 />
//               </div>
//             </div>
//             {error && (
//               <p className="text-sm text-red-500">{error}</p>
//             )}
//             <Button
//               type="submit"
//               className="text-md font-semibold rounded-[32px] px-4 h-12 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
//             >
//               Continue
//             </Button>
//             {/* <div className="text-center">
//               <a href="/" className="text-blue-600">
//                 Back to login
//               </a>
//             </div> */}
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default Phone