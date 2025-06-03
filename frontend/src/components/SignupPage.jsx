import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './SignupPage.css';
// You'll likely need a CSS file for styling
// import './SignupPage.css';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!acceptTerms) {
      alert('You must accept the terms and conditions.');
      setLoading(false);
      return;
    }

    // Handle signup logic here
    console.log('Signing up with:', { username, email, password, acceptTerms });

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        username,
        email,
        password,
      });

      console.log('Signup successful!', response.data);

      // Optionally show a success message
      alert('Signup successful! Please log in.');

      // Redirect to login page after successful signup
      navigate('/login');

    } catch (error) {
      console.error('Signup error:', error);
      // Display error message to the user
      setError(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign up</h2>
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Name"
            required
            disabled={loading}
          />
        </div>
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
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              required
              disabled={loading}
            />
            I accept the terms & conditions
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign up'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <p>
        Already have an account? <Link to="/login">Log in here</Link>
      </p>
    </div>
  );
}

export default SignupPage; 