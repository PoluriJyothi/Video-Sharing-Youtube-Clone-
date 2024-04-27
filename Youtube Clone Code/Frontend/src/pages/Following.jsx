import '../styles/Following.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Following = () => {

  const [users, setUsers] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [userData, setUserData] = useState();

  const [activeFollowing, setActiveFollowing] = useState('all');

  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();


  useEffect(()=>{

    fetchUsers();
    fetchVideos();
    fetchUserData();

  }, [])

  const fetchVideos = async() =>{
    await axios.get('http://localhost:6001/fetch-videos').then(
      (response)=>{
        setAllVideos(response.data.reverse());
        setVideos(response.data.reverse());
      }
    )
  }

  const fetchUserData = async() =>{
    await axios.get(`http://localhost:6001/fetch-user/${userId}`).then(
      (response)=>{
        setUserData(response.data);
        console.log(response.data);
      }
    ).catch((err)=>{
    })
  }


  const fetchUsers = async() =>{
    await axios.get('http://localhost:6001/fetch-users').then(
      (response)=>{
        setUsers(response.data);
      }
    )
  }



  useEffect(()=>{
    if(userData){
      if(activeFollowing === 'all'){
        setVideos(allVideos.filter(video=> userData.following.includes(video.userId)));
      }else{
        setVideos(allVideos.filter(video=> video.userId === activeFollowing));
      }
    }

  }, [activeFollowing])



  const findUploadedTime = (uploadTime) =>{
    const time = new Date();
    const uploadedTime = new Date(uploadTime);
    if(time.getFullYear() === uploadedTime.getFullYear()){
      if(time.getMonth() === uploadedTime.getMonth()){
        if(time.getDate() === uploadedTime.getDate()){
          if(time.getHours() === uploadedTime.getHours()){
            if(time.getMinutes() === uploadedTime.getMinutes()){
                return (time.getSeconds() - uploadedTime.getSeconds()) + ' seconds ago';   
            }else{
              return (time.getMinutes() - uploadedTime.getMinutes()) + ' minutes ago';
            }
          }else{
            return (time.getHours() - uploadedTime.getHours()) + ' hours ago';
          }
        }else{
          return (time.getDate() - uploadedTime.getDate()) + ' days ago';
        }
      }else{
        return (time.getMonth() - uploadedTime.getMonth()) + ' months ago';
      }
    }else{
      return (time.getFullYear() - uploadedTime.getFullYear()) + ' years ago';
    }
}



  return (
    <div className="following-page">

      <div className="following-page-nav">

        <h3>Following pages</h3>
        <hr />
        
        <div className="following-nav-options">

            <div className={activeFollowing === 'all' ? "following-nav-option selected-nav-option" : "following-nav-option "} onClick={()=> setActiveFollowing('all')}  >
              <p>All Content</p>
            </div>
            {userData && users.filter(user=> userData.following.includes(user._id)).map((user)=>{
              return(

                <div className={activeFollowing === user._id ? "following-nav-option selected-nav-option" : "following-nav-option "} onClick={()=> setActiveFollowing(user._id)}  key={user._id}>
                  <span>
                    <img src={user.profilePic} alt="" />
                    <p>{user.username}</p>
                  </span>
                  <button onClick={()=> navigate(`/profile/${user._id}`)}>view profile</button>
                </div>
              )
            })}

            

        </div>
      </div>



      <div className="following-page-body">

        {userData && videos.filter(video=> userData.following.includes(video.userId)).map((video)=>{
          return(

            <div className="following-video-card" key={video._id}>
              <img className='following-card-thumbnail-image' src={video.thumbnail} alt="" onClick={()=> navigate(`/video/${video._id}`)} />
              <div className="following-card-data-body">
                <img src={video.userPic} alt="" onClick={()=> navigate(`/profile/${video.userId}`)} />
                <div className="following-card-data">
                  <h4 onClick={()=> navigate(`/video/${video._id}`)} >{video.title.length > 25 ? video.title.slice(0,25) + '...' : video.title }</h4>
                  <p onClick={()=> navigate(`/profile/${video.userId}`)}>{video.userName}</p>
                  <span>
                    <p>{video.views} views</p>
                    <p>{video.likes.length} likes</p>
                    <p>{findUploadedTime(video.uploadTime)}</p>
                  </span>
                </div>
              </div>
            </div>
          )
        })}


      </div>

    </div>
  )
}

export default Following