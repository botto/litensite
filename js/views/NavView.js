var NavView = Backbone.View.extend({
  tagName: 'section',
  className: 'nav-section',
  model: NavItem,

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },

  render: function() {
    //Make this avail inside the callback
    var thisMenuView = this;
    dust.render('Nav', {'nav_items': this.model.toJSON()}, function(err, out) {
      if (err) {
        console.log(err);
      }
      else {
        thisMenuView.$el.html(out);
      }
    });
    return this;
  }
});
