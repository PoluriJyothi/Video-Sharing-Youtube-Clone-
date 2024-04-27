import React, { useContext } from 'react'
import '../styles/Navbar.css'
import {BsSearch} from 'react-icons/bs';
import {MdOutlineSubscriptions, MdOutlineVideoLibrary} from 'react-icons/md'
import {AiOutlineVideoCameraAdd} from 'react-icons/ai'

import {useNavigate} from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext';

const Navbar = () => {

  const {isCreatPostOpen, setIsCreatePostOpen, searchText, setsearchText} = useContext(GeneralContext);

  const navigate = useNavigate();

  const profilePic = localStorage.getItem('profilePic');
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');





  return (
    <div className="navbar">
      <h3 onClick={()=>navigate('/')}>Smart Vidzz</h3>
      <div className="nav-content">
        <div className="searchbar">
          <input type="text" placeholder='Search videos...' onChange={(e)=> setsearchText(e.target.value)} />
          <BsSearch className='serachIcon' onClick={()=> { if(searchText!== ''){ navigate('/search')}}} />
        </div>

        {username? 
        
          <div className="nav-options">
            <AiOutlineVideoCameraAdd  className='nav-options-icon' onClick={()=> {setIsCreatePostOpen(!isCreatPostOpen); console.log(isCreatPostOpen)} }  data-bs-toggle="tooltip" data-bs-placement="bottom" title="Upload video"/>

            <MdOutlineSubscriptions onClick={()=>navigate('/following')} className='nav-options-icon' data-bs-toggle="tooltip" data-bs-placement="bottom" title="Following" />

            <MdOutlineVideoLibrary onClick={()=>navigate('/saved')} className='nav-options-icon' data-bs-toggle="tooltip" data-bs-placement="bottom" title="Saved videos"/>

            <img className='nav-profilePic' onClick={()=>navigate(`/profile/${userId}`)} src={profilePic} alt="" data-bs-toggle="tooltip" data-bs-placement="bottom" title={username} />
          </div>
        :
        
           <button onClick={()=>navigate('/authenticate')}>Sign In</button>

        }




      </div>
    </div>
  )
}

export default Navbar