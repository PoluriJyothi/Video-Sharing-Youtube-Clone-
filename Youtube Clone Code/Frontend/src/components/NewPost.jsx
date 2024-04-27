import React, { useContext, useState } from 'react'
import '../styles/NewPost.css'
import {RxCross2} from 'react-icons/rx' 
import axios from "axios";
import { GeneralContext } from '../context/GeneralContext';
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {storage} from '../firebase.js';
import { v4 as uuidv4 } from 'uuid';

const NewPost = () => {

    const {isCreatPostOpen, setIsCreatePostOpen} = useContext(GeneralContext);

    const [postTitle, setPostTitle] = useState('');
    const [postDescription, setPostDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
 
    const [uploadProgress, setUploadProgress] = useState();

    const [uploadingFile, setUploadingFile] = useState();


    const handlePostUplload = async (e) =>{
        e.preventDefault();
        
        const videoRef = ref(storage, uuidv4());
        const thumbnailRef = ref(storage, uuidv4());

        const uploadVideo = uploadBytesResumable(videoRef, videoFile);

        uploadVideo.on('state_changed', 
            (videoSnapshot) => {
                setUploadingFile('video');
                setUploadProgress((videoSnapshot.bytesTransferred / videoSnapshot.totalBytes) * 100); 
            }, 
            (error) => {
                console.log(error);
            }, 
            () => {
                getDownloadURL(uploadVideo.snapshot.ref).then( async (videoURL) => {
                console.log('File available at', videoURL);

                try{

                    const uploadThumbnail = uploadBytesResumable(thumbnailRef, thumbnailFile);

                    uploadThumbnail.on('state_changed', 
                        (thumbnailSnapshot) => {
                            setUploadingFile('thumbnail');
                            setUploadProgress((thumbnailSnapshot.bytesTransferred / thumbnailSnapshot.totalBytes) * 100); 
                        }, 
                        (error) => {
                            console.log(error);
                        }, 
                        () => {
                            getDownloadURL(uploadThumbnail.snapshot.ref).then( async (thumbnailURL) => {
                            console.log('File available at', thumbnailURL);

                            try{
                                const inputs = {userId: localStorage.getItem('userId'), userName: localStorage.getItem('username'), userPic: localStorage.getItem('profilePic'), video: videoURL, thumbnail: thumbnailURL, title: postTitle, description: postDescription, uploadTime: new Date()}
                                await axios.post('http://localhost:6001/createPost', inputs)
                                .then( async (res)=>{

                                    setPostDescription('');
                                    setPostTitle('');
                                    setVideoFile(null);
                                    setIsCreatePostOpen(false);
                                    setUploadProgress();
                                    setUploadingFile();
                                    
                                }).catch((err) =>{
                                    console.log(err);
                                });
                        
                            }catch(err){
                                console.log(err);
                            }
                            
                            });
                        }
                    );







                }catch(err){
                    console.log(err);
                }
                
                });
            }
        );


    }



    


  return (
    <>
        <div className="createPostModalBg" style={isCreatPostOpen? {display: 'contents'} : {display: 'none'}} >
            <div className="createPostContainer">
               
                <RxCross2 className='closeCreatePost' onClick={()=> setIsCreatePostOpen(false)} />
                <h2 className="createPostTitle">Upload new video</h2>
                <hr className="createPostHr" />
                
                <div className="createPostBody">
                    <form>

                        <div className="uploadBox">
                            <input type="file" name="videoFile" id="uploadPostFile" onChange={(e)=> setVideoFile(e.target.files[0])} />
                        </div>

                        <div className="uploadBox">
                            <input type="file" name="thumbnailFile" id="uploadthumbnailFile" onChange={(e)=> setThumbnailFile(e.target.files[0])} />
                        </div>
                        <div className="form-floating mb-3 descriptionInput">
                            <input type="text" className="form-control " id="floatingTitle" placeholder="Description" onChange={(e)=> setPostTitle(e.target.value)} value={postTitle}  /> 
                            <label htmlFor="floatingTitle">Title</label>
                        </div>
                        <div className="form-floating mb-3 descriptionInput">
                            <input type="text" className="form-control " id="floatingDescription" placeholder="Description" onChange={(e)=> setPostDescription(e.target.value)} value={postDescription}  /> 
                            <label htmlFor="floatingDescription">Description</label>
                        </div>

                        {uploadProgress ?
                            <>
                            {uploadingFile === 'video' ?

                                <button disabled>Uploading video ... {Math.round(uploadProgress)}%</button>
                            :
                            <>
                            {uploadingFile ===  'thumbnail' ?

                                <button disabled>Uploading thumbnail ... {Math.round(uploadProgress)}%</button>
                            :
                                ""
                            }
                            </>

                            }
                            </>
                        :
                            <button onClick={handlePostUplload}>Upload</button>
                        }

                    </form>
                </div>
            </div>
        </div>
    </>
  )
}

export default NewPost