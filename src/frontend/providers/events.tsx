import React, { createContext, useContext, useEffect, useRef } from "react";
import { useAppDispatch } from "../context/hooks.ts";
import { updateIssueFromSocket } from "../context/issues/reducer.ts";
import { EventType } from "@/../backend/events/types.ts";

interface EventsContextValue {
  send: (data: unknown) => void;
}

const EventsContext = createContext<EventsContextValue | null>(null);

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ Connected to ws");
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === EventType.IssueUpdated && message.payload) {
          dispatch(updateIssueFromSocket(message.payload));
        }
      } catch {
        console.log("Received:", event.data);
      }
    };

    socket.onclose = () => {
      console.log("Disconnected");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, []);

  const send = (data: unknown) => {
    const socket = socketRef.current;

    if (socket?.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket is not connected");
      return;
    }

    socket.send(JSON.stringify(data));
  };

  return (
    <EventsContext.Provider value={{ send }}>{children}</EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);

  if (!context) {
    throw new Error("useEvents must be used inside EventsProvider");
  }

  return context;
};
