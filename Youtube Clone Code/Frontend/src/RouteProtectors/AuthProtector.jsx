import { useEffect } from 'react';

const AuthProtector =  ({ children }) => {

  useEffect(() => {

    if (!localStorage.getItem('username')) {
      window.location.href = '/authenticate';
    }
  }, [localStorage]);


  return children;
};

export default AuthProtector;