import { useEffect, useState } from 'react';
import { Typography, CircularProgress, Alert, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import useAuthMutation from '../../hooks/useAuthMutation';
import { Api } from '../../api/index';

const Manage = () => {
  const [error, setError] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const { _id: adminId } = JSON.parse(localStorage.getItem('user')) || null;

  const { mutate: getTokensMutate, isLoading: isGetTokensLoading } = useAuthMutation({
    mutationFn: Api.tokens.getTokensByAdmin,
    onSuccess: res => {
      setTokens(res.data);
    },
    onError: ({ message }) => {
      setError(message);
    },
  });

  const { mutate: createTokenMutate, isLoading: isCreateTokenLoading } = useAuthMutation({
    mutationFn: Api.tokens.createToken,
    onSuccess: res => {
      setTokens(res.data);
    },
  });

  const { mutate: deleteTokenMutate } = useAuthMutation({
    mutationFn: Api.tokens.deleteToken,
    onSuccess: res => {
      setTokens(res.data);
    },
  });

  const handleCopyToken = token => {
    navigator.clipboard.writeText(token);
  };

  const handleDeleteToken = token => {
    setTokens(prevTokens => prevTokens.filter(t => t?.token !== token));

    const payload = {
      token,
      adminId,
    };

    deleteTokenMutate(payload);
  };

  const onSort = key => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sortedTokens = [...tokens].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setTokens(sortedTokens);
  };

  useEffect(() => {
    getTokensMutate(adminId);
  }, []);

  return (
    <div style={containerStyle}>
      <p style={headingStyle}>Manage Access Tokens</p>
      <Button
        variant="contained"
        color="primary"
        disabled={isCreateTokenLoading}
        onClick={() => createTokenMutate(adminId)}
        style={buttonStyle}
      >
        {isCreateTokenLoading ? 'Creating...' : 'Create New Token'}
      </Button>

      {error ? (
        <Alert severity="error" style={alertStyle}>
          {error}
        </Alert>
      ) : isGetTokensLoading ? (
        <CircularProgress style={loadingStyle} />
      ) : tokens && tokens.length !== 0 ? (
        <div style={tableContainerStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Token</th>
                <th style={tableHeaderStyle} onClick={() => onSort('isUsed')}>
                  Used{' '}
                  {sortConfig.key === 'isUsed' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th style={tableHeaderStyle}></th>
              </tr>
            </thead>
            <tbody>
              {tokens.map(token => (
                <tr key={token._id} hover>
                  <th style={tableCellStyle}>{token.token}</th>
                  <th style={tableCellStyle}>{token.isUsed ? 'Yes' : 'No'}</th>
                  <th style={tableCellStyle}>
                    <IconButton onClick={() => handleCopyToken(token.token)} aria-label="copy">
                      <ContentCopyIcon color="info" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteToken(token.token)}
                      aria-label="delete"
                      color="secondary"
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Typography>No tokens yet!</Typography>
      )}
    </div>
  );
};

const containerStyle = {
  fontFamily: "'Jersey 20', serif",
};

const headingStyle = {
  fontSize: '32px',
};

const buttonStyle = {
  marginBottom: '20px',
};

const alertStyle = {
  marginTop: '20px',
};

const loadingStyle = {
  marginTop: '20px',
};

const tableContainerStyle = {
  maxHeight: '75vh',
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
  height: '50px',
  textAlign: 'left',
  borderBottom: '1px solid #fff',
};

export default Manage;
