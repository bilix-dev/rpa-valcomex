"use client";
import { WS_STATUS } from "@/helpers/helper";
import { createContext, useContext, useMemo, useState } from "react";
import { StompSessionProvider } from "react-stomp-hooks";
import { useSubscription } from "react-stomp-hooks";
const WsContext = createContext();

export function useWs() {
  return useContext(WsContext);
}

export function WsProvider({ children }) {
  const [status, setStatus] = useState(WS_STATUS.disconnected);
  return (
    <StompSessionProvider
      url={process.env.NEXT_PUBLIC_WS_URL}
      connectHeaders={{ Authorization: process.env.NEXT_PUBLIC_WS_AUTH }}
      onConnect={(e) => setStatus(WS_STATUS.connected)}
      onWebSocketError={(e) => setStatus(WS_STATUS.error)}
      //All options supported by @stomp/stompjs can be used here
    >
      <Child status={status}>{children}</Child>
    </StompSessionProvider>
  );
}

const Child = ({ status, children }) => {
  const [lastMessage, setLastMessage] = useState({});
  useSubscription("/topic/notification", (message) => {
    if (JSON.stringify(lastMessage) !== message.body)
      setLastMessage(JSON.parse(message.body));
  });
  return (
    <WsContext.Provider value={{ status, info: lastMessage }}>
      {children}
    </WsContext.Provider>
  );
};
