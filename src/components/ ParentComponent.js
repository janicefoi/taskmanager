// ParentComponent.js
import React, { useState } from 'react';
import Header from './Header';
import LoginPage from './LoginPage'; // Import your LoginPage component here
import ManagerDashboard from './ManagerDashboard'; // Import your ManagerDashboard component here
import EmployeeDashboard from './EmployeeDashboard'; // Import your EmployeeDashboard component here

const ParentComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Function to handle user login
  const handleLogin = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  // Function to handle user logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    localStorage.removeItem('userId');
  };

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} userEmail={userEmail} onLogout={handleLogout} />
      {/* Render different components based on login status */}
      {isLoggedIn ? (
        // If user is logged in, render the appropriate dashboard based on their role
        // Replace the conditions and components with your actual logic
        userEmail === 'manager@example.com' ? (
          <ManagerDashboard />
        ) : (
          <EmployeeDashboard />
        )
      ) : (
        // If user is not logged in, render the LoginPage component
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default ParentComponent;
