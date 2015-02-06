var app = app || {};

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
	}
});

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
		this.model.set("word",word);
		this.model.set("definition",definition);
		this.model.save();
		var flashcardView = new app.FlashcardView({model: this.model});
		this.$el.replaceWith(flashcardView.$el);
	}
});

app.FlashcardSetView = Backbone.View.extend({
	el: $("#wrapper"),
	formTemplate: _.template($('#add-card-template').html()),
	events: {
		'click #btn-add': 'addCard',
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
		this.collection.each(function(flashcard){
			this.renderFlashcard(flashcard);
		}, this);
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
	}
});
