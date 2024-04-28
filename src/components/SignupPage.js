//SignupPage.js
import React, { useState } from 'react';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import { Typography, TextField, Button, Link, Grid, FormControl, InputLabel, Select, MenuItem, Paper, Box, CircularProgress } from '@mui/material';

const SignupPage = ({ onLogin, onRoleSelection, onError }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simple client-side validation
      if (!name || !email || !password || !confirmPassword) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // Send a POST request to the backend API to register the user
      const response = await fetch('http://localhost:5001/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (response.ok) {
        // If the signup request is successful, you can optionally handle the response
        const data = await response.json();
        console.log('User signed up successfully:', data);

        // For now, let's redirect to the employee dashboard after signup
        return <Navigate to="/" />;
      } else {
        // If the signup request fails, handle the error response
        const responseData = await response.json();
        setError(responseData.error || 'Failed to sign up');
      }
    } catch (error) {
      setError('An error occurred while signing up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" minHeight="100vh">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h4" gutterBottom>Sign Up</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Confirm Password" type="password" fullWidth value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
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
                <Button variant="contained" color="primary" fullWidth type="submit" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                </Button>
              </Grid>
              {error && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="error">{error}</Typography>
                </Grid>
              )}
            </Grid>
          </form>
          <Box mt={2}>
            <Typography>
              Already have an account? <Link component={RouterLink} to="/login">Login</Link>
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SignupPage;
