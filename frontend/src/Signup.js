import React from 'react';
import { Link } from 'react-router-dom';

function Signup(){
return <><div className="d-flex justify-content-center align-items-center bg-primary vh-100">
<div className="bg-white p-3 rounded w-25">
    <h2>Sign-up</h2>
  <form action="">
  <div className="mb-3">
      <label htmlFor="name">Name</label>
      <input type="text" placeholder="Enter Name" className="form-control rounded-0"></input>
    </div>
    <div className="mb-3">
      <label htmlFor="email" >Email</label>
      <input type="email" placeholder="Enter Email" className="form-control rounded-0"></input>
    </div>
    <div className="mb-3">
      <label htmlFor="password">Password</label>
      <input type="password" placeholder="Enter Password" className="form-control rounded-0"></input>
    </div>
    <button className="btn btn-success w-100">Signup</button>
    <p>You are agree to our term and condition</p>
    <Link to="/login" className="btn btn-default border w-100">Login</Link>
  </form>
</div>
</div></>
}

export default Signup;