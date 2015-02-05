var app = app || {};

app.FlashcardView = Backbone.View.extend({
	tagName: 'div',
	template: _.template($('#flashcard-template').html()),
	events: {
		'click .delete': 'deleteCard'
	},
	initialize: function() {
		console.log("New flashcard view initialized.");
	},
	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
	deleteCard: function(e){
		this.model.destroy();
		this.remove();
	}
});

app.FlashcardSetView = Backbone.View.extend({
	el: $('#flashcard-container'),	// grabs an existing DOM element
	tagName: "div",
	template: _.template($('#flashcard-set-template').html()),
	events: {
		'click .btn-add': 'addCard',
	},
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
		var addCardForm = this.template();
		this.$el.append(addCardForm);
	},
	renderFlashcard: function(flashcard){
		var flashcardView = new app.FlashcardView({model: flashcard});
		this.$el.append(flashcardView.render().el);
	},
	addCard: function(e){
		e.preventDefault();
		var flashcard = {};
		var formData = $("#add-card-form").serializeArray();
		formData.map(function(field){
			flashcard[field.name] = field.value;
		});
		this.collection.create(flashcard);
	}
});
