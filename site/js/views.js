var app = app || {};

// individual flashcard view
app.FlashcardView = Backbone.View.extend({
	tagName: 'div',
	className: 'flashcard',
	template: _.template($('#flashcard-template').html()),
	events: {
		'click .btn-delete': 'deleteCard',
		'click .btn-edit': 'editCard'
	},
	initialize: function() {
		this.render();
	},
	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
	deleteCard: function(e){
		this.model.destroy();
		this.remove();
	},
	editCard: function(){
		var editView = new app.EditFlashcardView({model: this.model});
		this.$el.replaceWith(editView.el);
		this.remove();
	}
});

// individual flashcard view in edit mode
app.EditFlashcardView = Backbone.View.extend({
	tagName: "div",
	className: "flashcard",
	template: _.template($("#edit-flashcard-template").html()),
	events: {
		'click .btn-submit-edit': 'submitEdit'
	},
	initialize: function(){
		this.render();
	},
	render: function(){
		var html = this.template();
		this.$el.html(html);
		this.$el.find(".edit-word").val(this.model.get("word"));
		this.$el.find(".edit-definition").val(this.model.get("definition"));
	},
	submitEdit: function(e){
		e.preventDefault();
		var word = this.$el.find(".edit-word").val();
		var definition = this.$el.find(".edit-definition").val();
		this.model.set("word", word);
		this.model.set("definition", definition);
		this.model.save();
		var flashcardView = new app.FlashcardView({model: this.model});
		this.$el.replaceWith(flashcardView.$el);
		this.remove();
	}
});

// view of all the flashcards in a set
app.FlashcardSetView = Backbone.View.extend({
	template: _.template($("#flashcard-set-template").html()),
	formTemplate: _.template($('#add-card-template').html()),
	initialize: function(){
		this.collection = new app.FlashcardSet();
		this.collection.fetch({reset: true});
		// render a new flashcard view when new card is added to collection
		this.listenTo( this.collection, 'add', this.renderFlashcard );
		// re-render whole collection view on collection fetch/reset
		this.listenTo( this.collection, 'reset', this.render );
	},
	render: function(){
		// render template and append to dom
		var html = this.template();
		$("#wrapper").append(html);
		// render each flashcard subview in collection
		this.collection.each(function(flashcard){
			this.renderFlashcard(flashcard);
		}, this);
		// render card form subview
		var addCardForm = this.formTemplate();
		$("#add-new-card").html(addCardForm);
		// add event listeners 
		$("#btn-add").click(this.addCard.bind(this));
		$("#btn-study").click(this.studyMode.bind(this));
	},
	renderFlashcard: function(flashcard){
		var flashcardView = new app.FlashcardView({model: flashcard});
		$("#flashcards").append(flashcardView.render().el);
	},
	addCard: function(e){
		e.preventDefault();
		var flashcard = {};
		var formData = $("#add-card-form").serializeArray();
		formData.map(function(field){
			flashcard[field.name] = field.value;
		});
		this.collection.create(flashcard);
		$("#add-card-form input").val('');
	},
	studyMode: function(){
		new app.StudyModeView({collection: this.collection});
		this.remove();
	}
});

// TODO: flashcard set titles

// study mode ideas 
// - star the cards you want to study
// - instead of "next" button: "thumbs up", "flip", thumbs down"

// Fancy sidebar:
// Remaining
// Incorrect
// Correct

app.StudyModeView = Backbone.View.extend({
	template: _.template($("#study-mode-template").html()),
	initialize: function() {
		this.render();
		this.$el = $("#study-mode");
		this.currentCard = -1;
		this.totalCards = this.collection.models.length;
		this.showWord();
		// add event listeners
		$("#btn-thumbsup").click(this.markRight.bind(this));
		$("#btn-thumbsdown").click(this.markWrong.bind(this));
		$("#btn-flip").click(this.showDefinition.bind(this));
	},
	render: function(){
		$("#wrapper").empty();
		var html = this.template();
		$("#wrapper").append(html);
	},
	markRight: function(){
		// remove card from stack
		this.collection.remove(this.collection.models[this.currentCard]);
		this.currentCard--;
		this.showWord();
	},
	markWrong: function(){
		this.showWord();
	},
	showWord: function(){
		if (!this.collection.length){
			this.showSummary();
			return;
		}
		this.currentCard++;
		if (this.currentCard >= this.collection.length) {
			this.currentCard = 0;
		}
		var card = this.collection.models[this.currentCard];
		$(".word-def").text(card.get("word"));
	},
	showDefinition: function(){
		var card = this.collection.models[this.currentCard];
		$(".word-def").text(card.get("definition"));
	},
	showSummary: function(){
		$(".word-def").text("Nice job!");
		// summary template with # correct / incorrect
		this.$el.html("<p>Nice job!</p>");
	}
});

