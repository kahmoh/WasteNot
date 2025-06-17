import React, { useState } from "react";
import styles from "../styles/MessageInput.module.css";

const MessageInput = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    onSend(input);
    setInput(""); // Clear the input after sending
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className={styles["message-input-container"]}>
      <input
        className="outline-none bg-transparent border-none w-full"
        type="text"
        placeholder="Send a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        data-testid="message-input"
      />
      <div
        className={styles["send-icon"]}
        onClick={handleSend}
        data-testid="send-button"
      >
        <img src="/send-button.png" alt="Send Button" width={15} height={15} />
      </div>
    </div>
  );
};

export default MessageInput;
