import React, { useContext, useEffect, useState } from 'react'
import { GeneralContext } from '../context/GeneralContext';
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {storage} from '../firebase.js';
import { v4 as uuidv4 } from 'uuid';

const Register = ({setAuthType}) => {


  const {register, setUsername, setEmail, setPassword, profilePic, setProfilePic} = useContext(GeneralContext);


  const [isUploading, setIsUploading] = useState(false);

  const [File, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState();

  const handlePostUplload = async (e) =>{
    e.preventDefault();
    setIsUploading(true);
    const storageRef = ref(storage, uuidv4());
    const uploadTask = uploadBytesResumable(storageRef, File);
    uploadTask.on('state_changed', 
    (snapshot) => {
        setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100); 
    }, 
    (error) => {
        console.log(error);
    }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
          try{
            await setProfilePic(downloadURL);
      
          }catch(err){
              console.log(err);
          }
        });
    });
}


// Here we call register function only after the uploaded image url is stored in state variable 

useEffect(()=>{

  if(isUploading){
    register();
  }

},[profilePic])



  return (
    <div className="auth-component">

      <h3>Sign Up</h3>

      <div className="form-floating mb-3">
        <input type="text" className="form-control" id="floatingInputauth1" placeholder='Username' onChange={(e)=> setUsername(e.target.value)} />
        <label htmlFor="floatingInputauth1">Username</label>
      </div>
      <div className="form-floating mb-3">
        <input type="email" className="form-control" id="floatingInputauth2" placeholder='Email' onChange={(e)=> setEmail(e.target.value)}  />
        <label htmlFor="floatingInputauth2">Email address</label>
      </div>
      <div className="form-floating mb-3">
        <input type="password" className="form-control" id="floatingInputauth3" placeholder='Password' onChange={(e)=> setPassword(e.target.value)}  />
        <label htmlFor="floatingInputauth3">Password</label>
      </div>
      <div className="mb-3 profilePicDiv">
        <label htmlFor="formFile" className="form-label">Upload profile Picture</label>
        <input className="form-control" type="file" id="formFile" onChange={(e)=> setFile(e.target.files[0])} />
      </div>


      {isUploading?

        <button className='btn btn-primary' disabled>uploading... {Math.round(uploadProgress)}%</button>

      :
      
      <button className='btn btn-primary' onClick={handlePostUplload} >Register</button>
      
      }

      <p>Already registered? <span onClick={()=> setAuthType('login')} >Login</span></p>
      
    </div>
  )
}

export default Register