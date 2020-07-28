import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import authReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from '../types';

const AuthState = (props) => {
  const initialState = {
    token: localStorage.getItem('token'), // default token loaded from the browser's local storage
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get('/api/auth');
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: AUTH_ERROR,
      });
    }
  };

  // Register user
  const register = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const res = await axios.post('/api/users', formData, config); // uses the 'proxy' value in package.json
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data, // the token
      });

      loadUser();
    } catch (err) {
      let errData = err.response.data.msg
        ? err.response.data.msg
        : err.response.data.errors[0].msg;
      dispatch({
        type: REGISTER_FAIL,
        payload: errData, // because the server sends back a json object with an array of errors
      });
    }
  };

  // Login user
  const login = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const res = await axios.post('/api/auth', formData, config); // uses the 'proxy' value in package.json
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data, // the token
      });

      loadUser();
    } catch (err) {
      let errData = err.response.data.msg
        ? err.response.data.msg
        : err.response.data.errors[0].msg;
      dispatch({
        type: LOGIN_FAIL,
        payload: errData,
      });
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  // Logout

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: CLEAR_ERRORS });
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        clearErrors,
        loadUser,
        login,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
