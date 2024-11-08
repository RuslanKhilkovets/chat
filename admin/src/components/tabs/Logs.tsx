import { useEffect, useState } from 'react';
import useAuthMutation from '../../hooks/useAuthMutation';
import { Api } from '../../api/index';

const Logs = () => {
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);
  const { mutate: logsMutate, isLoading } = useAuthMutation({
    mutationFn: Api.logs.getAllLogs,
    onSuccess: res => {
      setLogs(res.data);
    },
    onError: ({ message }) => {
      setError(message);
    },
  });

  useEffect(() => {
    logsMutate();
  }, []);

  return (
    <div className="tab">
      <h2 style={{ fontSize: '32px', color: '#E1FF00' }}>Logs (only for this account)</h2>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : isLoading ? (
        <p>Loading...</p>
      ) : (
        <div style={logsContainerStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Timestamp</th>
                <th style={tableHeaderStyle}>Level</th>
                <th style={tableHeaderStyle}>Message</th>
                <th style={tableHeaderStyle}>User</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id} style={{ borderBottom: '1px solid #ccc' }}>
                  <td style={tableCellStyle}>{new Date(log.timestamp).toLocaleString()}</td>
                  <td style={{ ...tableCellStyle, color: getLogLevelColor(log.level) }}>
                    {log.level}
                  </td>
                  <td style={tableCellStyle}>{log.message}</td>
                  <td style={tableCellStyle}>{log.metadata?.login || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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

const getLogLevelColor = level => {
  switch (level) {
    case 'info':
      return '#00bfff';
    case 'warning':
      return '#ffcc00';
    case 'error':
      return '#ff3333';
    default:
      return '#333';
  }
};

export default Logs;
