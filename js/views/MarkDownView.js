var MarkDownView = Backbone.View.extend({
  tagName: 'article',
  model: MarkDown,
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },
  render: function() {
    var mdConverter = new Showdown.converter();
    this.$el.html(mdConverter.makeHtml('#hello'));
  }
});
