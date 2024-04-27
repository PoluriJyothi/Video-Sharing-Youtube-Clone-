import React, { useContext, useEffect, useState } from 'react'
import '../styles/SeachPage.css'
import { GeneralContext } from '../context/GeneralContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchPage = () => {

  const {searchText, setsearchText} = useContext(GeneralContext);

  const [videos, setVideos] = useState([]);


  const navigate = useNavigate();

  useEffect(()=>{
    fetchVideos();
  },[]);

  const fetchVideos = async() =>{

    await axios.get('http://localhost:6001/fetch-videos').then(
      (response)=>{
        setVideos(response.data.filter(video=> video.title.includes(searchText) || video.description.includes(searchText) || video.userName.includes(searchText)).reverse());
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

    <div className="search-page">
      <h3>Search result related to "{searchText ? searchText : ''}"</h3>
      <hr />

      <div className="search-videos-body">

            {videos.length > 0 ?
              
              ""
            :
              <h6>No related videos are found</h6>
            }

        {videos.map((video)=>{
          return(

            <div className="search-video" key={video._id}>
              <img className='search-video-thumbnail-image' src={video.thumbnail} alt="" />
              <div className="search-video-data-body">
                
                <div className="search-video-data">
                  <h4 onClick={()=> navigate(`/video/${video._id}`)}>{video.title.length > 80 ? video.title.slice(0,80) + '...' : video.title }</h4>
                  <p onClick={()=> navigate(`/video/${video._id}`)}>{video.description.length > 100 ? video.description.slice(0,100) + '...' : video.description }</p>
                  <span>
                    <p>{video.views} views</p>
                    <p>{video.likes.length} likes</p>
                    <p>{findUploadedTime(video.uploadTime)}</p>
                  </span>
                  <span onClick={()=> navigate(`/profile/${video.userId}`)}>
                    <img className='search-video-channel-image' src={video.userPic} alt="" />
                    <h5>{video.userName}</h5>
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

export default SearchPage