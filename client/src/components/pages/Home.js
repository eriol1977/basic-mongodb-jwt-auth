import React, { useContext, useEffect } from 'react';
import AuthContext from '../../context/auth/authContext';

const Home = () => {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    authContext.loadUser();
    //eslint-disable-next-line
  }, []); // the square brackets means 'only when component loads'

  return (
    <div className='grid-2'>
      <h1>APP COMPONENTS HERE</h1>
    </div>
  );
};

export default Home;
