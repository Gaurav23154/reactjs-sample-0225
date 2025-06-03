import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link (though not used in this component yet)
import axios from 'axios'; // Import axios
import './TaskBoardPage.css';
// You'll likely need CSS files for styling
// import './TaskBoardPage.css';

function TaskBoardPage() {
  const [tasks, setTasks] = useState([]);
  const [profileIconUrl, setProfileIconUrl] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loadingTasks, setLoadingTasks] = useState(false); // Loading state for fetching tasks
  const [addingTask, setAddingTask] = useState(false); // Loading state for adding task
  const [updatingTask, setUpdatingTask] = useState(false); // Loading state for updating task
  const [taskError, setTaskError] = useState(null); // Error state for task operations
  const [editingTask, setEditingTask] = useState(null); // State to hold the task being edited
  const [editedDescription, setEditedDescription] = useState(''); // State for edited description
  const [editedDueDate, setEditedDueDate] = useState(''); // State for edited due date
  const [editedIsReminderEnabled, setEditedIsReminderEnabled] = useState(false); // State for reminder enabled
  const [editedReminderDateTime, setEditedReminderDateTime] = useState(''); // State for reminder date/time
  const navigate = useNavigate(); // Initialize useNavigate

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; // Use environment variable

  // Function to fetch a random profile icon
  const fetchProfileIcon = async () => {
    const randomNumber = Math.floor(Math.random() * 1000);
    const apiUrl = `https://picsum.photos/id/${randomNumber}/info`;

    try {
      const response = await axios.get(apiUrl);
      // The API returns an object with various details, including the image URL
      setProfileIconUrl(response.data.download_url);
    } catch (error) {
      console.error('Error fetching profile icon:', error);
      // Set a default icon in case of error
      setProfileIconUrl('https://via.placeholder.com/50'); // Placeholder
    }
  };

  // Function to fetch tasks from the backend
  const fetchTasks = async () => {
    setLoadingTasks(true);
    setTaskError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      setLoadingTasks(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      } else {
         setTaskError('Failed to fetch tasks. Please try again.');
      }
    } finally {
      setLoadingTasks(false);
    }
  };

  // Fetch tasks and profile icon on component mount
  useEffect(() => {
    fetchTasks();
    fetchProfileIcon();
  }, []);

  // Function to add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
       setAddingTask(true);
       setTaskError(null);

      const token = localStorage.getItem('token');
      if (!token) {
         navigate('/login');
         setAddingTask(false);
         return;
      }

      try {
        await axios.post(`${API_URL}/tasks`, {
          title: newTaskTitle,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setNewTaskTitle('');
        fetchTasks();
      } catch (error) {
        console.error('Error adding task:', error);
        setTaskError('Failed to add task.');
         if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      } finally {
        setAddingTask(false);
      }
    }
  };

  // Function to toggle task completion
  const toggleTaskCompletion = async (id, currentStatus) => {
     setUpdatingTask(true);
     setTaskError(null);

     const token = localStorage.getItem('token');
      if (!token) {
         navigate('/login');
         setUpdatingTask(false);
         return;
      }
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

    try {
      await axios.put(`${API_URL}/tasks/${id}`, {
        status: newStatus,
      }, {
         headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      // No need to fetch all tasks again, can update state directly if needed
      fetchTasks(); // Refresh task list after updating
    } catch (error) {
      console.error('Error toggling task completion:', error);
      setTaskError('Failed to update task.');
       if (error.response && error.response.status === 401) {
          navigate('/login');
        }
    } finally {
      setUpdatingTask(false);
    }
  };

   // Function to handle task click for editing
  const handleTaskClick = (task) => {
    setEditingTask(task); // Set the task to be edited
    setEditedDescription(task.description || ''); // Initialize description state
    setEditedDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''); // Initialize due date state
    setEditedIsReminderEnabled(task.isReminderEnabled || false); // Initialize reminder enabled state
    setEditedReminderDateTime(task.reminderDateTime ? new Date(task.reminderDateTime).toISOString().slice(0, 16) : ''); // Initialize reminder date/time state
  };

  // Function to save the edited task
  const handleSaveTask = async () => {
    if (!editingTask) return;

    setUpdatingTask(true); // Use updating state for saving
    setTaskError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      setUpdatingTask(false);
      return;
    }

    try {
      const updatedTask = {
        title: editingTask.title, // Title is not edited in this form, keep original
        description: editedDescription,
        dueDate: editedDueDate || null, // Send null if no date is set
        status: editingTask.status, // Status is handled by checkbox, keep original
        isReminderEnabled: editedIsReminderEnabled,
        reminderDateTime: editedIsReminderEnabled && editedReminderDateTime ? new Date(editedReminderDateTime).toISOString() : null, // Send date only if reminder is enabled
      };

      await axios.put(`${API_URL}/tasks/${editingTask._id}`, updatedTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the task in the local state
      setTasks(tasks.map(task =>
        task._id === editingTask._id ? { ...task, ...updatedTask } : task
      ));

      setEditingTask(null); // Close the edit form
      setEditedDescription(''); // Clear description state
      setEditedDueDate(''); // Clear due date state
      setEditedIsReminderEnabled(false); // Clear reminder enabled state
      setEditedReminderDateTime(''); // Clear reminder date/time state

    } catch (error) {
      console.error('Error saving task:', error);
       setTaskError('Failed to save task.');
       if (error.response && error.response.status === 401) {
          navigate('/login');
        }
    } finally {
      setUpdatingTask(false);
    }
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingTask(null); // Close the edit form
    setEditedDescription(''); // Clear description state
    setEditedDueDate(''); // Clear due date state
    setEditedIsReminderEnabled(false); // Clear reminder enabled state
    setEditedReminderDateTime(''); // Clear reminder date/time state
    setTaskError(null); // Clear any errors
  };

  // Function to delete a task
  const handleDeleteTask = async (id) => {
     const token = localStorage.getItem('token');
      if (!token) {
         navigate('/login');
         return;
      }

      try {
         await axios.delete(`${API_URL}/tasks/${id}`, {
           headers: {
            Authorization: `Bearer ${token}`,
          },
         });
         fetchTasks(); // Refresh task list after deleting
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task.'); // Simple error handling
         if (error.response && error.response.status === 401) {
          navigate('/login'); // Redirect to login if unauthorized
        }
      }
  }

  return (
    <div className="task-board-container">
      <header className="header">
        <div className="logo">
          {/* Replace with your logo */}
          <h2>TasksBoard</h2>
        </div>
        <div className="user-profile">
          {profileIconUrl && (
            <img src={profileIconUrl} alt="User Profile Icon" className="profile-icon" />
          )}
          {/* You might want a dropdown or link here for user options */}
          {/* For now, a simple logout can be added */}
           <button onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
           }}>Logout</button>
        </div>
      </header>

      <div className="task-list-section">
        <div className="task-list-header">
          <h3>My Tasks</h3>
          <button onClick={() => console.log('More options')}>...</button>
        </div>

        <div className="add-task">
          <form onSubmit={handleAddTask}>
            <input
              type="text"
              placeholder={addingTask ? 'Adding task...' : 'Add a task'}
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              disabled={addingTask || !!editingTask} // Disable input while adding or editing
            />
            <button type="submit" disabled={addingTask || !!editingTask}> {/* Disable button while adding or editing */}
              {addingTask ? 'Adding...' : '+'}
            </button>
          </form>
           {taskError && <p className="error-message">{taskError}</p>}
        </div>

         {loadingTasks ? (
            <p>Loading tasks...</p>
         ) : (
           <div className="tasks">
              {tasks.length > 0 ? (
                tasks.map(task => (
                  <div
                    key={task._id}
                    className={`task ${task.status === 'completed' ? 'completed' : ''}`}
                    onClick={() => handleTaskClick(task)}
                  >
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleTaskCompletion(task._id, task.status);
                      }}
                      disabled={updatingTask}
                    />
                    <span>{task.title}</span>
                     {/* Add delete button */}
                    <button onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(task._id);
                      }} disabled={updatingTask}>Delete</button>
                  </div>
                ))
              ) : (
                <p>No tasks yet. Add one above!</p>
              )}
            </div>
         )}

        {/* Task Edit Form/Modal */}
        {editingTask && (
          <div className="edit-task-modal"> {/* Add CSS class for styling */}
            <div className="edit-task-content"> {/* Add CSS class for styling */}
              <h3>Edit Task</h3>
              <h4>{editingTask.title}</h4>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Add a description"
                />
              </div>

              <div className="form-group">
                 <label htmlFor="dueDate">Due Date</label>
                 <input
                   type="date"
                   id="dueDate"
                   value={editedDueDate}
                   onChange={(e) => setEditedDueDate(e.target.value)}
                 />
              </div>

               {/* Notification Settings */}
               <div className="form-group">
                 <label>
                   <input
                     type="checkbox"
                     checked={editedIsReminderEnabled}
                     onChange={(e) => setEditedIsReminderEnabled(e.target.checked)}
                   />
                   Enable Reminder
                 </label>
               </div>

               {editedIsReminderEnabled && (
                 <div className="form-group">
                    <label htmlFor="reminderDateTime">Reminder Date and Time</label>
                    <input
                      type="datetime-local"
                      id="reminderDateTime"
                      value={editedReminderDateTime}
                      onChange={(e) => setEditedReminderDateTime(e.target.value)}
                    />
                 </div>
               )}


              <div className="modal-actions">
                <button onClick={handleSaveTask} disabled={updatingTask}>
                  {updatingTask ? 'Saving...' : 'Save'}
                </button>
                <button onClick={handleCancelEdit} disabled={updatingTask}>Cancel</button>
              </div>
               {taskError && <p className="error-message">{taskError}</p>} {/* Display task error in modal */}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default TaskBoardPage; 