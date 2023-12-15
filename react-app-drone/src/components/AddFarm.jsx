import React from 'react';
import "./addfarm.css";

function AddFarm() {
  return (
    <div className='d-flex justify-content-center align-items-center bg-transparent p-3 rounded w-25'>   
        <h1>Sign up</h1>
        <form action="" >
            <div className='mb-3'>
                <label htmlFor='name'><strong>Name: </strong></label>
                <input type="text" placeholder='Enter Name' className='form-control rounded-0'/>
            </div>
        </form>
    </div>
  );
}

export default AddFarm;
