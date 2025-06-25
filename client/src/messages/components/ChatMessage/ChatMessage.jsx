import React from 'react'
import styles from "../../styles/ChatMessage.module.css"

const ChatMessage = ({isCurrentUser, message}) => {
  return (
    <div className={styles["chat-message-container"]}>
      {/* CHANGE THIS LOGIC */}
        <div className={`${isCurrentUser ? styles["chat-message-user"] : styles["chat-message-other"]}`}>
            {message}
        </div>
    </div>
  )
}

export default ChatMessage