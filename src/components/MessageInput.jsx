"use client";
import React, { useState } from "react";
import styles from "../../styles/MessageInput.module.css";
import Image from "next/image";

const MessageInput = ({onSend}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behaviour
    if (message.trim()) { // Only send non-empty messages
      onSend(message);
      setMessage(""); // Clear input after submitting
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className={styles["message-input-container"]}>
      <input
        type="text"
        placeholder="Send a message..."
        className={styles["input-box"]}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" className={styles["send-icon"]}>
        <Image
          src="/send-button.png"
          alt="Send Button"
          width={15}
          height={15}
        />
      </button>
    </form>
  );
};

export default MessageInput;
