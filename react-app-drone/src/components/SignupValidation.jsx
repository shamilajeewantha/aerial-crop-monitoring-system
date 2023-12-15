import React from 'react'

function SignupValidation(values) {
    
    let errors = {}

    if (!values.name) {      
      errors.name = "Name is required"
    }
    else if (values.name.length < 3) {
      errors.name = "Name must be more than 3 characters"
    }
    else { errors.name = "" }


    if(!values.email){
      errors.email = "Email is required"
    }
    //   \S+  means one or more non-whitespace characters
    else if(!/\S+@\S+\.\S+/.test(values.email)){
      errors.email = "Email is invalid"
    }
    else {errors.email = ""}
  
  
    if(!values.password){
      errors.password = "Password is required"
    }
    else if(values.password.length < 6){
      errors.password = "Password must be more than 6 characters"
    }
    else {errors.password = ""}
  
  
    return errors; 
}

export default SignupValidation