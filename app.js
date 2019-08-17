
const axios = require('axios');

const omdbURL = "http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&apikey=trilogy"

axios.get(omdbURL)
   .then(function (response) {
      console.log("The movie's rating is: " + response.data.imdbRating);
   })
   .catch(function (err) {
      if (err.response) {
         console.log(err.response.status);
      } else if (err.request) {
         console.log(err.request);
      } else {
         // Something happened in setting up the request that triggered an Error
         console.log("Error", err.message);
      }
      console.log(err.config);
   });