// AssistantService.js
// Centralized service for assistant session/conversation API calls

// const BASE_URL = "http://localhost:8000";
const BASE_URL = process.env.REACT_APP_POINT_AGENT 

export default class AssistantService {
  // Original blocking API methods
  static async startConversation(human_request) {
    const response = await fetch(`${BASE_URL}/api/v1/generate-stream/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ human_request })
    });
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  }


  static async createStreamingConversation(messageToSend, responseType) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/api/v1/generate-stream/create`, {  // Corrected path
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`  // Add the Authorization header
      },
      body: JSON.stringify({
        "query": messageToSend,
        "queryModeType": responseType
      })
    });
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  }

    static streamResponse(thread_id, onMessageCallback, onErrorCallback, onCompleteCallback) {
    // Create a new EventSource connection to the streaming endpoint
    const eventSource = new EventSource(`${BASE_URL}/api/v1/generate-stream/${thread_id}`);
    AssistantService.currentEventSource = eventSource
    // Handle token events (content streaming)
    eventSource.addEventListener('token', (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessageCallback({ content: data.content });
      } catch (error) {
        console.error("Error parsing token event:", error, "Raw data:", event.data);
        onErrorCallback(error);
      }
    });
    
    // Handle status events (user_feedback, finished)
    eventSource.addEventListener('status', (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessageCallback({ status: data.status });
        
        // Mark that we've received a status event for this connection
        // This helps us distinguish between normal completion and errors
        if (!window._hasReceivedStatusEvent) {
          window._hasReceivedStatusEvent = {};
        }
        window._hasReceivedStatusEvent[eventSource.url] = true;
        console.log("Received status event, marking connection for normal closure");
      } catch (error) {
        console.error("Error parsing status event:", error, "Raw data:", event.data);
        onErrorCallback(error);
      }
    });
    
    // Handle start/resume events
    eventSource.addEventListener('start', (event) => {
      console.log("Stream started:", event.data);
    });
    
    eventSource.addEventListener('resume', (event) => {
      console.log("Stream resumed:", event.data);
    });
    
    // Handle errors
    eventSource.onerror = (error) => {
      console.log("SSE connection state change - readyState:", eventSource.readyState);
      
      // Check if we've received a status event indicating completion
      const hasReceivedStatusEvent = window._hasReceivedStatusEvent && window._hasReceivedStatusEvent[eventSource.url];
      
      if (hasReceivedStatusEvent) {
        console.log("Stream completed normally after receiving status event");
        eventSource.close();
        onCompleteCallback();
        return;
      }
      
      // Only call the error callback if it's a real error, not a normal close
      if (eventSource.readyState !== EventSource.CLOSED && eventSource.readyState !== EventSource.CONNECTING) {
        console.error("SSE connection error:", error);
        eventSource.close();
        // Pass a proper error object with a message to avoid 'undefined' errors
        onErrorCallback(new Error("Connection error or server disconnected"));
      } else {
        // If it's a normal close or reconnecting, call the complete callback
        console.log("Stream completed normally");
        onCompleteCallback();
      }
    };
    
    // Return the eventSource so it can be closed externally if needed
    return eventSource;
  }

  static stopStreaming() {
    if (AssistantService.currentEventSource) {
      AssistantService.currentEventSource.close();
      console.log("Streaming stopped");
      AssistantService.currentEventSource = null; // Clear the reference
    } else {
      console.log("No active stream to stop");
    }
  }
}

