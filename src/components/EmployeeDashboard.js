import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, CardActions, IconButton, Grid, Divider } from '@mui/material';
import { MdPerson, MdCheckCircle } from 'react-icons/md'; // Import icons for assigned employees and completion
import { styled } from '@mui/system'; 

const CompletedCard = styled(Card)({
  backgroundColor: 'lightblue',
});

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchTasksForUser();
    fetchUsers();
  }, []);

  const fetchTasksForUser = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:5001/api/tasks/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
      } else {
        console.error('Failed to fetch tasks for user');
      }
    } catch (error) {
      console.error('Failed to fetch tasks for user:', error);
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

  const handleTaskCompletion = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/tasks/${taskId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completedAt: new Date() }),
      });
      if (response.ok) {
        // Task marked as completed, update UI or fetch tasks again
        fetchTasksForUser();
      } else {
        console.error('Failed to mark task as completed');
      }
    } catch (error) {
      console.error('Error marking task as completed:', error);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task._id}>
            {task.completed ? (
              <CompletedCard>
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
                    {task.assignedEmployees.map((employeeId) => {
                      const assignedEmployee = users.find((user) => user._id === employeeId);
                      return (
                        <IconButton key={employeeId}>
                          <MdPerson />
                          {assignedEmployee ? assignedEmployee.name : 'Unknown'}
                        </IconButton>
                      );
                    })}
                  </Typography>
                </CardContent>
                <CardActions sx={{ marginTop: 'auto' }}>
                  <Typography variant="body2" color="text.secondary">
                    Deadline: {new Date(task.deadline).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed On: {new Date(task.completedAt).toLocaleString()}
                  </Typography>
                </CardActions>
              </CompletedCard>
            ) : (
              <Card onClick={() => handleTaskCompletion(task._id)}>
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
                    {task.assignedEmployees.map((employeeId) => {
                      const assignedEmployee = users.find((user) => user._id === employeeId);
                      return (
                        <IconButton key={employeeId}>
                          <MdPerson />
                          {assignedEmployee ? assignedEmployee.name : 'Unknown'}
                        </IconButton>
                      );
                    })}
                  </Typography>
                </CardContent>
                <CardActions sx={{ marginTop: 'auto' }}>
                  <Typography variant="body2" color="text.secondary">
                    Deadline: {new Date(task.deadline).toLocaleString()}
                  </Typography>
                  <IconButton>
                    <MdCheckCircle />
                  </IconButton>
                </CardActions>
              </Card>
            )}
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default EmployeeDashboard;
