import React, { useState, useEffect } from "react";
import styles from "../styles/ChatWindow.module.css";
import ChatMessage from "./ChatMessage.jsx";
import MessageInput from "./MessageInput.jsx";

// ChatWindow component displays the chat interface for a selected conversation
const ChatWindow = ({ profilePic, name, messages }) => {
  const [localMessages, setLocalMessages] = useState([]);

  useEffect(() => {
    setLocalMessages(messages); // initialize when chat changes
  }, [messages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
  const container = document.querySelector(`.${styles["messages-container"]}`);
  if (container) container.scrollTop = container.scrollHeight;
}, [localMessages]);


  const handleSend = (newMessage) => {
    setLocalMessages((prev) => [
      ...prev,
      { role: "user", text: newMessage },
    ]);
  };

  return (
    <div className={styles["chat-window-container"]} data-testid="chat-window">
      {/* Header section displaying the chat participant's profile picture and name */}
      <div className={styles["chat-window-header"]}>
        <img src={profilePic} alt="Profile Picture" width={50} height={50} />
        {/* Display the chat participant's name */}
        <span style={{ fontSize: "22px" }}>{name}</span>
      </div>

      {/* Container for the chat messages */}
      <div className={styles["messages-container"]}>
        {/* Map through the messages array and render each message */}
        {localMessages.map((message, index) => (
          <ChatMessage key={index} role={message.role} message={message.text} />
        ))}
      </div>

      {/* Input area for sending new messages */}
      <MessageInput onSend={handleSend}/>
    </div>
  );
};

export default ChatWindow;
