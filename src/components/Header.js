import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { MdAccountCircle } from 'react-icons/md'; // Import user icon

const Header = ({ isLoggedIn, onLogout, userEmail }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          {/* You can add a menu icon if needed */}
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Task Manager
        </Typography>
        {isLoggedIn && (
          <>
            <Typography variant="body1" color="inherit" sx={{ mr: 2 }}>
              {userEmail}
            </Typography>
            <IconButton color="inherit">
              <MdAccountCircle />
            </IconButton>
            <Button color="inherit" onClick={onLogout}>
              Logout
            </Button>
          </>
        )}
        {!isLoggedIn && (
          <>
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
            <Button color="inherit" component={RouterLink} to="/signup">
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
