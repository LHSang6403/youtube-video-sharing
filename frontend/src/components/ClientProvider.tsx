"use client";

import React, { createContext, useState, useEffect } from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { io, Socket } from "socket.io-client";
import Notifications from "./Notifications";
import { Notification } from "@/types";

export const SocketContext = createContext<Socket | null>(null);

interface ClientProviderProps {
  children: React.ReactNode;
}

export default function ClientProvider({ children }: ClientProviderProps) {
  const [client] = useState(
    new ApolloClient({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      cache: new InMemoryCache(),
      headers: {
        authorization:
          typeof window !== "undefined" && localStorage.getItem("token")
            ? `Bearer ${localStorage.getItem("token")}`
            : "",
      },
    })
  );

  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_ENDPOINT!);
    setSocket(newSocket);

    newSocket.on("newVideo", (data: Notification) => {
      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <ApolloProvider client={client}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow p-4">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-3xl font-bold">YouTube Video Sharing App</h1>
              <Notifications notifications={notifications} />
            </div>
          </header>
          <main className="max-w-5xl mx-auto p-4">{children}</main>
        </div>
      </ApolloProvider>
    </SocketContext.Provider>
  );
}
