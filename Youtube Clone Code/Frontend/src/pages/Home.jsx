import React, { useEffect, useState } from 'react'
import '../styles/Home.css'
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

const Home = () => {

  const [videos, setVideos] = useState([]);

  const navigate = useNavigate();

  useEffect(()=>{
    fetchVideos();
  },[]);

  const fetchVideos = async() =>{

    await axios.get('http://localhost:6001/fetch-videos').then(
      (response)=>{
        setVideos(response.data.reverse());
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
    <div className="homepage">
      <div className="home-videos-container">

        {videos.map((video)=>{
          return(

            <div className="home-video-card" key={video._id}>
              <img className='home-card-thumbnail-image' src={video.thumbnail} alt="" onClick={()=> navigate(`/video/${video._id}`)} />
              <div className="home-card-data-body">
                <img src={video.userPic} alt="" onClick={()=> navigate(`/profile/${video.userId}`)} />
                <div className="home-card-data">
                  <h4 onClick={()=> navigate(`/video/${video._id}`)} >{video.title.length > 30 ? video.title.slice(0,30) + '...' : video.title }</h4>
                  <p onClick={()=> navigate(`/profile/${video.userId}`)}>{video.userName}</p>
                  <span>
                    <p>{video.views} views</p>
                    <p>{findUploadedTime(video.uploadTime)}</p>
                  </span>
                </div>
              </div>
            </div>
          )
          })

        }




      </div>
    </div>
  )
}

export default Home