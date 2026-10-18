import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import "./lib/i18n";
import { EnvErrorFallback } from "./components/EnvErrorFallback";

const basename = import.meta.env.BASE_URL;

const envError = (window as unknown as { __ENV_VALIDATION_ERROR__?: unknown }).__ENV_VALIDATION_ERROR__;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {envError ? (
      <EnvErrorFallback />
    ) : (
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    )}
  </React.StrictMode>,
);
