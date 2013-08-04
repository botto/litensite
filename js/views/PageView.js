var PageView = Backbone.View.extend({
  el: 'body',
  initialize: function(pageModel) {
    this.model = pageModel;
    this.render();
  },

  render: function() {
    _.each(this.model.get('pageEle'), function(i, pageEle) {
      console.log(pageEle);
    });
  }
});
