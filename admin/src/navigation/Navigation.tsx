import { AuthContext, useAuth } from 'context/AuthContext';
import publicRoutes from 'navigation/publicRoutes';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const Navigation = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {user
          ? null
          : publicRoutes.map(route => {
              return <Route path={route.path} element={<route.component />} />;
            })}
      </Routes>
    </Router>
  );
};

export default Navigation;
