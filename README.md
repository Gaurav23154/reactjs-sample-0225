# Task Board Application

A full-stack task management application built with React.js and Node.js, featuring user authentication and real-time task management capabilities.

## Live Demo

Frontend: [https://reactjs-sample-0225-nine.vercel.app/](https://reactjs-sample-0225-nine.vercel.app/)
Backend: [https://reactjs-sample-0225-backend.onrender.com](https://reactjs-sample-0225-backend.onrender.com)

## Features

- 🔐 User Authentication
  - Secure login and signup functionality
  - JWT-based authentication
  - Protected routes

- 📝 Task Management
  - Create, read, update, and delete tasks
  - Mark tasks as complete/incomplete
  - Add task descriptions
  - Set due dates
  - Enable/disable reminders
  - Set reminder date and time

- 🎨 Modern UI/UX
  - Clean and intuitive interface
  - Responsive design
  - Loading states and error handling
  - User profile with random avatar

## Tech Stack

### Frontend
- React.js
- Vite
- React Router for navigation
- Axios for API requests
- CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

## Project Structure

```
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx       # Main application component
│   │   └── main.jsx      # Application entry point
│   └── package.json
│
└── backend/               # Node.js backend application
    ├── routes/           # API routes
    ├── models/          # Database models
    ├── middleware/      # Custom middleware
    └── index.js         # Server entry point
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```

## Deployment

### Frontend Deployment
The frontend is deployed on Vercel:
- Automatic deployments on Git push
- Environment variables configured in Vercel dashboard
- Build command: `npm run build`
- Output directory: `dist`

### Backend Deployment
The backend is deployed on Render:
- Automatic deployments on Git push
- Environment variables configured in Render dashboard
- Build command: `npm install`
- Start command: `npm start`

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register a new user
- POST `/api/auth/login` - Login user

### Tasks
- GET `/api/tasks` - Get all tasks
- POST `/api/tasks` - Create a new task
- PUT `/api/tasks/:id` - Update a task
- DELETE `/api/tasks/:id` - Delete a task

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 