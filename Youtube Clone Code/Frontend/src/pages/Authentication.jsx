import React, { useEffect, useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import '../styles/Authenticate.css';
import { useNavigate } from 'react-router-dom';

const Authentication = () => {

  const [authType, setAuthType] = useState('login');



  return (
    <div className="authentication-page">

      {authType === 'login' ?
      
        <Login setAuthType={setAuthType} />
      :
        <Register setAuthType={setAuthType} />
      }


    </div>
  )
}

export default Authentication