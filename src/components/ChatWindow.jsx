import React from "react";
import styles from "../../styles/ChatWindow.module.css";
import Image from "next/image";
import ChatMessage from "./ChatMessage";
import MessageInput from "./MessageInput";

const ChatWindow = ({ profilePic, name }) => {
  return (
    <div className={styles["chat-window-container"]}>
      <div className={styles["chat-window-header"]}>
        <Image src={profilePic} alt="Profile Picture" width={50} height={50} />
        <span style={{ fontSize: "22px" }}>{name}</span>
      </div>
      <div className={styles["messages-container"]}>
        <ChatMessage message="Hey how are you?" role="user"/>
        <ChatMessage message="I'd like to ask you a couple of questions if you don't mind?" role="user"/>
        <ChatMessage message="Hey there!" role="other"/>
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatWindow;
