import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardActions, Typography, IconButton, Grid, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { MdPerson } from 'react-icons/md'; // Import icon for assigned employees

const ManagerDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
      } else {
        console.error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/users');
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

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        component={RouterLink}
        to="/add-task"
        sx={{ marginBottom: '20px', marginTop: '20px' }}
      >
        Add Task
      </Button>

      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: task.completed ? 'lightblue' : 'inherit' // Apply light blue background for completed tasks
              }}
            >
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {task.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {task.description}
                </Typography>
                <Divider sx={{ mt: 2, mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Assigned Employees:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {task.assignedEmployees.map((employeeId) => (
                    <IconButton key={employeeId}>
                      <MdPerson />
                      {users.find((user) => user._id === employeeId)?.name}
                    </IconButton>
                  ))}
                </Typography>
              </CardContent>
              <CardActions sx={{ marginTop: 'auto' }}>
                <Typography variant="body2" color="text.secondary">
                  Deadline: {new Date(task.deadline).toLocaleString()}
                </Typography>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ManagerDashboard;
