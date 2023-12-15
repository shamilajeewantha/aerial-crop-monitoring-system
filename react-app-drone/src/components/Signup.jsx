import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom'
import SignupValidation from './SignupValidation'
import {auth} from './Firebase'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import "./signup.css"

function Signup() {
    const[values, setValues] = useState({
        name:"",
        email:"",
        password:""
    })

    const navigate = useNavigate();

    const [errors, setErrors] = useState({})

    const handleInput = (event) => {
        setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
      }

  

    const handleSubmit = (event) =>{
        event.preventDefault();
        setErrors(SignupValidation(values))
        if(values.name && values.email && values.password && !errors.name && !errors.email && !errors.password){
            console.log("signup")
            createUserWithEmailAndPassword(auth, values.email, values.password)
            .then((userCredential) => {
                const user = userCredential.user;
                updateProfile(user, {
                    displayName: values.name
                  });                  
                console.log(userCredential);
                navigate('/selection');              
            })
            .catch((error) => {
                console.log(error)
            });





/*             axios.post('http://127.0.0.1:5000/signupst', values)
            .then(res => {
                console.log(res.data)
                alert('Signup successful')
            })
            .catch(err => console.log(err)) */
        }
    }



  return (
    <div className='d-flex justify-content-center align-items-center  vh-100'>
    <div className='bg-white p-3 rounded w-25'>   
        <h1>Sign up</h1>
        <form action="" onSubmit={handleSubmit}>
            <div className='mb-3'>
                <label htmlFor='name'><strong>Name: </strong></label>
                <input type="text" placeholder='Enter Name' name='name' onChange={handleInput} className='form-control rounded-0'/>
                {errors.name && <span className='text-danger'>{errors.name}</span>}
            </div>
            <div className='mb-3'>
                <label htmlFor='email'><strong>Email: </strong></label>
                <input type="email" placeholder='Enter Email' name='email' onChange={handleInput} className='form-control rounded-0'/>
                {errors.email && <span className='text-danger'>{errors.email}</span>}
            </div>
            <div className='mb-3'>
                <label htmlFor='password'><strong>Password: </strong></label>
                <input type="password" placeholder='Enter Password' name='password' onChange={handleInput} className='form-control rounded-0'/>
                {errors.password && <span className='text-danger'>{errors.password}</span>}
            </div>
            <button type ='submit' className='btn btn-success w-100 rounded-0' >Signup</button>  
            <p>You are agreeing to our terms and policies</p>
            <Link to ="/login" className='btn btn-default border w-100 bg-light rounded-0 text decoration-none' >Go to Login</Link>
        </form>
    </div>
</div>
  )
}

export default Signup