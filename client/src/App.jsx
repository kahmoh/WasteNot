import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./RootLayout";
import Messages from "./messages/Messages";
import Map from "./map/Map";

const App = () => {
  return (
    <>
      {/* RootLayout contains the global Header component, wraps all other children components */}
      <RootLayout>
        <Routes>
          <Route path="/" element={<Map />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </RootLayout>
    </>
  );
};

export default App;
