import React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function MessageBubble({ message, isLast }) {
  const isUser = message.role === "user";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full py-2 ${
        isUser ? "" : ""
      }`}
    >
      <div className={`max-w-full mx-auto px-6`}>
        {isUser ? (
           <div className="flex justify-end">

              {/* <div className="bg-[#10a37f] text-white rounded-2xl px-4 py-3 inline-block max-w-[90%]"> */}
              <div className="px-3 py-2 shadow-lg max-w-[80%] break-words rounded-2xl bg-[#1e2942] bg-opacity-50">
                  <div className="whitespace-pre-wrap leading-6 text-left">
                      {message.content}
                  </div>
              </div>
              
          </div>
        ) : (
          <div className="text-[#ececf1] leading-7">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-4 last:mb-0 leading-7">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-gray-400">{children}</strong>,
                code: ({ children, inline }) => {
                  if (inline) {
                    return <code className="bg-[#202123] px-1.5 py-0.5 rounded text-sm font-mono text-[#f8f8f2]">{children}</code>
                  }
                  return (
                    <pre className="bg-[#202123] p-4 rounded-lg overflow-x-auto my-4 border border-[#4d4d4f]">
                      <code>{children}</code>
                    </pre>
                  )
                },
                ul: ({ children }) => <ul className="list-disc pl-6 space-y-2 my-4">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-6 space-y-2 my-4">{children}</ol>,
                li: ({ children }) => <li className="leading-7">{children}</li>,
                h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-400">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-3 text-gray-400">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-bold mt-4 mb-2 text-gray-400">{children}</h3>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[#10a37f] pl-4 my-4 text-[#b4b4b4] italic">
                    {children}
                  </blockquote>
                )
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}