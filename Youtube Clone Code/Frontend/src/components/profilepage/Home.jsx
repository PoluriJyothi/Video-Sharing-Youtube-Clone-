import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const Home = () => {

  const [videos, setVideos] = useState([]);

  const id = useParams();
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
    <div className="home-container">



      <div className="home-videos-body">
        {videos.filter(video => video.userId === id['id']).length > 0 ?
        
            <h3>Recently Uploaded</h3>
        :
          <h3>No videos</h3>
        }

        <div className="home-videos">

          {
            videos.filter(video => video.userId === id['id']).sort((a,b)=> a.uploadTime - b.uploadTime).map((video)=>{
              return(
                <div className="home-video" key={video._id}>
                  <img src={video.thumbnail} alt="" onClick={()=> navigate(`/video/${video._id}`)} />
      
                  <div className="video-card-data">
                      <h4 onClick={()=> navigate(`/video/${video._id}`)}>{video.title.length > 30 ? video.title.slice(0,30) + '...' : video.title }</h4>
                      <span>
                        <p>{video.views} views</p>
                        <p>{video.likes.length} likes</p>
                        <p>{findUploadedTime(video.uploadTime)}</p>
                      </span>
                    </div>
                </div>
              )
            })
          }
          
        </div>

      </div>


      <div className="home-videos-body">
        {videos.filter(video => video.userId === id['id']).length > 0 ?
        
            <h3>Popular videos</h3>
        :
          ""
        }

        <div className="home-videos">

          {
            videos.filter(video => video.userId === id['id']).sort((a,b)=> b.views - a.views).map((video)=>{
              return(
                <div className="home-video" key={video._id}>
                  <img src={video.thumbnail} alt="" />
      
                  <div className="video-card-data">
                      <h4>{video.title.length > 30 ? video.title.slice(0,30) + '...' : video.title }</h4>
                      <span>
                        <p>{video.views} views</p>
                        <p>{video.likes.length} likes</p>
                        <p>{findUploadedTime(video.uploadTime)}</p>
                      </span>
                    </div>
                </div>
              )
            })
          }
          
        </div>
      </div>


    </div>
  )
}

export default Home