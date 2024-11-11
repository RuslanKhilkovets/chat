import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/Auth/AuthContext';

export default function useTrackOnlineUsers() {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL);
    setSocket(import.meta.env.VITE_SOCKET_URL);

    console.log(import.meta.env.VITE_SOCKET_URL);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket && socket?.isConnected) {
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
