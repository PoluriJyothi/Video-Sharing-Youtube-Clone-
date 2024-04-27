import React, { useEffect, useState } from 'react'
import '../styles/VideoPlayer.css'
import ReactPlayer from 'react-player'
import {IoMdHeart, IoMdHeartEmpty, IoMdShare} from 'react-icons/io'
import {MdOutlineLibraryAdd, MdOutlineSubtitles} from 'react-icons/md'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'


const VideoPlayer = () => {

  const [video, setVideo] = useState();

  const id = useParams();

  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  const [isLiked, setIsLiked] = useState(false);

  const navigate = useNavigate();

  useEffect(()=>{
      fetchVideo();
      addView();
    
  },[])

  useEffect(()=>{
    fetchVideo();
    addView();
  
},[id])

  const fetchVideo = async() =>{

    await axios.get(`http://localhost:6001/fetch-video/${id['id']}`).then(
      (response)=>{
        setVideo(response.data);

          // fetchFollowing(video.userId);
                

        if(response.data.likes.includes(userId)){
          setIsLiked(true);
        }else{
          setIsLiked(false);
        }
      }
    )
  }



  const addView = async() =>{
    await axios.get(`http://localhost:6001/add-view/${id['id']}`).then(
      (response)=>{
        setVideo(response.data);
      }
    )
  }

  const addLike = async() =>{
    await axios.post(`http://localhost:6001/add-like`, {videoId: id['id'], userId}).then(
      (response)=>{
        setIsLiked(true);
      }
    )
  }

  const removeLike = async() =>{
    await axios.post(`http://localhost:6001/remove-like`, {videoId: id['id'], userId}).then(
      (response)=>{
        setIsLiked(false);
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


const shareURL = async () => {
  try {
    await navigator.share({
      title: 'Share this video',
      text: 'Check out this awesome video!',
      url: window.location.href, // Replace with your actual URL
    });
  } catch (error) {
    console.error('Error sharing:', error);
  }
};


const savePost = async() =>{
  await axios.post(`http://localhost:6001/save-post`, {videoId: id['id'], userId}).then(
      (response)=>{
        alert('post saved');
      }
    )
}


const [comments, setComments] = useState([]);

useEffect(()=>{
  fetchComments();
},[])

const fetchComments = async() =>{
  await axios.post(`http://localhost:6001/fetch-comments`, {videoId: id['id']}).then(
      (response)=>{
        setComments(response.data.reverse());
      }
    )
}



const [newComment, setNewComment] = useState('');

const addComment = async() =>{
  await axios.post(`http://localhost:6001/add-comment`, {videoId: id['id'], comment: {username: username, comment: newComment}}).then(
      (response)=>{
        setNewComment('');
        fetchComments();
      }
    )
}



// Related videos

const [videos, setVideos] = useState([]);


useEffect(()=>{
  if(video){
    fetchRelatedVideos();
  }

}, [])

const fetchRelatedVideos = async() =>{
  await axios.get('http://localhost:6001/fetch-videos').then(
    (response)=>{
      setVideos(response.data.filter(thisVideo=> thisVideo.userId === video.userId && thisVideo._id !== video._id).reverse());
    }
  )
}










  return (
    <div className="videoPlayer-page">
      <div className="videoPlayer-body">

        
        <ReactPlayer className='videoplayer-video' url={video ? video.video : ''} controls />
        <div className="video-controls">
            {isLiked ?
              <IoMdHeart className='video-control-icons liked-icon' onClick={removeLike}  />
            :
              <IoMdHeartEmpty className='video-control-icons' onClick={addLike} />
            }
            <p>{video ? video.likes.length : ''} likes</p>

            <IoMdShare className='video-control-icons' onClick={shareURL} data-bs-toggle="tooltip" data-bs-placement="bottom" title="Share" />


            <MdOutlineLibraryAdd className='video-control-icons' onClick={savePost} data-bs-toggle="tooltip" data-bs-placement="bottom" title="Save" />
            <span>
              <p>{video ? video.views : ''} views</p>
              <p>uploaded {video ? findUploadedTime(video.uploadTime) : 'recently'}</p>
            </span>
        </div>
        <div className="videoPlayer-data">
          <h4>{video ? video.title : ''}</h4>
          <p>{video ? video.description : ''}</p>
          <div className="videoOwner-data">
            <img src={video ? video.userPic : ''} alt="" onClick={()=> navigate(`/profile/${video.userId}`)} />
            
            <h5 onClick={()=> navigate(`/profile/${video.userId}`)} >{video ? video.userName : ''}</h5>
            
            {/* {isFollowing ?
              <button className='owner-following-btn' onClick={()=>unFollowUser(video.userId)}>Unfollow</button>
            :
              <button className='owner-follow-btn' onClick={()=>followUser(video.userId)} >Follow</button>
            } */}
          </div>
        </div>

        <div className="comments-container">
          <h4>Comments</h4>
          <div className="comments-body">
            
            {comments.length > 0 && comments.map((comment)=>{
              return(

                <div className="comment" key={comment.username+comment.comment}>
                  <span>
                    <h5>{comment.username}</h5>
                    <p>{comment.comment}</p>
                  </span>
                </div>
              )
            })}            


          </div>
          <div className="add-comment">
            <input type="text" placeholder='type something...' onChange={(e)=> setNewComment(e.target.value)} value={newComment}/>
            <button onClick={addComment}>Post</button>
          </div>
        </div>

      </div>




      <div className="related-videos-container">

        <h4>Related videos</h4>
        <div className="related-videos">

          {videos && videos.map((video)=>{
            return(

              <div className="related-video">
                  <img className='related-video-thumbnail-image' src={video.thumbnail} alt="" onClick={()=> navigate(`/video/${video._id}`) } />
                  <div className="related-video-data">
                    <h4 onClick={()=> navigate(`/video/${video._id}`)} >{video.title.length > 25 ? video.title.slice(0,25) + '...' : video.title }</h4>
                    <p onClick={()=> navigate(`/video/${video._id}`)} >{video.description.length > 40 ? video.description.slice(0,40) + '...' : video.description }</p>
                    <h6 onClick={()=> navigate(`/profile/${video.userId}`)}>{video.userName}</h6>
                    <span>
                      <p>32k views</p>
                      <p>uploaded 5 days ago</p>
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

export default VideoPlayer