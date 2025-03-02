import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import '@css/app.css'; // используй алиас



console.log("Монтируем React в DOM");

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <Router>
      {console.log("Router отрендерился")}
      <Routes>
        {console.log("Routes отрендерились")}
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
