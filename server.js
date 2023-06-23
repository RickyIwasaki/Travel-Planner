
const express = require('express');
// const axios = require('axios');

const userRoutes = require('./src/routes/users.js');

const app = express();

app.use(express.json());
app.use("/", userRoutes);

app.get('/', async (request, response) => {
  // const options = {
  //   method: 'GET',
  //   url: 'https://hotels4.p.rapidapi.com/locations/v3/search',
  //   params: {
  //     q: 'new york',
  //     locale: 'en_US',
  //     langid: '1033'
  //   },
  //   headers: {
  //     'X-RapidAPI-Key': '380da8de4fmsh170597fa07b968cp19a634jsne167b2d9fcfb',
  //     'X-RapidAPI-Host': 'hotels4.p.rapidapi.com'
  //   }
  // };

  // try {
  //   const response = await axios.request(options);
  //   console.log(response.data);
  // } catch (error) {
  //   console.error(error);
  // }
  response.send('Hello, World!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
