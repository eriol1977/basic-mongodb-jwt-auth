import React, { useContext } from 'react';
import AuthContext from '../../context/auth/authContext';
import { Route, Redirect } from 'react-router-dom';

// takes in a component and all the rest that is passed
const PrivateRoute = ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthContext);

  const { loading, isAuthenticated } = authContext;

  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated && !loading ? (
          <Redirect to='/login' />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;
