// import React, { useEffect, useState } from 'react';
// import { auth } from '../services/firebase_config';
// import { signInWithPhoneNumber, RecaptchaVerifier, sendSignInLinkToEmail } from 'firebase/auth';
// import PhoneInput from 'react-phone-input-2'
// // import 'react-phone-input-2/lib/style.css'
// import '../components/styles/App.css'

// const TestPhone = () => {
//     const [phone, setPhone] = useState("")
//     // const sendOtp = async() => {
//     //     try {
//     //         const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {})
//     //         const confirmation = signInWithPhoneNumber(auth, phone, recaptcha)
//     //         console.log(confirmation)
//     //         console.log("phone", phone)
//     //     } catch (error) {
//     //         console.error()
//     //     }
//     // }
    
//     const actionCodeSettings = {
//         // URL you want to redirect back to. The domain (www.example.com) for this
//         // URL must be in the authorized domains list in the Firebase Console.
//         url: 'http://localhost:3000/testphone',
//         // This must be true.
//         handleCodeInApp: true,
//         iOS: {
//             bundleId: 'com.example.ios'
//         },
//         android: {
//             packageName: 'com.example.android',
//             installApp: true,
//             minimumVersion: '12'
//         },
//         // The domain must be configured in Firebase Hosting and owned by the project.
//         // linkDomain: 'custom-domain.com'
//     };

//     const sendEmail = async () => {
//         try {
//             const email = "amritendunath1@gmail.com"
//             const sendMail = sendSignInLinkToEmail(auth, email, actionCodeSettings)
//             console.log("email", email)
//             console.log("sendMail", sendMail)
//         } catch (error) {
//             console.log(error)
//         }
//     }
//     return (
//         <div className="phone-signin">
//             <div className='phone-content'>
//                 {/* <div id="recaptcha-container"></div> */}
//                 {/* <p>Testing Phone Authentication with {phoneNumber}</p> */}
//                 {/* <PhoneInput
//                     country={'us'}
//                     // value={this.state.phone}
//                     // onChange={phone => this.setState({ phone })}
//                     value={phone}
//                     onChange={(phone) => setPhone("+" + phone)}
//                 /> */}
//                 <div id="recaptcha"></div>
//                 <button
//                     className='border-2 bg-gray-200 '
//                     type='submit'
//                     // onClick={sendOtp}
//                     onClick={sendEmail}
//                 >
//                     SendEmail
//                 </button>

//             </div>
//             <textarea
//                 className='mt-10 border-2 p-2'
//                 placeholder='Enter OTP'
//             />
//             <button>
//                 Verify OTP
//             </button>
//         </div>
//     );
// };

// export default TestPhone;





// // const [phoneNumber, setPhoneNumber] = useState("9804395695"); // Initialize phoneNumber outside useEffect

// // useEffect(() => {
// //     let appVerifier;

// //     // Initialize RecaptchaVerifier only once
// //     try {
// //         window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
// //             'size': 'invisible',
// //             'callback': (response) => {
// //                 // reCAPTCHA solved, allow signInWithPhoneNumber.
// //                 console.log("Recaptcha Solved");
// //             }
// //         }, auth);
// //         appVerifier = window.recaptchaVerifier;
// //         console.log("RecaptchaVerifier initialized:", appVerifier); // Log the appVerifier
// //     } catch (error) {
// //         console.error("Error initializing RecaptchaVerifier:", error);
// //         return; // Exit the useEffect if RecaptchaVerifier fails to initialize
// //     }

// //     if (appVerifier) {
// //         console.log("Attempting to sign in with phone number:", phoneNumber);
// //         signInWithPhoneNumber(auth, phoneNumber, appVerifier)
// //             .then((confirmationResult) => {
// //                 // SMS sent. Prompt user to type the code from the message, then sign the
// //                 // user in with confirmationResult.confirm(code).
// //                 window.confirmationResult = confirmationResult;
// //                 console.log("SMS sent, confirmationResult:", confirmationResult);
// //             })
// //             .catch((error) => {
// //                 // Error; SMS not sent
// //                 console.error("Error sending SMS:", error);
// //                 // Log the detailed error message
// //                 console.error("Error code:", error.code);
// //                 console.error("Error message:", error.message);
// //             });
// //     } else {
// //         console.error("appVerifier is undefined.  Check Recaptcha Initialization");
// //     }
// // }, [phoneNumber]); // Add phoneNumber as a dependency so that the effect re-runs if it changes
