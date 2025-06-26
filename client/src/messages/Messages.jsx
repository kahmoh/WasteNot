import "../globals.css";
import React, { useState, useEffect } from "react";
import ChatList from "./components/ChatList/ChatList.jsx";
import ChatWindow from "./components/ChatWindow/ChatWindow.jsx";
import { io } from "socket.io-client";

// Initialize Socket.IO connection to the backend
const socket = io("http://localhost:3001");

export default function Messages() {
  // All available chats for the current user
  const [chats, setChats] = useState([]);
  // Currently selected chat object
  const [selectedChat, setSelectedChat] = useState(null);
  // Messages for the selected chat
  const [selectedChatMessages, setSelectedChatMessages] = useState(null);
  // const chatsRef = useRef([]);
  const [currentUser, setCurrentUser] = useState({});

  /**
   * Fetches all chat sessions from the backend.
   * Maps each chat to include the other participant and metadata.
   * If no chat is selected, auto-selects the first one.
   */
  const fetchChats = async () => {
    try {
      const response = await fetch("/api/chats");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log("Fetched chats raw data:", data); // Debug log

      // Format the raw chat data
      const formattedChats = data.map((chat) => {
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

  /**
   * Handles incoming messages via Socket.IO
   * - Updates last message and unread count
   * - Appends message if it belongs to the current chat
   */
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

    // change to setselectedmessages!!
    if (selectedChat?.id === chatId) {
      setSelectedChatMessages((prev) => [
        ...prev,
        { text, sender, createdAt: new Date() },
      ]);
    }
  };

  // Lifecycle effect: fetch initial chats and set up Socket.IO listeners
  useEffect(() => {
    fetchChats();
    socket.on("receive-message", handleNewMessage);

    return () => {
      socket.off("receive-message", handleNewMessage);
    };
  }, []); // Only re-run if these change

  /**
   * Sends a message through both Socket.IO and the REST API.
   * Performs optimistic UI update.
   */
  const handleSendMessage = async (text) => {
    if (!selectedChat || !currentUser) return;

    // Optimistic update
    const newMessage = {
      text,
      sender: currentUser._id,
      createdAt: new Date(),
    };

    // Optimistic update
    setSelectedChatMessages((prev) => [...prev, newMessage]);

    try {
      // 1. Send to backend to save
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: selectedChat.id,
          text,
          sender: currentUser._id,
        }),
      });

      // Optional: Get the saved message (with _id, timestamps) back
      const savedMessage = await res.json();

      // 2. Emit to others via WebSocket
      socket.emit("send-message", savedMessage); // Now includes chatId, text, sender, createdAt
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  /**
   * Called when a chat is selected in the sidebar.
   * - Fetches messages for that chat
   * - Updates selected chat state
   */
  const handleChatSelect = async (chatId) => {
    const chat = chats.find((c) => c.id === chatId);
    setSelectedChat(chat);

    // Load messages for the selected chat
    const messages = await fetch(`/api/messages/${chatId}`).then((res) =>
      res.json()
    );

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
