import React, { createContext, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const GeneralContext = createContext();

const GeneralContextProvider = ({children}) => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState('');

  const [searchText, setsearchText] = useState('');

  const [isCreatPostOpen, setIsCreatePostOpen] = useState(false);


  const navigate = useNavigate();

  const login = async () =>{

    try{

        await axios.post('http://localhost:6001/login', {email, password})
        .then( async (res)=>{

            console.log(res);
            
            localStorage.setItem('userId', res.data._id);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('email', res.data.email);
            localStorage.setItem('profilePic', res.data.profilePic);

            navigate('/');

        }).catch((err) =>{
            console.log(err);
        });

    }catch(err){
        console.log(err);
    }
  }

  const register = async () =>{

    try{
        await axios.post('http://localhost:6001/register', {username, email, password, profilePic})
        .then( async (res)=>{
            localStorage.setItem('userId', res.data._id);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('email', res.data.email);
            localStorage.setItem('profilePic', res.data.profilePic);

            navigate('/');


        }).catch((err) =>{
            console.log(err);
            alert("Regsitration failed!!");
        });


    }catch(err){
        console.log(err);
    }
  }



  const logout = async () =>{
    
    localStorage.clear();
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorage.removeItem(key);
      }
    }
    
    navigate('/');
  }



  return (
    <GeneralContext.Provider value={{login, register, logout, username, setUsername, email, setEmail, password, setPassword, profilePic, setProfilePic, isCreatPostOpen, setIsCreatePostOpen, searchText, setsearchText}} >{children}</GeneralContext.Provider>
  )
}

export default GeneralContextProvider