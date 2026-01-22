import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { initAnalytics } from "@/services/analyticsService";
import { isEnvValid } from "@/config/env";

/* import { TempoDevtools } from 'tempo-devtools'; [deprecated] */
/* TempoDevtools.init() [deprecated] */;

// Validate environment configuration
if (!isEnvValid()) {
  console.error(
    '🚨 Environment configuration is invalid. Check your .env file.\n' +
    'Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY'
  );
}

// Initialize analytics
initAnalytics();

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
