import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import TaskBoardPage from './components/TaskBoardPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/taskboard" element={<TaskBoardPage />} />
      {/* Add a default route, e.g., redirecting to login */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
