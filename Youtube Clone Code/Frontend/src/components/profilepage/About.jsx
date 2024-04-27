import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {storage} from '../../firebase';
import { v4 as uuidv4 } from 'uuid';

const About = () => {

  const userId = localStorage.getItem('userId');
  const id = useParams();


  const [userData, setUserData] = useState();
  const [videosCount, setVideosCount] = useState(0);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);


  useEffect(()=>{

    fetchUserData();

  }, [])

  const fetchUserData = async() =>{

    console.log(id['id']);

    await axios.get(`http://localhost:6001/fetch-user/${id['id']}`).then(
      (response)=>{
        setUserData(response.data);
        setTitle(response.data.username);
        setDescription(response.data.description);
      }
    ).catch((err)=>{

    })
  }


  // upload file

  const [isUploading, setIsUploading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState();



  const handleUpdate = async (e) =>{
    e.preventDefault();

    if(file === null){

      await axios.post('http://localhost:6001/update-user', {userId, title, description, ProfilePicUpdate: 'no', profilePic: ''}).then(
        (response)=>{
          alert('Data updated!!  changes will be reflected to the profiel in few minutes');
        } 
      ).catch((err)=>{
        alert('update failed!!');
      })
    }else{

        setIsUploading(true);
        const storageRef = ref(storage, uuidv4());
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed', 
        (snapshot) => {
            setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100); 
        }, 
        (error) => {
            console.log(error);
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
              try{

                console.log(downloadURL)
                await axios.post('http://localhost:6001/update-user', {userId, title, description, ProfilePicUpdate: 'yes', profilePic: downloadURL}).then(
                  (response)=>{

                    setIsUploading(false);
                    alert('Data updated!!  changes will be reflected to the profiel in few minutes');
                    
                  } 
                ).catch((err)=>{

                  alert('update failed!!');
                })
          
              }catch(err){
                  console.log(err);
              }
            });
        });

    }


}


  return (
    <div className="profile-about-container">

        <h3>Update Profile</h3>

        <div className="profile-about-body">

            <span>
              <div className="form-floating">
                <input type="text" className="form-control" id="floatingAboutTitle" placeholder="AboutTitle" onChange={(e)=> setTitle(e.target.value)} value={title} />
                <label htmlFor="floatingAboutTitle">Title</label>
              </div>
              <div >
                <input className="form-control form-control-md profile-file-input" type="file" onChange={(e)=> setFile(e.target.files[0])} />
              </div>
            </span>
            <div className="form-floating">
                <input type="text" className="form-control" id="floatingAboutDescription" placeholder="AboutDescription" onChange={(e)=> setDescription(e.target.value)} value={description} />
                <label htmlFor="floatingAboutDescription">Description</label>
            </div>
            {isUploading ?
              <button className='btn btn-outline-primary' disabled>Updating... {Math.round(uploadProgress)}%</button>
            :
              <button className='btn btn-outline-primary' onClick={handleUpdate}>Update</button>
            }

        </div>

    </div>
  )
}

export default About