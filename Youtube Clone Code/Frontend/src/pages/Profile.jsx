import React, { useContext, useEffect, useState } from 'react'
import '../styles/Profile.css'
import Home from '../components/profilePage/Home';
import Videos from '../components/profilePage/Videos';
import About from '../components/profilePage/About';
import { GeneralContext } from '../context/GeneralContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {


  const [navOption, setNavOption] = useState('Home');

  const {logout} = useContext(GeneralContext);

  const [userData, setUserData] = useState();
  const [videosCount, setVideosCount] = useState(0);

  const userId = localStorage.getItem('userId');
  const id = useParams();

  useEffect(()=>{

    fetchUserData();
    fetchVideosCount();

  }, [])

  const fetchUserData = async() =>{

    console.log(id['id']);

    await axios.get(`http://localhost:6001/fetch-user/${id['id']}`).then(
      (response)=>{
        setUserData(response.data);
        console.log(response.data);
      }
    ).catch((err)=>{

    })
  }

  // fetchVideosCount

  const fetchVideosCount = async() =>{
    await axios.get('http://localhost:6001/fetch-videos').then(
      (response)=>{
        setVideosCount( response.data.filter(video => video.userId === id['id']).length);
      }
    )
  }

  
  // follow user

  const followUser = async() =>{
    await axios.post('http://localhost:6001/follow-user', {userId, channelId: id['id']}).then(
      (response)=>{
        alert('Successfully started following!!');
        fetchUserData();
      }
    )
  }

  // unfollow user

  const unFollowUser = async() =>{
    await axios.post('http://localhost:6001/unfollow-user', {userId, channelId: id['id']}).then(
      (response)=>{
        alert('Successfully unfollowed!!');
        fetchUserData();
      }
    )
  }

  return (
    <div className="profilePage">

          <div className="profile-data-container">
            
            <div className="profile-data">

              <img className="profile-image" src={userData? userData.profilePic: ""} alt="" />
              <div className="profile-content">
                <h4>{userData? userData.username: ""}</h4>
                <span>
                  <h6>{userData? userData.followers.length: ""} Followers</h6>
                  <h6>{videosCount}  videos</h6>
                </span>
                <p className='profile-description'>{userData? userData.description: ""}</p>
              </div>
              {id['id'] === userId ?

                <button className="profile-btn profile-danger-btn" onClick={logout} >Logout</button>

              :
                <>
                  { userData && userData.followers.includes(userId) ?
                    <button className="profile-btn profile-danger-btn"  onClick={unFollowUser}>UnFollow</button>
                  :
                    <button className="profile-btn profile-primary-btn" onClick={followUser}>Follow</button>
                  }
                
                </>
              }


            </div>

          </div>

          <div className="profile-body-container">

            <div className="profile-body-nav">
              <ul>
                <li className={navOption === 'Home' ? 'selected-option' : ''} onClick={()=>setNavOption('Home') }>Home</li>
                <li className={navOption === 'Videos' ? 'selected-option' : ''} onClick={()=>setNavOption('Videos') }>All Videos</li>
                {userId === id['id'] ?
                <li className={navOption === 'About' ? 'selected-option' : ''} onClick={()=>setNavOption('About') }>About</li>
                :
                <></>
                }
              </ul>

              <hr />
            </div>

            {navOption === 'Home' ?
            
              <Home />

            :<>

              {navOption === 'Videos' ?
            
                <Videos />

              :<>

              {navOption === 'About' ?
            
                <About />

              :
                ""
              }
            
              </>
                
              }
            
            </>
            }

            

          </div>




    </div>
  )
}

export default Profile