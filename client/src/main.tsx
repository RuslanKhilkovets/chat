import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </StrictMode>
  </BrowserRouter>,
);