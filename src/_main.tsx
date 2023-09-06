import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import Router from "./router";

import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export const apiServerUrl = "http://localhost:3000"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  </React.StrictMode>
);
