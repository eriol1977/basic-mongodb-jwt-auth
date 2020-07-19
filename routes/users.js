const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/User');

// @route   POST api/users
// @desc    Register a user
// @access  Public
// uses '/' because the '/api/users' path is already specified in server.js, in app.use
router.post(
  '/',
  [
    // sets the express-validator checks
    body('name', 'Please add a name').not().isEmpty(),
    body('email', 'Please include a valid email address').isEmail(),
    body(
      'password',
      'Please enter a password with 8 or more characters'
    ).isLength({ min: 8 }),
  ],
  async (req, res) => {
    // executes the express-validator checks
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // checks if a user with same email already exists
      let user = await User.findOne({ email: email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // creates the object (not inserting into DB yet)
      user = new User({
        name,
        email,
        password,
      });

      // password encryption
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // saves the user object into the DB
      await user.save();

      // sends JWT token back to the front end, so that the newly registered user
      // is automatically logged in
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
