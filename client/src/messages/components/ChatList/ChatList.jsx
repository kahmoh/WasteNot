import React, { useState } from "react";
import ChatItem from "../ChatItem/ChatItem.jsx";
import styles from "../../styles/ChatList.module.css";

const ChatList = ({ chats, onChatSelect, selectedChat }) => {
  // State for search input and chat data
  const [searchQuery, setSearchQuery] = useState("");

  // Filter chats based on search query
  const filteredChats = chats.filter((chat) => {
    // Search by participant name
    const participantName = chat.otherParticipant.displayName.toLowerCase();
    // Search by last message text (if exists)
    const lastMessageText = chat.lastMessage?.text?.toLowerCase() || "";

    return (
      participantName.includes(searchQuery.toLowerCase()) ||
      lastMessageText.includes(searchQuery.toLowerCase())
    );
  });

  // Format last message preview
  const getLastMessagePreview = (chat) => {
    if (chat.lastMessage) {
      return chat.lastMessage.text.length > 30
        ? `${chat.lastMessage.text.substring(0, 30)}...`
        : chat.lastMessage.text;
    }
    return "No messages yet";
  };

  // Format timestamp
  const getLastMessageTime = (chat) => {
    if (!chat.lastMessage) return "";

    const date = new Date(chat.lastMessage.createdAt);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

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
          aria-label="Search chats"
        />
        <img src="/search_icon.png" alt="Search Icon" width={30} height={30} />
      </div>

      {/* Filtered Chat Items */}
      {filteredChats.length > 0 ? (
        filteredChats.map((chat) => (
          <ChatItem
            key={chat.id}
            profilePic={chat.otherParticipant.profilePic}
            isSelected={selectedChat?.id === chat.id}
            name={chat.otherParticipant.displayName}
            msgPreview={getLastMessagePreview(chat)}
            timestamp={getLastMessageTime(chat)}
            status={chat.otherParticipant.status}
            unreadCount={chat.unreadCount}
            onClick={() => onChatSelect(chat.id)}
          />
        ))
      ) : (
        <div className={styles["no-results"]}>
          {searchQuery ? "No matching chats found" : "No chats available"}
        </div>
      )}
    </div>
  );
};

export default ChatList;
