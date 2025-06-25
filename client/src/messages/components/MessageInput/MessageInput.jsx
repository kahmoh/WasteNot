import React, { useState } from "react";
import styles from "../../styles/MessageInput.module.css";

const MessageInput = ({ onSend }) => {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (input.trim() === "" || isSending) return;

    setIsSending(true);
    try {
      await onSend(input);
      setInput(""); // Clear the input after successful send
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optionally keep the message for retry
    } finally {
      setIsSending(false);
    }
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
        disabled={isSending}
      />
      <div
        className={styles["send-icon"]}
        onClick={handleSend}
        data-testid="send-button"
        style={{ opacity: isSending ? 0.5 : 1 }}
      >
        <img src="/send-button.png" alt="Send Button" width={15} height={15} />
        {isSending && <span className={styles["sending-spinner"]} />}
      </div>
    </div>
  );
};

export default MessageInput;
