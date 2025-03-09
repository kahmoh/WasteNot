"use client";
import React, { useEffect, useRef } from "react";
import styles from "../../styles/ChatWindow.module.css";
import Image from "next/image";
import ChatMessage from "./ChatMessage";
import MessageInput from "./MessageInput";

// ChatWindow component displays the chat interface for a selected conversation
const ChatWindow = ({ profilePic, name, messages, onNewMessage }) => {
  const messagesEndRef = useRef(null);

  const handleSend = (messageText) => {
    const newMessage = {
      text: messageText,
      role: "user", // Assuming the sender is always the user
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    };
    onNewMessage(newMessage);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [messages]);

  return (
    <div className={styles["chat-window-container"]}>
      {/* Header section displaying the chat participant's profile picture and name */}
      <div className={styles["chat-window-header"]}>
        <Image src={profilePic} alt="Profile Picture" width={50} height={50} />
        {/* Display the chat participant's name */}
        <span style={{ fontSize: "22px" }}>{name}</span>
      </div>

      {/* Container for the chat messages */}
      <div className={styles["messages-container"]}>
        {/* Map through the messages array and render each message */}
        {messages.map((message, index) => (
          <ChatMessage key={index} role={message.role} message={message.text} />
        ))}
        <div ref={messagesEndRef} /> {/* Invisible marker for scrolling */}
      </div>

      {/* Input area for sending new messages */}
      <MessageInput onSend={handleSend} />
    </div>
  );
};

export default ChatWindow;
