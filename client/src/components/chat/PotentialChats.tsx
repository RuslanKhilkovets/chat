import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const PotentialChats = () => {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

  // Фільтрація потенційних чатів, щоб не включати поточного користувача
  const filteredChats = potentialChats?.filter(chat => chat?._id !== user?._id);

  return (
    <div className="all-users">
      {filteredChats?.length !== 0 &&
        filteredChats.map((u, index) => (
          <div key={index} className="single-user">
            <div className="user-info" onClick={() => createChat(user?._id, u._id)}>
              <h4>{u.name}</h4>
              <span
                className={onlineUsers?.some(user => u?._id === user.userId) ? 'user-online' : ''}
              ></span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default PotentialChats;
