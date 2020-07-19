// Test route with sample CRUD actions

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const User = require('../models/User');
const Test = require('../models/Test');

// @route   GET api/test
// @desc    Get all user test objects
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // req.user was populated by the auth middleware, after verifying the token
    const testObj = await Test.find({ user: req.user.id }).sort({
      date: -1, // objects sorted by descending dates
    });
    res.json(testObj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/test
// @desc    Add new test object
// @access  Private
// use [] for multiple middlewares
router.post(
  '/',
  [auth, [body('field1', 'Field 1 is required').not().isEmpty()]],
  async (req, res) => {
    // executes the express-validator checks
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { field1, field2, field3 } = req.body;

    try {
      const newTestObj = new Test({
        field1,
        field2,
        field3,
        user: req.user.id,
      });

      const testObj = await newTestObj.save();
      res.json(testObj);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/test/:id
// @desc    Update test object
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { field1, field2, field3 } = req.body;

  // build test object
  const testObjFields = {};
  if (field1) testObjFields.field1 = field1;
  if (field2) testObjFields.field2 = field2;
  if (field3) testObjFields.field3 = field3;

  try {
    let testObj = await Test.findById(req.params.id);
    if (!testObj) return res.status(404).json({ msg: 'Object not found' });

    // make sure user owns object
    if (testObj.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    testObj = await Test.findByIdAndUpdate(
      req.params.id,
      { $set: testObjFields }, // sets the testObjFields properties
      { new: true } // if the object isn't found, create a new one
    );

    res.json(testObj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/test/:id
// @desc    Delete test object
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let testObj = await Test.findById(req.params.id);
    if (!testObj) return res.status(404).json({ msg: 'Object not found' });

    // make sure user owns object
    if (testObj.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Test.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Object removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
