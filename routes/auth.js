const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');

const User = require('../models/User');

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
// passing auth middleware to protect the route
router.get('/', auth, async (req, res) => {
  try {
    // gets the user without the password field
    // req.user was populated by the auth middleware, after verifying the token
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Auth user & get token
// @access  Public
router.post(
  '/',
  [
    // sets the express-validator checks
    body('email', 'Please include a valid email address').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    // executes the express-validator checks
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // checks the plain text password against the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // signs in
      const payload = {
        user: {
          id: user.id, // the only field necessary to access stuff belonging to this specific user
        },
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000, // in production should be 3600 => 1 hour
        },
        (err, token) => {
          // callback function
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
