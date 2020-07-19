// This project should serve as a template to create NodeJS APIs with user authentication based on JWT and MongoDB.
// The MongoDB connection URL is provided in the default.json configuration file, along with the JWT secret.

// A new user can be registered with the POST http://localhost:4000/api/users route, providing user info in the following format:
// {
//   "name" : "Francesco Bertolino",
//   "email": "francesco.bertolino@gmail.com",
//   "password": "lonewolf"
// }
// where "email" is the unique username, and "password" will be saved in its encrypted form.
// Users are registered in the 'users' collection.

// Login happens through the POST http://localhost:4000/api/auth route, providing the following info:
// {
//   "email": "francesco.bertolino@gmail.com",
//   "password": "lonewolf"
// }

// The GET http://localhost:4000/api/auth route returns the logged in user's info in json format.

// The routes provided in test.js, together with the sample Test model, provide examples of how to execute CRUD actions
// protected by the authorization middleware (middleware/auth.js). Any "private" operation must provide the token returned by the
// login in the "x-auth-token" key in the request header, otherwise it won't be executed.

// The Basic MongoDB JWT Auth API.postman_collection.json file (in config), which can be imported in the Postman HTTP client,
// provides samples of all API requests.

const express = require('express');
const connectDB = require('./config/db');

const app = express();

// connect database
connectDB();

// init middleware
app.use(express.json({ extended: false })); // to access body data (not necessary anymore to require body-parser)

app.get('/', (req, res) =>
  res.json({ msg: 'Basic MongoDB API with JWT tokens' })
);

// define routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/test', require('./routes/test')); // sample CRUD routes

// in production, the first value will be used
const PORT = process.env.PORT || 4000;

// params: port and optional callback function
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
