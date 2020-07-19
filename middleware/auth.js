const jwt = require('jsonwebtoken');
const config = require('config');

// middleware functions are always used to interact with request and response,
// and they provide a 'next' parameter to call the next piece of middleware;
// this function is used to protect routes
module.exports = function (req, res, next) {
  // get token from the header
  const token = req.header('x-auth-token'); // this is the key where the token MUST BE PUT inside the request header

  // check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // gets the payload
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    // assigns the user to the request, so that it's accessible in a protected route
    req.user = decoded.user;
    next(); // moves on to any other middleware
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
};
