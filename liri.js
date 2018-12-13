var env = require("dotenv").config();
var keys = require("./keys");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

let secondArg = process.argv[2];
let thirdArg = "";

for (let i = 3; i < process.argv.length; i++) {

  if (i > 2 && i < process.argv.length) {

    thirdArg = thirdArg + "+" + process.argv[i];

  } else {

    thirdArg += process.argv[i];

  }
}

processInputCommand(secondArg, thirdArg);

function processInputCommand(secondArg, thirdArg){
	switch(secondArg) {
	    case 'my-tweets':
	        getTweets();
	        break;
	    case 'spotify-this-song':
	        getSpotify(thirdArg);
	        break;
	    case 'movie-this':
	        getOmdb(thirdArg);
	        break;  
	     case 'do-what-it-says':
	     	getFileData(); 
	     	break;  
	    default:
	        console.log("No input command!");
	        break;
	}
}

function getSpotify(song){

	song = song ? song : "Let it go";
	
	var spotify = new Spotify(keys.spotify);

	spotify.search(
		{ 
			type: 'track', 
			query: song
		}, function(err, data) {
	  			if (err) {
	    			return console.log('Error occurred: ' + err);
	 			 }

	 			log(data) ;
				var dataArr = data.tracks.items; 

				dataArr.forEach(function(element, index){
					console.log("Song name : " + element.name);
					console.log("Artists : " + JSON.stringify(element.artists[0].name));
					console.log("Preview URL : " + element.preview_url);
					console.log("Album : " + element.album.name);
					console.log("-----------------------------------");
				});
	});
}


function getTweets(){

	var client = new Twitter(keys.twitter);
 
	var params = {
			screen_name: 'Placeholder'
		};

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			tweets.forEach( function(element, index) {
				console.log( index+1 + ") You Tweeted - " + element.text);
				console.log("Date : " + element.created_at);
				console.log("-----------------------------------");
			});
			log(tweets) ;
		}
		else{
			console.log(error);
		}
	});

}

function getOmdb(movieName){

	movieName = movieName ? movieName : "Frozen"

	const queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
	console.log(queryUrl);

	request(queryUrl, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			let parsedBody = JSON.parse(body);
			console.log("-----------------------------------");
			console.log("Title : " + parsedBody.Title);
			console.log("Release Year: " + JSON.parse(body).Year);
			console.log("IMDB Rating : ", parsedBody.imdbRating);
			console.log("Rotten Tomatoes Rating : ", parsedBody.Ratings[1].Value);
			console.log("Country of Origin : ", parsedBody.Country);
			console.log("Language : ", parsedBody.Language);
			console.log("Plot : ", parsedBody.Plot);
			console.log("Actors : ", parsedBody.Actors);
			console.log("-----------------------------------");
						
		}

		log(body);
	});

}


function getFileData(){
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			return console.log(error);
		}

		console.log(data);
		const dataArr = data.split(",");

		processInputCommand(dataArr[0], dataArr[1]);

	});
}


function log(logData){
	fs.appendFile("log.txt", "\n***********************\n" + JSON.stringify(logData, null, 2) + "\n***********************\n", function(err) {

	  if (err) {
	    console.log(err);
	  } else {
	    console.log("Content Added to file log.txt!");
	  }

	});
}

