/*
TODO: 
read random from random.txt with fs.js
add exit option to menu
*/

require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const axios = require("axios");
const fs = require("fs");
const inquirer = require("inquirer");
const moment = require("moment");

var spotify = new Spotify(keys.spotify);

function displayPrompt() {
   inquirer
      .prompt([
         {
            type: "list",
            name: "type",
            message: "Select one of the following:",
            choices: [
               { name: "Spotify this (song)", value: "song" },
               { name: "Spotify this (band)", value: "band" },
               { name: "Movie this (title)", value: "movie" },
               { name: "Concert this (band)", value: "concert" }
            ]
         },
         {
            type: "input",
            name: "name",
            message: "Enter name: ",
            default: "I want it that way"
         }
      ])
      .then(function(input) {
         let type = input.type;
         let name = input.name;

         if (type === "movie") {
            getMovie(name);
         } else if (type === "song") {
            getSong(name);
         } else if (type === "band") {
            getArtist(name);
         } else if (type === "concert") {
            getConcerts(name);
         }
      })
      .catch(function(err) {
         console.log(err);
      });
}

function getRandom() {
   let random = "";
   fs.readFile("random.txt", "utf8", function(err, data) {
      let data = data.split(",");
      random = data[1];
      if (err) {
         return console.log(err);
      }
   });
}

function getMovie(name) {
   let apiKey = keys.apiKeys.omdbKey;
   console.log(apiKey);
   name = name.split(" ").join("%20");
   const URL = `http://www.omdbapi.com/?t=${name}&y=&plot=short&apikey=${apiKey}`;
   axios.get(URL).then(function(res) {
      console.log(`
         \n
         Title: ${res.data.Title}
         Year: ${res.data.Year}
         Rating: ${res.data.Rated}
         Release Date: ${res.data.Released}
         Genre: ${res.data.Genre}
         Runtime: ${res.data.Runtime}
         Directed by: ${res.data.Director}
         Written by: ${res.data.Writer}
         Cast: ${res.data.Actors}\n
         Plot: ${res.data.Plot}
         \n------------------------------------------------\n
      `);

      // render menu
      displayPrompt();
   });
}

function getSong(name) {
   let params = {
      type: "track",
      query: name,
      limit: 5
   };

   spotify.search(params, function(err, data) {
      if (err) {
         console.error(err);
      }

      for (let i = 0; i < data.tracks.items.length; i++) {
         console.log(`${i}-------------\n
            Artist: ${data.tracks.items[i].artists[0].name}
            Track Title: ${data.tracks.items[i].name}
            Album: ${data.tracks.items[i].album.name}
         `);
      }

      // render menu
      displayPrompt();
   });
}

function getArtist(name) {
   let params = {
      type: "artist",
      query: name,
      limit: 5
   };

   // Send request to Spotify
   spotify.search(params, function(err, data) {
      if (err) {
         console.error(err);
      }

      console.log(data);
      // loop through results, format, and display
      for (let i = 0; i < data.artists.items.length; i++) {
         console.log(`${i}-------------\n
            Artist: ${data.artists.items[i].name}
            genre: ${data.artists.items[i].genres}
            Listen on Spotify: ${data.artists.items[i].external_urls.spotify}
         `);
      }

      // render menu
      displayPrompt();
   });
}

// Receive and format information from "TheBandsInTown" API
function getConcerts(name) {
   let apiKey = keys.apiKeys.bitKey;
   console.log(apiKey);
   // format name for URL
   urlname = name.split("%20").join(" ");
   const URL = `https://rest.bandsintown.com/artists/${urlname}/events?app_id=${apiKey}`;

   // display a heading
   console.log(`\n--------Upcoming ${name} Concerts:--------\n`);

   // send request
   axios.get(URL).then(function(res) {
      //loop through returned concerts
      for (let i = 0; i < res.data.length; i++) {
         let date = moment(res.data[i].datetime).format("lll");
         console.log(date);
         console.log(`${date}
            Lineup: ${res.data[i].lineup}
            Location: ${res.data[i].venue.city}, ${res.data[i].venue.country}
            Venue: ${res.data[i].venue.name}
            \n------------------------------------------------\n`);
      }

      // render menu
      displayPrompt();
   });
}

// render menu
displayPrompt();
