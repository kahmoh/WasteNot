import React from "react";
import RootLayout from "./RootLayout";

const App = () => {
  return (
    <Router>
      {/* RootLayout contains the global Header component, wraps all other children components */}
      <RootLayout>
        <Routes>
          <Route path="/" element={<Map />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </RootLayout>
    </Router>
  );
};

export default App;
