import { AuthContextProvider } from './context/AuthContext';
import Navigation from './navigation/Navigation';

function App() {
  return (
    <AuthContextProvider>
      <Navigation />
    </AuthContextProvider>
  );
}

export default App;
