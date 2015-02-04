var app = app || {};

app.Flashcard = Backbone.Model.extend({
	defaults:{
		word: '',
		definition: '',
		difficulty: null
	},
	initialize: function(){
		console.log("New flashcard model initialized.");
	},
	parse: function(resp){
		resp.id = resp._id;
		return resp;
	}
});

app.FlashcardSet = Backbone.Collection.extend({
	model: app.Flashcard,
	url: '/api/flashcards'
});