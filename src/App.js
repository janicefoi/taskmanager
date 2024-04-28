import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import EmployeeDashboard from './components/EmployeeDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import AddTask from './components/AddTask';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setIsLoggedIn(!!localStorage.getItem('token') || !!storedRole); // Check if either token or role is present
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setError('');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setError('');
  };

  const handleRoleSelection = (role) => {
    setUserRole(role);
    localStorage.setItem('role', role);
    setError('');
  };  

  const handleSignupError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <Router>
      <div>
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        {error && <div className="error">{error}</div>}
        <main>
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} onRoleSelection={handleRoleSelection} onError={setError} />} />
            <Route path="/signup" element={<SignupPage onLogin={handleLogin} onRoleSelection={handleRoleSelection} onError={handleSignupError} />} />
            <Route path="/" element={isLoggedIn ? <PrivateRoute userRole={userRole} /> : <Navigate to="/login" />} />
            <Route path="/add-task" element={<AddTask />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

const PrivateRoute = ({ userRole }) => {
  // Use userRole if available, otherwise fallback to localStorage role
  const role = userRole || localStorage.getItem('role');
  return role === 'manager' ? <ManagerDashboard /> : <EmployeeDashboard />;
};

export default App;
