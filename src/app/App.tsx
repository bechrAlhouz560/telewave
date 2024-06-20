import React, { createContext, useEffect, useState } from "react";
import { TelegramClient } from "telegram";
import Button from "./components/Button";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { API_HASH, API_ID } from "../api/global";
export const TelegramClientContext = createContext<TelegramClient>(null);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <div className="text-red-600">App</div>
        <Button></Button>
      </div>
    ),
  },
]);
function App() {
  const client = new telegram.TelegramClient(
    new telegram.sessions.StoreSession("vido-session"),
    API_ID,
    API_HASH,
    { connectionRetries: 5 }
  );
  return (
    <TelegramClientContext.Provider value={client}>
      <RouterProvider router={router} />
    </TelegramClientContext.Provider>
  );
}

export default App;
