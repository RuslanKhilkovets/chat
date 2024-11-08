import { useEffect, useState } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
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
    onError: ({ message }) => {},
  });

  const { mutate: deleteTokenMutate } = useAuthMutation({
    mutationFn: Api.tokens.deleteToken,
    onSuccess: res => {
      setTokens(res.data);
    },
    onError: ({ message }) => {},
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
        <TableContainer component={Paper} style={tableContainerStyle}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={tableHeaderStyle}>Token</TableCell>
                <TableCell style={tableHeaderStyle} onClick={() => onSort('isUsed')}>
                  Used{' '}
                  {sortConfig.key === 'isUsed' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </TableCell>
                <TableCell style={tableHeaderStyle}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tokens.map(token => (
                <TableRow key={token._id} hover>
                  <TableCell style={tableCellStyle}>{token.token}</TableCell>
                  <TableCell style={tableCellStyle}>{token.isUsed ? 'Yes' : 'No'}</TableCell>
                  <TableCell style={tableCellStyle}>
                    <IconButton onClick={() => handleCopyToken(token.token)} aria-label="copy">
                      <ContentCopyIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteToken(token.token)}
                      aria-label="delete"
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
  color: '#E1FF00',
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
  height: '80vh',
};

const tableHeaderStyle = {
  backgroundColor: '#333',
  color: '#fff',
  cursor: 'pointer',
};

const tableCellStyle = {
  color: '#333',
};

export default Manage;
