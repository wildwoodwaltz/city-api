'use strict';

//REQUIRE
//In servers we have require instead of import.
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();


//USE
//Once we have required something, we need to use it. This is where we aaasign the required field variable. REact does this with one step 'import'. Express takes 2 steps. 'require' and use'
const app = express();
app.use(cors());

//define port and vaildate .env
const PORT = process.env.PORT || 3002;

//ROUTES
//we will write endpoints here
//app.get coorrelates to axios.get it's very similar
app.get('/weather', async (request, response, next) => {
  try {
    let city = request.query.city;

    let url = (`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&country=US&key=${process.env.WEATHER_API_KEY}`);

    let cityWeather = await axios.get(url);

    console.log(cityWeather);

    let weatherDisplay = [];

    cityWeather.data.data.forEach(date => {

      let forecast = new Forecast(date);
      console.log(forecast);
      weatherDisplay.push(forecast);
    });

    response.send(weatherDisplay);

  } catch (error) {
    next(error);
  }
});

app.get('/movies', async (request, response, next) => {
  try {
    let city = request.query.city;

    let url = (`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${city}&total_results=3`);
    console.log(url);
    let cityMovie = await axios.get(url);

    console.log(cityMovie);

    let movieDisplay = [];

    cityMovie.data.results.forEach(title => {

      let movie = new Movie(title);
      console.log(movie);
      movieDisplay.push(movie);
    });

    response.send(movieDisplay);

  } catch (error) {
    next(error);
  }
});



app.get('*', (req, res) => {
  res.send('No such directory');
});

//ERRORS
//Handle Errors
app.use((error, request, response, next) => {
  if (error) {
    response.status(500).send(error.message);
  } else{
    next(error);
  }
});

// Classes
class Forecast {
  constructor(element) {
    this.date = element.datetime;
    this.description = element.weather.description;
  }
}
class Movie {
  constructor(element) {
    this.title = element.title;
    this.description = element.overview;
    this.language = element.original_language;
    this.tagline = element.tagline;
  }
}
//LISTEN
//Start the server
//Liten is a function that takes in a port value and callback.
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
