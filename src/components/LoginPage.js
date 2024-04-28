//LoginPage.js
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Typography, TextField, Button, Link, Grid, FormControl, InputLabel, Select, MenuItem, Paper, Box } from '@mui/material';

const LoginPage = ({ onLogin, onRoleSelection }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      console.log('Logging in with email:', email);
      console.log('Password:', password);
      console.log('Role:', role);
      
      if (!email || !password || !role) {
        setLoginError('Email, password, and role are required');
        return;
      }
  
      const response = await fetch('http://localhost:5001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });
  
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const responseData = await response.json();
          console.log('User data:', responseData);
          
          // Extract the user ID directly from the response data
          const userId = responseData.userId; // Assuming responseData contains the user ID
          
          onLogin(responseData.email); // Pass the user's email to the onLogin function
          onRoleSelection(role);
          localStorage.setItem('role', role);
          localStorage.setItem('userId', userId); // Store user ID in localStorage
          console.log('Role and user ID stored in localStorage:', role, userId);
          navigate('/');
        } else {
          console.error('Error logging in:', 'Unexpected response from server');
          setLoginError('An unexpected error occurred while logging in');
        }
      } else {
        if (response.status === 401) {
          setLoginError('Invalid email, password, or role');
        } else {
          const errorText = await response.text();
          setLoginError(`Failed to login: ${errorText}`);
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setLoginError('An error occurred while logging in');
    }
  };     

  return (
    <Grid container justifyContent="center" alignItems="center" minHeight="100vh">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h4" gutterBottom>Login</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <MenuItem value="employee">Employee</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" fullWidth type="submit">
                  Login
                </Button>
              </Grid>
              {loginError && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="error">{loginError}</Typography>
                </Grid>
              )}
            </Grid>
          </form>
          <Box mt={2}>
            <Typography>
              Don't have an account? <Link component={RouterLink} to="/signup">Sign Up</Link>
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
