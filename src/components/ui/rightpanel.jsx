// components/RightPanelContent.js
// import ragIllustration from '../assets/rag-diagram.png'; // Replace with your actual image
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import '../styles/App.css'
import { RiSearchEyeLine } from "react-icons/ri";
import { TiDocumentText } from "react-icons/ti";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FcDocument } from "react-icons/fc";
import { CiBellOn } from "react-icons/ci";
const features = [
    {
        info: "  Summarize clinical histories with context awareness using GenAI. ",
        icon: <i class="fas fa-shield-alt fa-fw text-cyan-400"></i>,
        badge: <FaCheckCircle className="rounded-full border-2 border-cyan-400" />
    },
    {
        info: " Retrieve relevant case reports, medical literature and many more.",
        icon: <i class="fas fa-file-alt fa-fw text-cyan-400"></i>,
        badge: <FaCheckCircle className="rounded-full border-2 border-cyan-400" />
    },
    {
        info: " Autonomously recommend steps based on contextual analysis.",
        icon: <i class="fas fa-cogs fa-fw text-cyan-400"></i>,
        badge: <FaCheckCircle className="rounded-full border-2 border-cyan-400" />
    },
    {
        info: " Provide rapid, secure decision support — securely fast and safe.",
        icon: <i class="fas fa-comments fa-fw text-cyan-400"></i>,
        badge: <FaCheckCircle className="rounded-full border-2 border-cyan-400" />
    }
];

const RightPanelContent = () => {
    return (
        <div className="text-white text-center mx-auto px-8 max-w-xl mt-8">
            <h2 className="md:text-xl font-semibold p-1 tracking-wide">
                Sathi, An Autonomous Medical Co-Pilot For Citizens
            </h2>

            <p className="text-gray-300 mb-6 text-md px-2" >
                <div
                    className=" text-cyan-400 bg-[#0a121d] py-2 rounded-2xl border border-[#282D37] shadow-lg font-semibold">
                    Powered by Agentic Retrieval-Augmented Generation (ARAG)
                </div>
                to observe clinical context, reason through medical cases, and guide decisions in real time.

            </p>


            <ul className=" text-md text-gray-300 mb-6 space-y-3 ">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-1">
                        <span>
                            {feature.icon}
                            {feature.info}


                        </span>
                        {feature.badge}
                    </li>
                ))}
            </ul>

            <div
                aria-label="How Sathi assists healthcare professionals"
                // class="bg-[#121212] rounded-lg p-6 border"
                className=" bg-[#0a121d] rounded-2xl p-6 max-w-lg mx-auto soft-shadow border border-[#11303f] relative"
            >
                {/* <h2 class="text-center text-white font-semibold text-xl mb-12 leading-tight">
                    How Sathi assists <br />healthcare professsiona ls..
                </h2> */}


                <div class="flex flex-col sm:flex-row sm:justify-center sm:items-center space-y-6 sm:space-y-0 sm:space-x-6">
                    {/* <!-- Query box --> */}
                    <div className="flex items-center">
                        <div
                            class="flex flex-col items-center justify-center border border-[#1a2e44] rounded-lg px-6 py-8 w-28 sm:w-24 text-cyan-400 text-2xl select-none"
                            aria-label="Query box"
                        >
                            {/* <i class="far fa-file-alt fa-lg mb-5"></i> */}
                            <IoDocumentTextOutline
                                size={40}
                            />
                            <span className='text-white text-lg'>Query</span>
                            <div class="mt-2 space-y-1 w-full">
                                <div class="h-0.5 bg-white rounded w-3/4 mx-auto"></div>
                                <div class="h-0.5 bg-[#3ea6e3] rounded w-1/2 mx-auto"></div>
                                <div class="h-0.5 bg-cyan-400 rounded w-1/3 mx-auto"></div>
                            </div>

                        </div>
                        <div class="hidden sm:flex items-center text-cyan-400 select-none">
                            <i class="fas fa-arrow-right-long fa-md"></i>
                        </div>
                    </div>



                    <div class="flex flex-col items-center sm:flex-row sm:items-start ">
                        <div
                            class="relative flex flex-col justify-center border border-[#1a2e44] rounded-lg px-6 py-4 w-44 sm:w-40 max-w-[200px] text-cyan-400 text-center select-none"
                            aria-label="Agentic RAG box"
                        >
                            <h3 class="text-xl mb-8 font-semibold">Agentic<br />RAG</h3>
                            <div
                                className='text-white text-xl mb-4'
                            >
                                {/* <i class="fas fa-search fa-xl"></i> */}
                                <RiSearchEyeLine 
                                    size={42}
                                    className='ml-8'
                                />
                                <h3 className='mt-1'>Output</h3>
                            </div>
                            <div class="flex justify-center space-x-10 text-white text-2xl">
                                {/* <i class="far fa-file-alt fa-lg mr-6"></i> */}
                                {/* <i class="fas fa-bell fa-lg"></i> */}
                                <FcDocument size={35}/>
                                <CiBellOn size={38}/>
                            </div>

                        </div>

                        {/* <!-- Arrow --> */}
                        <div class="text-cyan-400 hidden mt-4 sm:flex flex-col justify-between select-none">
                            <i class="fas fa-arrow-right-long fa-md mt-10"></i>
                            <i class="fas fa-arrow-right-long fa-md mt-2"></i>
                            <i class="fas fa-arrow-right-long fa-md mt-12"></i>
                            <i class="fas fa-arrow-right-long fa-md mt-2"></i>
                        </div>
                    </div>
                    {/* <!-- Agentic RAG box --> */}


                    {/* <!-- MED servers box --> */}
                    <div
                        class="relative flex flex-col justify-center border border-cyan-400 px-6 py-8 w-28 sm:w-24 max-w-[150px] text-[#3ea6e3] text-xl select-none"
                        aria-label="MED servers box"
                    >
                        <span class="absolute -top-6 right-5 text-[10px] text-white select-text">MED Servers</span>
                        <div class="space-y-1 mb-4">
                            <div class="w-10 h-3 border border-[#3ea6e3] rounded flex items-center justify-center mx-auto">
                                <div class="w-2 h-1 bg-white rounded"></div>
                            </div>
                            <div class="w-10 h-3 border border-white rounded flex items-center justify-center mx-auto">
                                <div class="w-2 h-1 bg-[#3ea6e3] rounded"></div>
                            </div>
                            <div class="w-10 h-3 border border-[#3ea6e3] rounded flex items-center justify-center mx-auto">
                                <div class="w-2 h-1 bg-white rounded"></div>
                            </div>
                        </div>
                        <div class="flex flex-col items-center space-y-1 mt-4 text-white">
                            {/* <i class="far fa-file-alt fa-xl mb-4"></i> */}
                            <TiDocumentText size={38}/>
                            <h3>Output</h3>
                        </div>
                    </div>
                </div>

                <div
                    class="mt-6 flex flex-col sm:flex-row justify-between text-[10px] text-[#9ca3af] select-text px-2 sm:px-0 max-w-md mx-auto"
                >
                    <span className='text-sm mr-7'>
                        Contact Aware Incights
                    </span>
                    <span className='text-sm ml-4'>
                        Encrypted Clinical lextiligance</span>
                    <span className='text-sm ml-6'>
                        Real Time-Decision Support</span>
                </div>
            </div>
            {/* <img
                src={rightside}
                alt="ARAG healthcare workflow"
                className="rounded-lg shadow-lg mx-auto max-w-full mb-4"
            /> */}

            <p className="text-xs text-gray-500 mt-4">
                HIPAA-Compliant · End-to-End Encrypted · Agent-Guided Decisions
            </p>
        </div >
    );
};

export default RightPanelContent;


// import React, { useEffect, useState } from 'react';
// import ragIllustration from '../ragIllustration.png';
// import ragIllustration4 from '../ragIllustration4.png';
// import { FaCheckCircle } from 'react-icons/fa';

// const features = [
//   "Summarize clinical histories with context awareness",
//   "Retrieve case reports and literature using vector search",
//   "Suggest follow-up actions through autonomous planning",
//   "Provide secure and fast decision support for clinicians",
// ];

// const reasoningSteps = [
//   "🧠 Analyzing patient symptoms...",
//   "📚 Retrieving medical case studies...",
//   "🧩 Planning next steps...",
//   "✅ Generating actionable suggestions...",
// ];

// const RightPanelContent = () => {
//   const [reasoningIndex, setReasoningIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setReasoningIndex((prev) => (prev + 1) % reasoningSteps.length);
//     }, 1800);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="text-white text-center p-10 max-w-lg mx-auto">
//       <h2 className="text-3xl font-semibold mb-4 tracking-wide">
//         Your Autonomous Medical Co-Pilot
//       </h2>

//       <p className="text-gray-300 mb-6 text-base">
//         Sathi uses <span className="text-cyan-400 font-semibold">Agentic Retrieval-Augmented Generation (ARAG)</span> to observe clinical context, reason through medical data, and guide decisions in real time.
//       </p>

//       <ul className="text-left text-sm text-gray-300 mb-6 space-y-3">
//         {features.map((feature, index) => (
//           <li key={index} className="flex items-center gap-2">
//             <FaCheckCircle className="text-cyan-400" />
//             <span>{feature}</span>
//           </li>
//         ))}
//       </ul>

//       {/* Reasoning Animation */}
//       <div className="mb-6 text-cyan-300 text-sm italic transition-opacity duration-500 ease-in-out">
//         {reasoningSteps[reasoningIndex]}
//       </div>

//       {/* ARAG Flow Diagram with fade-in */}
//       <img
//         src={ragIllustration4}
//         alt="ARAG healthcare workflow"
//         className="rounded-lg shadow-lg mx-auto max-w-full mb-4 "
//       />

//       {/* Testimonial */}
//       <div className="mt-6 p-4 bg-white/10 rounded-lg shadow-sm text-sm italic border-l-4 border-cyan-400 text-left">
//         “Sathi helped me understand my diagnosis and treatment plan—fast, clear, and personalized.”
//         <span className="block mt-2 font-bold text-cyan-300">— Aditi, patient</span>
//       </div>

//       <p className="text-xs text-gray-500 mt-4">
//         HIPAA-Compliant · End-to-End Encrypted · Agent-Guided Decisions
//       </p>
//     </div>
//   );
// };

// export default RightPanelContent;
// import React from 'react';
// import { FaShieldAlt, FaHeartbeat, FaCapsules, FaRobot } from 'react-icons/fa';

// const RightPanel = () => {
//   return (
//     <div className="p-8 text-white flex flex-col justify-center bg-gradient-to-br from-[#2C3E50] to-[#34495E] rounded-r-2xl shadow-lg h-full">
//       <h2 className="text-2xl font-semibold mb-4 tracking-wide">Empower Your Health Decisions</h2>

//       <ul className="space-y-3">
//         <li className="flex items-center gap-3">
//           <FaRobot className="text-teal-400 text-xl" />
//           <span>AI-powered symptom insights</span>
//         </li>
//         <li className="flex items-center gap-3">
//           <FaCapsules className="text-pink-400 text-xl" />
//           <span>Drug safety & interaction guidance</span>
//         </li>
//         <li className="flex items-center gap-3">
//           <FaHeartbeat className="text-red-400 text-xl" />
//           <span>Contextual patient report summaries</span>
//         </li>
//         <li className="flex items-center gap-3">
//           <FaShieldAlt className="text-green-400 text-xl" />
//           <span>Encrypted, private, secure</span>
//         </li>
//       </ul>

//       <div className="mt-6 p-4 bg-white/10 rounded-lg shadow-sm text-sm italic border-l-4 border-cyan-400">
//         “Sathi helped me understand my diagnosis and treatment plan—fast, clear, and personalized.”
//         <span className="block mt-2 font-bold text-cyan-300">— Aditi, patient</span>
//       </div>
//     </div>
//   );
// };

// export default RightPanel;