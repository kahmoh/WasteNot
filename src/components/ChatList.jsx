"use client";
import React, { useState, useEffect } from "react";
import ChatItem from "./ChatItem";
import styles from "../../styles/ChatList.module.css";
import Image from "next/image";

const ChatList = () => {
  // State for search input and chat data
  const [searchQuery, setSearchQuery] = useState("");
  const [chats] = useState([
    {
      id: 1,
      name: "Sarah",
      msgPreview: "Hey there!",
      timestamp: "1:47 PM",
      profilePic: "/placeholder_profile_img.png",
    },
    {
      id: 2,
      name: "John",
      msgPreview: "Thanks!",
      timestamp: "2:00 PM",
      profilePic: "/placeholder_profile_img_2.png",
    },
  ]);

  // Filter chats based on search query
  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.msgPreview.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            name={chat.name}
            msgPreview={chat.msgPreview}
            timestamp={chat.timestamp}
          />
        ))
      ) : (
        <div className={styles["no-results"]}>No chats found</div>
      )}
    </div>
  );
};

export default ChatList;
