"use client";
import React, { useState, useEffect } from "react";
import ChatItem from "./ChatItem";
import styles from "../../styles/ChatList.module.css";
import Image from "next/image";

const ChatList = ({chats, onChatSelect, selectedChat}) => {
  // State for search input and chat data
  const [searchQuery, setSearchQuery] = useState("");

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => {
    const lastMessage = chat.messages[chat.messages.length - 1]?.text || '';
    return (
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className={styles["chatlist-container"]}>
      <span>Chats</span>
      {/* Search bar to filter chat items */}
      <div className={styles["search-bar"]}>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles["search-input"]}
        />
        <Image
          src="/search_icon.png"
          alt="Search Icon"
          width={30}
          height={30}
        />
      </div>

      {/* Filtered Chat Items */}
      {filteredChats.length > 0 ? (
        filteredChats.map((chat) => (
          <ChatItem
            key={chat.id}
            profilePic={chat.profilePic}
            isSelected={selectedChat?.id === chat.id}
            name={chat.name}
            msgPreview={chat.messages.length > 0 ? chat.messages[chat.messages.length -1].text : ''}
            timestamp={chat.messages.length > 0 ? chat.messages[chat.messages.length -1].timestamp : ''}
            onClick={() => onChatSelect(chat.id)}
          />
        ))
      ) : (
        <div className={styles["no-results"]}>No chats found</div>
      )}
    </div>
  );
};

export default ChatList;
