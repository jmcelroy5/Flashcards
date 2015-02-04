// SETUP
// ================================================
var application_root = __dirname;

// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var shortId = require('mongoose-shortid');

// create server
var app = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// where to serve static content
app.use( express.static( path.join( application_root, 'site')));

// set our port
var port = process.env.PORT || 8080;

// DATABASE
// ================================================

// connect to database
mongoose.connect( 'mongodb://localhost/flashcards' );

// database schema
var schema = new mongoose.Schema({
	_id: shortId,
	word: String,
	definition: String,
	difficulty: Number
});

// model
var Flashcard = mongoose.model('Flashcard', schema);

// ROUTES FOR OUR API
// ================================================
var router = express.Router();

// middleware to use for all requests
router.use(function(req, resp, next) {
	// this can be used for validations, errors, logging, etc
	console.log("Received a request!");
	next(); //send user to the next route
});

// test route
router.get('/', function(req,resp){
	resp.json({ message: 'the api is working!' });
});

// router.route() handles multiple routes for the same URI
// /flashcards handles all the HTTP requests that end in /flashcards
router.route('/flashcards')
	// create a bear (POST api/bears)
	.post(function(req, resp){

		var flashcard = new Flashcard({
			word: req.body.word,
			definition: req.body.definition,
			difficulty: req.body.difficulty
		});

		flashcard.save(function(err){
			if (err){
				resp.send(err);
			}
			resp.json({message: "Flashcard created"});
		});
	})
	// get all the flashcards (GET api/flashcards)
	.get(function(req, resp){
		return Flashcard.find(function(err, flashcards){
			if(err){
				resp.send(err);
			} 
			resp.json(flashcards);
		});
	});

// get, update, or delete a specific flashcard
router.route('/flashcards/:flashcard_id')
	.get(function(req, resp) {
		Flashcard.findById(req.params.flashcard_id, function(err, flashcard){
			if (err){
				resp.send(err);
			}
			resp.json(flashcard);
		});
	})
	.put(function(req, resp){
		Flashcard.findById(req.params.flashcard_id, function(err, flashcard){
			if (err){
				resp.send(err);
			}

			for (var key in req.body){
				flashcard[key] = req.body[key]; // ??
			}

			flashcard.save(function(err){
				if(err){
					resp.send(err);
				}
				resp.json({message: "Flashcard updated"});
			});
		});
	})
	.delete(function(req, resp){
		Flashcard.remove({
			"_id": req.params.flashcard_id
		}, function(err, flashcard){
			if(err){
				resp.send(err);
			}
			resp.json({message: "Flashcard deleted"});
		});
	});

// All routes will be prefixed with /api
app.use('/api', router)

// START THE SERVER
// ================================================
app.listen(port);
console.log('Magic happening on port ' + port);



