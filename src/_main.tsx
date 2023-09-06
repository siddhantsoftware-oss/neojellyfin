import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";

import { QueryClient, QueryClientProvider } from "react-query";
import Index from "./pages";

const queryClient = new QueryClient();

export const apiServerUrl = "http://localhost:3000";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Index />
    </QueryClientProvider>
  </React.StrictMode>
);
