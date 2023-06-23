import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { auth, firestore } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import "./SignUp.css";



function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUpComplete, setSignUpComplete] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // Store additional user information in Firestore
      await setDoc(doc(collection(firestore, 'users'), user.uid), {
        fullName,
        email,
      });

      setSignUpComplete(true);
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again.'); // Generic error message for other errors
    }
  };

  if (isSignUpComplete) {
    return <Navigate to="/login" />;
  }

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <div className="container">
      <form onSubmit={handleSubmit} className="form-container">
        <h1>SignUp</h1>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
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
            <button className='Visiblity-button' type="button" onClick={togglePasswordVisibility}>
              {passwordVisible ? <IoMdEyeOff /> : <IoMdEye />}
            </button>
          </div>
        </div>
        <div>
          <label>Confirm Password:</label>
          <div>
            <input
              type={passwordVisible ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button className='Visiblity-button' type="button" onClick={togglePasswordVisibility}>
                {passwordVisible ? <IoMdEyeOff /> : <IoMdEye />}
            </button>
          </div>
        </div>
        <br/>
        {error && <p className="error">{error}</p>}
        <button type="submit">Sign Up</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
      </div>
    </>
  );
}

export default SignUp;
