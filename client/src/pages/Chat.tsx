import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { Container, Stack } from 'react-bootstrap';
import UserChat from '../components/chat/UserChat';
import { AuthContext } from '../context/AuthContext';
import PotentialChats from '../components/chat/PotentialChats';
import ChatBox from '../components/chat/ChatBox';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading, updateCurrentChat } = useContext(ChatContext);

  return (
    <Container>
      <PotentialChats />
      {userChats?.length === 0 ? null : (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="flex-grow-0 pe-3 messages-box" gap={3}>
            {isUserChatsLoading && <p>Loading...</p>}
            {userChats !== null &&
              userChats?.map((chat, index) => {
                return (
                  <div className="" key={index} onClick={() => updateCurrentChat(chat)}>
                    <UserChat chat={chat} user={user} />
                  </div>
                );
              })}
          </Stack>
          <ChatBox />
        </Stack>
      )}
    </Container>
  );
};

export default Chat;
