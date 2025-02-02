import React from 'react';
import styles from "../../styles/MessageInput.module.css";
import Image from 'next/image';

const MessageInput = () => {
  return (
    <div className={styles["message-input-container"]}>
        <span>Send a message...</span>
        <div className={styles["send-icon"]}>
            <Image src="/send-button.png" alt="Send Button" width={15} height={15}/>
        </div>
    </div>
  )
}

export default MessageInput