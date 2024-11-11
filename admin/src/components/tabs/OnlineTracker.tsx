import useAuthMutation from '../../hooks/useAuthMutation';
import useTrackOnlineUsers from '../../hooks/useTrackOnlineUsers';
import { Api } from '../../api/index';
import { useEffect, useState } from 'react';

const OnlineTracker = () => {
  const [users, setUsers] = useState([]);
  const { onlineUsers } = useTrackOnlineUsers();

  const { mutate: getUsersMutation, isLoading } = useAuthMutation({
    mutationFn: Api.users.getAllUsers,
    onSuccess: res => {
      setUsers(res.data.users);
    },
  });

  console.log(onlineUsers);

  useEffect(() => {
    getUsersMutation();
  }, []);

  return (
    <div className="tab">
      <h2 style={{ fontSize: '32px', color: '#E1FF00' }}>Users</h2>
      <div style={logsContainerStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Login</th>
              <th style={tableHeaderStyle}>ID</th>
              <th style={tableHeaderStyle}>Email</th>
              <th style={tableHeaderStyle}>Created</th>
              <th style={tableHeaderStyle}>Is online</th>
            </tr>
          </thead>
          <tbody>
            {users?.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid #ccc' }}>
                <td style={tableCellStyle}>{user.name}</td>
                <td style={tableCellStyle}>{user._id}</td>
                <td style={tableCellStyle}>{user.email}</td>
                <td style={tableCellStyle}>
                  {new Date(user.createdAt).toLocaleDateString('ua') +
                    ' ' +
                    new Date(user.createdAt).toLocaleTimeString('ua')}
                </td>
                <td style={tableCellStyle}>{'no'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const logsContainerStyle = {
  maxHeight: '90vh',
  overflowY: 'auto',
  position: 'relative',
};

const tableHeaderStyle = {
  padding: '10px',
  backgroundColor: '#333',
  color: '#fff',
  textAlign: 'left',
  position: 'sticky',
  top: 0,
  zIndex: 1,
};

const tableCellStyle = {
  padding: '10px',
};

export default OnlineTracker;
