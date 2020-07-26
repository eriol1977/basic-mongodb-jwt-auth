import axios from 'axios';

// sets the token as a default request headers field, using the key expected by the backend ('x-auth-token')
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
