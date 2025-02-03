import React from "react";
import styles from "../../styles/ChatItem.module.css";
import Image from "next/image";

const ChatItem = ({profilePic, name, msgPreview, timestamp, onClick, isSelected}) => {
  return (
    <div className={`${styles["chat-item-container"]} ${isSelected ? styles["selected"] : ""}`}
    onClick={onClick}
    role="button"
    tabIndex={0}>
      {/* This extra container is to align the "name-and-msg-container" closer to the profile pic */}  
      <div className={styles["profile-container"]}>
        {/* Profile pic on the left */}
        <Image
          src={profilePic}
          alt="Profile Picture"
          width={50}
          height={50}
        />
        {/* Contains the name and message preview of the chat */}
        <div className={styles["name-and-msg-container"]}>
          <span className={styles["name"]}>{name}</span>
          <span className={styles["msg-preview"]}>{msgPreview}</span>
        </div>
      </div>
      {/* Timestamp displayed on the right */}
      <span className={styles["timestamp"]}>{timestamp}</span>
    </div>
  );
};

export default ChatItem;
