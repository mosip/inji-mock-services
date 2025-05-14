import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthRequestScreen from "./auth-request/auth_request_screen";
import QRJsonDisplay from "./qr-scanner/qr_scanner_screen";
import Header from "./header";

function App() {
  return (
    <Router>
      <Header/>
      
        <Routes>
          <Route path="/" element={<AuthRequestScreen />} />
          <Route path="/qrscreen" element={<QRJsonDisplay />} />
        </Routes>
    </Router>
  );
}

export default App;