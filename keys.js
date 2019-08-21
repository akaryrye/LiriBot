console.log(
   "Welcome to LIRI =D: Please select from the following.  Press Ctrl-C to exit."
);

exports.spotify = {
   id: process.env.SPOTIFY_ID,
   secret: process.env.SPOTIFY_SECRET
};

exports.apiKeys = {
   omdbKey: process.env.OMDB_KEY,
   bitKey: process.env.BIT_KEY
};
