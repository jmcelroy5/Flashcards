var app = app || {};

// individual flashcard view
app.FlashcardView = Backbone.View.extend({
	tagName: 'div',
	className: 'flashcard',
	template: _.template($('#flashcard-template').html()),
	events: {
		'click .btn-edit': 'editCard'
	},
	initialize: function() {
		this.render();
	},
	render: function(){
		var html = this.template(this.model.toJSON());
		this.$el.html(html);
		return this;
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
		'click .btn-submit-edit': 'submitEdit',
		'click .btn-delete': 'deleteCard'
	},
	initialize: function(){
		this.render();
	},
	render: function(){
		var html = this.template();
		this.$el.html(html);
		this.$el.find(".edit-word").val(this.model.get("word"));
		this.$el.find(".edit-definition").val(this.model.get("definition"));
		return this;
	},
	deleteCard: function(){
		this.model.destroy();
		this.remove();
	},
	submitEdit: function(e){
		e.preventDefault();
		// get new values and save them to the model
		this.model.set("word", $(".edit-word").val());
		this.model.set("definition", $(".edit-definition").val());
		this.model.save();
		var flashcardView = new app.FlashcardView({model: this.model});
		this.$el.replaceWith(flashcardView.$el);
		this.remove();
	}
});

// view of all the flashcards in a set
app.FlashcardSetView = Backbone.View.extend({
	tagName: "div",
	className: "set",
	template: _.template($("#flashcard-set-template").html()),
	formTemplate: _.template($('#add-card-template').html()),
	events: {
		"click #btn-add": "addCard",
		"click #btn-study": "studyMode"
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
		// render template and append to dom
		this.$el.html(this.template());
		this.$el.appendTo("#wrapper");
		// render each flashcard subview in collection
		this.collection.each(function(flashcard){
			this.renderFlashcard(flashcard);
		}, this);
		// render card form subview
		var addCardForm = this.formTemplate();
		$("#add-new-card").html(addCardForm);
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

// TODO: flashcard decks

app.StudyModeView = Backbone.View.extend({
	tagName: "div",
	className: "study-mode",
	template: _.template($("#study-mode-template").html()),
	events: {
		"click #btn-thumbsup": "markRight",
		"click #btn-thumbsdown": "markWrong",
		"click #btn-flip": "showDefinition"
	},
	initialize: function() {
		this.render();
		// this.collection = new app.FlashcardSet();
		// this.collection.fetch({reset: true});

		this.collection.fetch();
		// initialize counters
		this.totalCards = this.collection.models.length;
		this.numRight = 0;
		this.numWrong = 0;
		this.card = -1;
		// show first word
		this.showWord();
	},
	render: function(){
		this.$el.html(this.template());
		this.$el.appendTo("#wrapper");
	},
	markRight: function(){
		this.numRight++;
		this.collection.remove(this.collection.models[this.card]);
		// this.card--;
		this.showWord();
	},
	markWrong: function(){
		console.log("markwrong called");
		this.numWrong++;
		this.showWord();
	},
	showWord: function(){
		console.log('show word called');
		if (!this.collection.length) this.showSummary();
		else {
			this.card++;
			if (this.card++ >= this.collection.length) this.card = 0;
			var word = this.collection.models[this.card].get("word");
			$(".word-def").text(word);
		}
	},
	showDefinition: function(){
		var card = this.collection.models[this.card];
		$(".word-def").text(card.get("definition"));
	},
	showSummary: function(){
		var summaryView = new app.StudySummaryView({
			correct: this.numRight,
			incorrect: this.numWrong
		});
		this.$el.replaceWith(summaryView.el);
	}
});

app.StudySummaryView = Backbone.View.extend({
	tagName: "div",
	className: "study-mode",
	template: _.template($("#study-summary-template").html()),
	initialize: function(options){
		var html = this.template(this.options);
		this.$el.html(html);
		return this;
	}
});

