import React, { useContext } from 'react'
import { GeneralContext } from '../context/GeneralContext';

const Login = ({setAuthType}) => {

  const {login, setEmail, setPassword} = useContext(GeneralContext);

  return (
    <div className="auth-component">

      <h3>Sign In</h3>

      <div className="form-floating mb-3">
        <input type="email" className="form-control" id="floatingInputauth4" placeholder='Email' onChange={(e)=> setEmail(e.target.value)} />
        <label htmlFor="floatingInputauth4">Email address</label>
      </div>
      <div className="form-floating mb-3">
        <input type="password" className="form-control" id="floatingInputauth5" placeholder='Password' onChange={(e)=> setPassword(e.target.value)} />
        <label htmlFor="floatingInputauth5">Password</label>
      </div>

      <button className='btn btn-primary' onClick={login}>Login</button>
      <p>Not registered? <span onClick={()=> setAuthType('register')} >Register</span></p>
      
    </div>
  )
}

export default Login