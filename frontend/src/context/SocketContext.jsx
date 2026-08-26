import { useState, useEffect } from "react";
import { useAuthContext } from "./AuthContext";
import { SocketContext } from "./socketContext";
import io from "socket.io-client";

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (!authUser) {
      setSocket(null);
      return;
    }

    const socketConnection = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
      {
        query: {
          userId: authUser._id,
        },
      },
    );

    setSocket(socketConnection);

    socketConnection.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socketConnection.close();
      setSocket(null);
    };
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
