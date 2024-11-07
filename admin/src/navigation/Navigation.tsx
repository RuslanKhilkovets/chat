import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import privateRoutes from './privateRoutes';
import publicRoutes from './publicRoutes';
import Main from '../pages/Main';
import Login from '../pages/Login';
import { useContext } from 'react';
import { AuthContext } from '../context/Auth/AuthContext';

const Navigation = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {!!user
          ? privateRoutes.map(route => {
              return <Route path={route.to} Component={route.component} />;
            })
          : publicRoutes.map(route => {
              return <Route path={route.to} Component={route.component} />;
            })}
        <Route path="*" Component={!!user ? Main : Login} />;
      </Routes>
    </Router>
  );
};

export default Navigation;
