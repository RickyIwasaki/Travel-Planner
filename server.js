
const express = require('express');
const path = require('path');

const usersRoutes = require('./src/routes/users.js');

const app = express();

app.use(express.json());
app.set('views', path.join(__dirname, 'src', 'templates'));
app.use(express.static(path.join(__dirname, 'src', 'static')));
app.set('view engine', 'ejs');
app.use('/api/users', usersRoutes);

app.get('/', (request, response) => {
  response.json('hello');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = app;
