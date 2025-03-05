"use client";
import "@/app/globals.css";
import React, { useState } from "react";
import ChatList from "@/components/ChatList";
import ChatWindow from "@/components/ChatWindow";

export default function Messages() {
  // State to track the currently selected chat
  const [selectedChat, setSelectedChat] = useState(null);
  // Static chat data (will be replaced with data from an API)
  const [chats] = useState([
    {
      id: 1,
      name: "Sarah",
      profilePic: "/placeholder_profile_img.png",
      messages: [
        { text: "Hey how are you?", role: "user", timestamp: "1:30 PM" },
        {
          text: "I'd like to ask you a couple of questions",
          role: "user",
          timestamp: "1:32 PM",
        },
        { text: "Hey there!", role: "other", timestamp: "1:47 PM" },
      ],
    },
    {
      id: 2,
      name: "John",
      profilePic: "/placeholder_profile_img_2.png",
      messages: [
        { text: "Thanks!", role: "other", timestamp: "1:59 PM" },
        { text: "You're welcome!", role: "user", timestamp: "2:00 PM" },
      ],
    },
  ]);
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {/* ChatList component displays the list of chats */}
      <ChatList
        chats={chats} // Pass the list of chats
        onChatSelect={(chatId) =>
          // Update selectedChat when a chat is clicked
          setSelectedChat(chats.find((c) => c.id === chatId))
        }
        selectedChat={selectedChat}
      />
      {/* Conditional rendering for ChatWindow or empty state */}
      {selectedChat ? (
        // If a chat is selected, show the ChatWindow
        <ChatWindow
          profilePic={selectedChat.profilePic}
          name={selectedChat.name}
          messages={selectedChat.messages}
        />
      ) : (
        // Show this text when no chat is selected
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 90px)",
            width: "75vw",
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "1.2rem",
          }}
        >
          Select a chat to start messaging
        </div>
      )}
    </div>
  );
}
