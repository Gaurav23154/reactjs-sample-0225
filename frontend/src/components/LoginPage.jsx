import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';
// You'll likely need a CSS file for styling
// import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    console.log('Logging in with:', { email, password, rememberMe });

    try {
      const response = await axios.post('https://reactjs-sample-0225-backend.onrender.com/api/auth/login', {
        email,
        password,
      });

      // Assuming the backend sends back a token on success
      const token = response.data.token;

      // Store the token (e.g., in local storage)
      localStorage.setItem('token', token);

      console.log('Login successful!', response.data);

      // Redirect to task board page
      navigate('/taskboard');

    } catch (error) {
      console.error('Login error:', error);
      // Display error message to the user
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Log in!</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            required
            disabled={loading}
          />
        </div>
        <div className="form-options">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
            />
            Remember me
          </label>
          <a href="#">Forgot Password?</a> {/* Replace with actual link */}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging In...' : 'Log in'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
}

export default LoginPage; 