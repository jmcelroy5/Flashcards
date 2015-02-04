var app = app || {};

app.FlashcardView = Backbone.View.extend({
	tagName: 'div',
	template: _.template($('#flashcard-template').html()),
	events: {},
	initialize: function() {
		// create a new dom element
		// this.$el = $(".flashcard");
		console.log("New flashcard view initialized.");
	},
	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

app.FlashcardSetView = Backbone.View.extend({
	el: $("#flashcard-container"),
	tagName: "div",
	initialize: function(){
		this.collection = new app.FlashcardSet();
		this.collection.fetch({reset: true});
		// render a new flashcard view when new card is added to collection
		this.listenTo( this.collection, 'add', this.renderFlashcard );
		// re-render whole collection view on collection fetch/reset
		this.listenTo( this.collection, 'reset', this.render );
	},
	render: function(){
		this.$el.empty();
		this.collection.each(function(flashcard){
			this.renderFlashcard(flashcard);
		}, this);
	},
	renderFlashcard: function(flashcard){
		var flashcardView = new app.FlashcardView({model: flashcard});
		this.$el.append(flashcardView.render().el);
	}
});