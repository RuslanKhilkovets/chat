import { Stack } from 'react-bootstrap';
import { useFetchRecipient } from '../../hooks/useFetchRecipient';
import avatar from '../../assets/avatar.svg';
import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';

const UserChat = ({ user, chat }) => {
  const { recipientUser } = useFetchRecipient(chat, user);
  const { onlineUsers } = useContext(ChatContext);

  const isOnline = onlineUsers?.some(user => user?.userId === recipientUser?._id);

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-2 justify-content-between"
      role="button"
    >
      <div className="d-flex">
        <div className="me-2">
          <img src={avatar} alt="" height={'35px'} />
        </div>
        <div className="text-content">
          <div className="name">{recipientUser?.name}</div>
          <div className="text">TextMessage</div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">12/12/1221</div>
        <div className="this-user-notifications">2</div>
        {isOnline && <span className="user-online"></span>}
      </div>
    </Stack>
  );
};

export default UserChat;
