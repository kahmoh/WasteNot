import React from 'react'
import styles from "../styles/ChatMessage.module.css"

const ChatMessage = ({message, role}) => {
  return (
    <div className={styles["chat-message-container"]}>
        <div className={`${role == 'user' ? styles["chat-message-user"] : styles["chat-message-other"]}`}>
            {message}
        </div>
    </div>
  )
}

export default ChatMessage