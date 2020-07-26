// PLEASE READ THE info.txt FILE!

const express = require('express');
const connectDB = require('./config/db');

const app = express();

// connect database
connectDB();

// init middleware
app.use(express.json({ extended: false })); // to access body data (not necessary anymore to require body-parser)

// define routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/test', require('./routes/test')); // sample CRUD routes

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  // for any path that is not one of those defined before, returns the index.html file
  // (which is placed in <<current dir>>/client/build)
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

// in production, the first value will be used
const PORT = process.env.PORT || 4000;

// params: port and optional callback function
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
