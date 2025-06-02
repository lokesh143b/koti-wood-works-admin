import { createRoot } from "react-dom/client";
import React from 'react'

import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminProvider>
        <App />
      </AdminProvider>
    </BrowserRouter>
  </React.StrictMode>
);



