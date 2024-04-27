import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar'
import Home from './pages/Home';
import Profile from './pages/Profile'
import Following from './pages/Following'
import Saved from './pages/Saved'
import VideoPlayer from './pages/VideoPlayer';
import SearchPage from './pages/SearchPage';
import Authentication from './pages/Authentication';
import AuthProtector from './RouteProtectors/AuthProtector';
import LoginProtector from './RouteProtectors/LoginProtector';
import { useContext } from 'react';
import { GeneralContext } from './context/GeneralContext';
import NewPost from './components/NewPost';


function App() {

  const {isCreatPostOpen} = useContext(GeneralContext);

  return (
    <div className="App">



      <Navbar />
      
      {isCreatPostOpen ? 
        <NewPost />
      :
      
      <></>}

      <Routes>
        <Route exact path = '' element={<Home />} />
        <Route exact path = '/authenticate' element={<LoginProtector> <Authentication /> </LoginProtector>} />
        <Route path = '/profile/:id' element={<AuthProtector> <Profile /> </AuthProtector>} />
        <Route path = '/following' element={<AuthProtector><Following /> </AuthProtector>} />
        <Route path = '/saved' element={<AuthProtector><Saved /> </AuthProtector>} />
        <Route path = '/search' element={<SearchPage />} />
        <Route path = '/video/:id' element={<VideoPlayer />} />
      </Routes>

    </div>
  );
}

export default App;