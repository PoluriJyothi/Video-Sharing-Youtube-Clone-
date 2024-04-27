import React, { useEffect, useState } from 'react'
import '../styles/Saved.css'
import {BiDotsVerticalRounded} from 'react-icons/bi'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Saved = () => {

  const [userData, setUserData] = useState();
  const [videos, setVideos] = useState([]);

  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();


  useEffect(()=>{

    fetchUserData();
    fetchVideos();

  }, [])

  const fetchUserData = async() =>{
    await axios.get(`http://localhost:6001/fetch-user/${userId}`).then(
      (response)=>{
        setUserData(response.data);
        console.log(response.data);
      }
    ).catch((err)=>{
    })
  }

  const fetchVideos = async() =>{
    await axios.get('http://localhost:6001/fetch-videos').then(
      (response)=>{
        setVideos(response.data.reverse());
      }
    )
  }

  const unSavePost = async(videoId) =>{
    await axios.post(`http://localhost:6001/unsave-post`, {videoId, userId}).then(
        (response)=>{
          alert('video unsaved');
          fetchVideos();
          fetchUserData();
        }
      )
  }

  const removeLike = async(videoId) =>{
    await axios.post(`http://localhost:6001/remove-like`, {videoId, userId}).then(
      (response)=>{
          alert('video unliked');
          fetchVideos();
      }
    )
  }


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
    <div className="saved-videos-page">

        {userData && videos.filter(video=> userData.savedPosts.includes(video._id)).length > 0 ?
            
            <h3>Saved videos</h3>
        :
          <h3>no Saved videos</h3>
        }

      <div className="saved-videos-body">

        {userData && videos.filter(video=> userData.savedPosts.includes(video._id)).map((video)=>{
          return(
            <div className="saved-video" key={video._id}>
              <img className='saved-video-thumbnail' src={video.thumbnail} alt="" />
              <div className="video-data">
                <img src={video.userPic} alt="" onClick={()=> navigate(`/profile/${video.userId}`)} />
                <div>
                  <h5 onClick={()=> navigate(`/video/${video._id}`)} >{video.title.length > 30 ? video.title.slice(0,30) + '...' : video.title }</h5>
                  <p onClick={()=> navigate(`/profile/${video.userId}`)}>{video.userName}</p>
                  <span>
                    <p>{video.views} views</p>
                    <p>{video.likes.length} likes</p>
                    <p>{findUploadedTime(video.uploadTime)}</p>
                  </span>
                </div>
                <div className="btn-group dropstart">
                  <BiDotsVerticalRounded className='video-menu-button' id="dropdownMenuOffset" data-bs-toggle="dropdown" aria-expanded="false" data-bs-offset="10,20" />
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuOffset">
                    <li><a className="dropdown-item" onClick={()=> unSavePost(video._id)} >Unsave</a></li>
                  </ul>
                </div>
              </div>
            </div>

          )
        })}



      </div>


        {userData && videos.filter(video=> video.likes.includes(userId)).length > 0 ?
            
            <h3>Liked videos</h3>
        :
          <h3>no Liked videos</h3>
        }

      <div className="saved-videos-body">

        {userData && videos.filter(video=> video.likes.includes(userId)).map((video)=>{
          return(
            <div className="saved-video" key={video._id}>
              <img className='saved-video-thumbnail' src={video.thumbnail} alt="" />
              <div className="video-data">
                <img src={video.userPic} alt="" onClick={()=> navigate(`/profile/${video.userId}`)} />
                <div>
                  <h5 onClick={()=> navigate(`/video/${video._id}`)} >{video.title.length > 30 ? video.title.slice(0,30) + '...' : video.title }</h5>
                  <p onClick={()=> navigate(`/profile/${video.userId}`)}>{video.userName}</p>
                  <span>
                    <p>{video.views} views</p>
                    <p>{video.likes.length} likes</p>
                    <p>{findUploadedTime(video.uploadTime)}</p>
                  </span>
                </div>
                <div className="btn-group dropstart">
                  <BiDotsVerticalRounded className='video-menu-button' id="dropdownMenuOffset" data-bs-toggle="dropdown" aria-expanded="false" data-bs-offset="10,20" />
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuOffset">
                    <li><a className="dropdown-item" onClick={()=> removeLike(video._id)}>Remove</a></li>
                  </ul>
                </div>
              </div>
            </div>

          )
        })}
      </div>



    </div>
  )
}

export default Saved