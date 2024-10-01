import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const PotentialChats = () => {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChat } = useContext(ChatContext);
  console.log(potentialChats);

  return (
    <div className="all-users">
      {potentialChats?.length !== 0 &&
        potentialChats.map((u, index) => (
          <div key={index} className="single-user">
            <div className="user-info" onClick={() => createChat(user?._id, u._id)}>
              <h4>{u.name}</h4>
              <span className="user-online"></span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default PotentialChats;
