import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/Auth/AuthContext";

export default function useTrackOnlineUsers() {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize the socket only when the component mounts or user changes
    const newSocket = io(import.meta.env.VITE_SOCKET_URL);
    setSocket(newSocket);

    // Clean up the socket connection on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    // Only set up the listener if the socket is available
    if (socket) {
      socket.on("getOnlineUsers", (response) => {
        setOnlineUsers(response);
      });

      // Clean up the event listener on component unmount or socket change
      return () => {
        socket.off("getOnlineUsers");
      };
    }
  }, [socket]);

  return { onlineUsers };
}
