import { AuthContextProvider } from 'context/AuthContext';
import { Navigation } from './navigation';
import React from 'react';

const App: React.FC = () => {
  return (
    <AuthContextProvider>
      <Navigation />
    </AuthContextProvider>
  );
};

export default App;
