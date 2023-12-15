import React, { useState, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import LoginValidation from './LoginValidation';
import { auth } from './Firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import "./login.css";

function Login() {
    const [values, setValues] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();
    const emailRef = useRef(null); // Ref for email input field
    const passwordRef = useRef(null); // Ref for password input field

    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState(null);

    const tryAgain = () => {
        emailRef.current.value = ''; // Clear email field
        passwordRef.current.value = ''; // Clear password field
    }

    const handleInput = (event) => {
        setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(LoginValidation(values));
        if (values.email && values.password && !errors.email && !errors.password) {
            signInWithEmailAndPassword(auth, values.email, values.password)
                .then((userCredential) => {
                    console.log(userCredential);
                    navigate('/selection');
                })
                .catch((error) => {
                    console.log(error);
                    setLoginError("Login failed. Please check your credentials.");
                    tryAgain();
                });
        }
    }

    return (
        <div className='d-flex justify-content-center align-items-center vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h1>Login</h1>
                <form action="" onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='email'><strong>Email: </strong></label>
                        <input
                            type="email"
                            placeholder='Enter Email'
                            className='form-control rounded-0'
                            onChange={handleInput}
                            name="email"
                            autoComplete="off"
                            ref={emailRef} // Ref for email input field
                        />
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'><strong>Password: </strong></label>
                        <input
                            type="password"
                            placeholder='Enter Password'
                            className='form-control rounded-0'
                            onChange={handleInput}
                            name="password"
                            ref={passwordRef} // Ref for password input field
                        />
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                    </div>
                    {loginError && <span className='text-danger'>{loginError}</span>}
                    <button type="submit" className='btn btn-success w-100 rounded-0'>Login</button>
                    <p>You are agreeing to our terms and policies</p>
                    <Link to="/signup" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Create Account</Link>
                </form>
            </div>
        </div>
    )
}

export default Login;
