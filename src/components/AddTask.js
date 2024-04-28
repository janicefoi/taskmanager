import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [deadline, setDeadline] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/users'); // Update API endpoint
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleAddTask = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, assignedEmployees, deadline }),
      });
      if (response.ok) {
        console.log('Task created successfully');
        navigate('/'); // Redirect to dashboard after adding task
      } else {
        console.error('Failed to create task');
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUserSelect = (event) => {
    setAssignedEmployees(event.target.value);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 4, bgcolor: 'background.paper', borderRadius: 4, boxShadow: 3 }}>
        <Typography variant="h4" align="center">Add Task</Typography>
        <form>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Assigned Employees</InputLabel>
            <Select
              multiple
              value={assignedEmployees}
              onChange={handleUserSelect}
              renderValue={(selected) => selected.map((userId) => users.find((user) => user._id === userId).name).join(', ')}
            >
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            type="datetime-local"
            label="Deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddTask}
            fullWidth
            sx={{ mt: 2 }}
          >
            Add Task
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AddTask;
