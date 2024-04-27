import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BiDotsVerticalRounded } from 'react-icons/bi'
import { useNavigate, useParams } from 'react-router-dom';

const Videos = () => {

  const [videos, setVideos] = useState([]);

  const id = useParams();
  const userId = localStorage.getItem('userId');

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


// delete video

const deleteVideo = async (videoId)=>{

  await axios.post('http://localhost:6001/delete-video', {videoId}).then(
    (response)=>{
      alert('video deleted!!');
      fetchVideos();
    }
  )
}


  return (
    <div className="videos-container">

          {videos.filter(video => video.userId === id['id']).length > 0 ?
              
            ""
          :
            <h3>No videos</h3>
          }

      {videos.filter(video => video.userId === id['id']).map((video)=>{
        return(

          <div className="video-card" key={video._id}>
              <img className='video-thumbnail-image' src={video.thumbnail} alt="" onClick={()=> navigate(`/video/${video._id}`)}  />
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <div className="video-card-data">
                      <h4 onClick={()=> navigate(`/video/${video._id}`)}>{video.title.length > 30 ? video.title.slice(0,30) + '...' : video.title }</h4>
                      <span>
                        <p>{video.views} views</p>
                        <p>{video.likes.length} likes</p>
                        <p>{findUploadedTime(video.uploadTime)}</p>
                      </span>
                  </div>
                  {id['id'] === userId ?
                      <div className="btn-group dropstart">
                        <BiDotsVerticalRounded style={{marginTop:'5px'}} id="dropdownMenuOffset" data-bs-toggle="dropdown" aria-expanded="false" data-bs-offset="10,20" />
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuOffset">
                          <li><a className="dropdown-item" onClick={()=> deleteVideo(video._id)}>Delete</a></li>
                        </ul>
                      </div>
                  :
                  <></>}
                </div>
          </div>

        )
      })}

    </div>
  )
}

export default Videos