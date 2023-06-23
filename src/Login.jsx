import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    const checkUserLoggedIn = () => {
      const user = auth.currentUser;
      if (user) {
        setLoggedIn(true);
      }
    };

    checkUserLoggedIn();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoggedIn(true);
    } catch (error) {
      console.error(error);
      setError('Invalid email or password');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  if (isLoggedIn) {
    return <Navigate to="/Profile" />;
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form-container">
        <h1>Login</h1>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <div>
            <input
              type={passwordVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className="Visibility-button"
              type="button"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <IoMdEyeOff /> : <IoMdEye />}
            </button>
          </div>
        </div>
        <br />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
