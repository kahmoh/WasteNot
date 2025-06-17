import "../globals.css";
import React, { useState, useEffect, useRef } from "react";
import ChatList from "./components/ChatList.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export default function Messages() {
  const [chats, setChats] = useState([]);
  // State to track the currently selected chat
  const [selectedChat, setSelectedChat] = useState(null);
  const chatsRef = useRef([]);

  useEffect(() => {
    // Initial dummy chats
    const initialChats = [
      {
        id: 1,
        name: "Sarah",
        profilePic: "/placeholder_profile_img.png",
        messages: [],
      },
      {
        id: 2,
        name: "John",
        profilePic: "/placeholder_profile_img_2.png",
        messages: [],
      },
    ];
    setChats(initialChats);
    chatsRef.current = initialChats;

    socket.on("receive-message", ({ chatId, text }) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    text,
                    role: "other",
                    timestamp: new Date().toLocaleTimeString(),
                  },
                ],
              }
            : chat
        )
      );
    });
  }, []);

  const handleSendMessage = (text) => {
    if (!selectedChat) return;

    const newMessage = {
      text,
      role: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    // Update UI immediately
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChat.id
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );

    // Emit to the server
    socket.emit("send-message", {
      chatId: selectedChat.id,
      text,
    });
  };

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
          onSend={handleSendMessage} // Pass to MessageInput
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
