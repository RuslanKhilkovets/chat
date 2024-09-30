import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';

const Chat = () => {
  const { userChats, isUserChatsLoading } = useContext(ChatContext);
  console.log(userChats);

  return <>chat</>;
};

export default Chat;
