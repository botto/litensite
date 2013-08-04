var ArticleView = Backbone.View.extend({
  tagName: 'article',
  model: Article,

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  }

  render: function() {
  }
});
