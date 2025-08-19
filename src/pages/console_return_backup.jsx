  return (

    <div className="h-screen w-full flex bg-[#0f1117]">
      <SidebarLayout
        AppSidebar={AppSidebar}
        onSelectChatSession={handleSelectChatSession}
        refetchChatSessions={refetchChatSessions}
        onNewSessionClick={handleNewSessionClick}
      >
      </SidebarLayout>

      <div className="flex-1 flex flex-col bg-[#0f1117] text-white w-full ">
        <div className="flex items-center p-1">
          <div className="top-3 left-3 z-10 mt-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#ececf1] hover:bg-[#121212] transition-colors"
            >

              {isOpen && window.innerWidth >= 768 ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
          <div className="flex justify-center items-center flex-grow mt-2">
            <img
              alt="Copilot logo with blue, purple, and pink gradient shapes"
              className="w-10 h-10"
              height="20"
              src={geneticSvg}
              width="20"
            />
          </div>
          <button
            onClick={handleLogout}
            className="ml-auto p-3 rounded-full hover:bg-gray-800 transition-colors button-hover">
            <i className="fas fa-sign-out-alt text-gray-200"></i>
          </button>
        </div>
        {welcomeMounted && (messages.length === 0 || input === 300) && input.length <= 300 && (
          <div
            className={`text-center w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto justify-center mt-24 sm:mt-40 md:mt-[100px] lg:mt-[200px]  transition-opacity duration-500 ease-in-out
              ${showWelcome ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}
          >

            <div className="text-center w-full px-2 sm:px-4">
              <h1 className="text-white font-semibold text-2xl md:text-4xl leading-tight mb-2">
                {getGreeting()}, {userName.split(" ")[0]}.😊
              </h1>
              <h2 className="text-white font-semibold text-lg md:text-3xl leading-tight mb-6">
                ❤️ What can I help you with today?
              </h2>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-xs sm:max-w-xl mx-auto">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    className=" px-3 py-2 font-normal sm:text-sm md:text-md lg:text-md text-white whitespace-nowrap rounded-2xl shadow-lg max-w-[80%] border border-[#3B4A5A] hover:bg-[#3B4A5A]"
                    type="button"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto scrollbar">
          <div className="p-6 space-y-6 max-w-4xl mx-auto mb-[150px] text-gray-300 text-[14px]">
            {messages.map((msg, index) => (
              (msg.message && msg.message.trim() !== "") ? (
                <div key={index} className={`flex ${msg.name === 'User' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`mt-2 mb-2  ${msg.name === 'User' ? 'px-3 py-2 shadow-lg max-w-[80%] break-words rounded-2xl bg-[#1e2942] bg-opacity-50' : ''}`}>
                    <ReactMarkdown >
                      {msg.message}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : null
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bottom-0 left-0 right-0 from-[#0f1117] via-[#0f1117]/90 to-transparent bg-gradient-to-t ">
          <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-[#0B0E17] rounded-[32px] p-[18px] mb-[10px] shadow-[0_3px_20px_0_rgba(40,50,70,0.95)] border border-[#181B24]">
              <div className="flex flex-col">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}

                  onInput={e => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask anything"
                  rows={1}
                  className="pl-2 bg-transparent text-gray-200 w-full focus:outline-none text-sm mb-2 placeholder-gray-500 placeholder:font-semibold resize-none overflow-hidden scrollbar-input_box"
                  style={{ minHeight: '20px', maxHeight: '420px' }}
                />
              </div>
              <div className="flex gap-2">
                <div className=" flex items-center gap-2 ">
                  {/* Quick Response button */}
                  <CustomQuickResponseDropdown
                    value={responseType}
                    onChange={setResponseType}
                  />
                </div>
                <div className=" flex items-center gap-2 ml-auto ">
                  <button
                    onClick={handleSendMessage}
                    className={`w-8 h-8 rounded-full hover:bg-white hover:text-black focus:outline-none transition-colors border border-[#363c4d] ${input
                      ? 'bg-white text-black'
                      : 'bg-[#141820] text-white '
                      }`}
                  >
                    <i className="fas fa-arrow-up"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );