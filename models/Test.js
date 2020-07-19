// Sample model to test CRUD actions.
// Each object is owned by a specific user, whose id is inside the 'user' field

const mongoose = require('mongoose');

const TestSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // MongoDB id type
    ref: 'users', // collection we are referring to
  },
  field1: {
    type: String,
    required: true,
  },
  field2: {
    type: String,
    default: 'Default Value',
  },
  field3: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('test', TestSchema);
