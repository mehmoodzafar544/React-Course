import { useState, useRef, useEffect } from "react";
import { Chatbot } from "supersimpledev";

import "./App.css";

function ChatInput({ chatMessages, setChatMessages, isLoading, setIsLoading }) {
  const [inputText, setInputText] = useState("");

  function saveInputText(event) {
    setInputText(event.target.value);
  }
  async function sendMessage() {
    if (isLoading) return;
    if (!inputText) return;
    setIsLoading(true);
    const newChatMessages = [
      ...chatMessages,
      {
        message: inputText,
        sender: "user",
        id: crypto.randomUUID(),
      },
    ];

    setChatMessages(newChatMessages);
    setInputText("");

    setChatMessages([
      ...newChatMessages,
      {
        message: <img src="loading-spinner.gif" className="loading-gif" />,
        sender: "robot",
        id: crypto.randomUUID(),
      },
    ]);

    const response = await Chatbot.getResponseAsync(inputText);

    setChatMessages([
      ...newChatMessages,
      {
        message: response,
        sender: "robot",
        id: crypto.randomUUID(),
      },
    ]);

    // setInputText("");
    setIsLoading(false);
  }

  return (
    <div className="send-input-container">
      <input
        placeholder="Send a message to Chatbot"
        size="30"
        onChange={saveInputText}
        value={inputText}
        onKeyDown={(e) => {
          e.key === "Enter" && sendMessage();
          e.key === "Escape" && setInputText("");
        }}
        className="send-input"
      />
      <button className="send-button" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
}

function ChatMessage({ message, sender }) {
  return (
    <div
      className={sender === "user" ? "chat-message-user" : "chat-message-robot"}
    >
      {sender === "robot" && (
        <img src="robot.png" className="chat-message-profile" />
      )}
      <div className="chat-input-text">{message}</div>

      {sender === "user" && (
        <img src="user.png" className="chat-message-profile" />
      )}
    </div>
  );
}

function ChatMessages({ chatMessages }) {
  const chatMessagesRef = useAutoScroll(chatMessages);
  /*         const chatMessagesRef = React.useRef(null);

        React.useEffect(() => {
          // anything naming with Elem tells us that this variable is an HTML element
          const containerElem = chatMessagesRef.current;
          if (containerElem) {
            containerElem.scrollTop = containerElem.scrollHeight;
          }
        }, [chatMessages]); */

  return (
    <div className="chat-messages-container" ref={chatMessagesRef}>
      {chatMessages.map((chatMessage) => {
        return (
          <ChatMessage
            message={chatMessage.message}
            sender={chatMessage.sender}
            key={chatMessage.id}
          />
        );
      })}
    </div>
  );
}
function WelcomeMessage({ chatMessages }) {
  if (chatMessages.length === 0) {
    return (
      <p className="welcome-message">
        Welcome to the chatbot project! Send a message using the textbox below.
      </p>
    );
  }
}
function useAutoScroll(dependencies) {
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    // anything naming with Elem tells us that this variable is an HTML element
    const containerElem = chatMessagesRef.current;
    if (containerElem) {
      containerElem.scrollTop = containerElem.scrollHeight;
    }
  }, [dependencies]);
  return chatMessagesRef;
}

function App() {
  const [chatMessages, setChatMessages] = useState([
    /* {
            message: "hello chatbot",
            sender: "user",
            id: "id1",
          },
          {
            message: "Hello! How can I help you?",
            sender: "robot",
            id: "id2",
          },
          {
            message: "can you get me todays date?",
            sender: "user",
            id: "id3",
          },
          {
            message: "Today is November 22",
            sender: "robot",
            id: "id4",
          }, */
  ]);
  // const [chatMessages, setChatMessages] = array;
  // const chatMessages = array[0];
  // const setChatMessages = array[1];
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="app-container">
      <WelcomeMessage chatMessages={chatMessages} />
      <ChatMessages chatMessages={chatMessages} />

      <ChatInput
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}

export default App;
