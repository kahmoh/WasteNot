// src/layouts/RootLayout.jsx
import React from "react";
import Header from "./globalComponents/Header";
import "./globals.css"; // Adjust path based on your structure

export default function RootLayout({ children }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
