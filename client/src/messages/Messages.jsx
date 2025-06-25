import "../globals.css";
import React, { useState, useEffect } from "react";
import ChatList from "./components/ChatList/ChatList.jsx";
import ChatWindow from "./components/ChatWindow/ChatWindow.jsx";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export default function Messages() {
  const [chats, setChats] = useState([]);
  // State to track the currently selected chat
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedChatMessages, setSelectedChatMessages] = useState(null);
  // const chatsRef = useRef([]);
  const [currentUser, setCurrentUser] = useState({
    _id: "685c14670546ba0d70532048", // Must match participant IDs in your chats
    username: "john_doe",
    displayName: "John Doe",
    profilePic: "/john.jpg",
    status: "online",
    lastActive: new Date("2025-06-20T14:06:46.777Z"),
  });

  // Fetch chats with error handling
  const fetchChats = async () => {
    try {
      const response = await fetch("/api/chats");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log("Fetched chats raw data:", data); // Debug log

      const formattedChats = data.map((chat) => {
        // Safely determine the other participant
        const otherParticipant =
          chat.participant1._id === currentUser._id
            ? chat.participant2
            : chat.participant1;

        return {
          id: chat._id,
          otherParticipant,
          lastMessage: chat.lastMessage || null, // Handle undefined lastMessage
          unreadCount: chat.unreadCount || 0, // Default to 0 if undefined
          messages: chat.messages || [], // Initialize messages array
        };
      });

      setChats(formattedChats);
      console.log("Formatted chats:", formattedChats); // Debug log

      // If there are chats but none selected, auto-select the first one
      if (formattedChats.length > 0 && !selectedChat) {
        const firstChat = formattedChats[0];

        // Fetch messages first
        const messagesResponse = await fetch(`/api/messages/${firstChat.id}`);
        const messages = await messagesResponse.json();

        console.log("Chat messages:", messages);

        // Set selectedChat including messages in one go
        setSelectedChat({
          ...firstChat,
        });

        setSelectedChatMessages(messages);
      }
    } catch (error) {
      console.error("Failed to load chats:", error);
      // Optionally set an error state to show to users
    }
  };

  // Socket.IO listeners with cleanup
  const handleNewMessage = ({ chatId, text, sender }) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              lastMessage: { text, createdAt: new Date() },
              unreadCount:
                chat.id === selectedChat?.id ? 0 : (chat.unreadCount || 0) + 1,
            }
          : chat
      )
    );

    if (selectedChat?.id === chatId) {
      setSelectedChat((prev) => ({
        ...prev,
        messages: [...prev.messages, { text, sender, createdAt: new Date() }],
      }));
    }
  };

  useEffect(() => {
    fetchChats();
    socket.on("receive-message", handleNewMessage);

    return () => {
      socket.off("receive-message", handleNewMessage);
    };
  }, []); // Only re-run if these change

  // Keep selectedChat in sync with chats
  useEffect(() => {
    if (selectedChat) {
      const updatedChat = chats.find((c) => c.id === selectedChat.id);
      if (updatedChat) {
        setSelectedChat(updatedChat);
      }
    }
  }, [chats, selectedChat]);

  // Handle sending new messages
  // In your Messages component
  const handleSendMessage = async (text) => {
    if (!selectedChat || !currentUser) return;

    // Optimistic update
    const newMessage = {
      text,
      sender: currentUser._id,
      createdAt: new Date(),
    };

    setSelectedChat((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    try {
      // Socket.IO
      socket.emit("send-message", {
        chatId: selectedChat.id,
        text,
        sender: currentUser._id,
      });

      // REST API
      await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: selectedChat.id,
          text,
          sender: currentUser._id,
        }),
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleChatSelect = async (chatId) => {
    const chat = chats.find((c) => c.id === chatId);
    setSelectedChat(chat);

    // Fetch messages for this chat
    const messages = await fetch(`/api/messages/${chatId}`)
      .then(res => res.json());

    setSelectedChatMessages(messages);

    // Mark as read
    // await fetch(`/api/chats/${chatId}/read`, {
    //   method: "POST"
    // });
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {/* ChatList component displays the list of chats */}
      <ChatList
        chats={chats} // Pass the list of chats
        onChatSelect={handleChatSelect}
        selectedChat={selectedChat}
      />
      {/* Conditional rendering for ChatWindow or empty state */}
      {selectedChat ? (
        // If a chat is selected, show the ChatWindow
        <ChatWindow
          profilePic={selectedChat.otherParticipant.profilePic}
          name={selectedChat.otherParticipant.displayName}
          messages={selectedChatMessages}
          onSend={handleSendMessage} // Pass to MessageInput
          currentUser={currentUser}
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
