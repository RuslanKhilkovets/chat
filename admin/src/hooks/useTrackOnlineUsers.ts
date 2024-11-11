import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/Auth/AuthContext';

export default function useTrackOnlineUsers() {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      const newSocket = io(import.meta.env.VITE_SOCKET_URL);
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        console.log('Socket disconnected');
      };
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      console.log('Socket connected:', socket);

      socket.on('getOnlineUsers', response => {
        setOnlineUsers(response);
      });

      return () => {
        socket.off('getOnlineUsers');
      };
    }
  }, [socket]);

  return { onlineUsers };
}
