"use strict";
(function($){
  var AppRouter = Backbone.Router.extend({
    routes: {
      "*actions": "defaultRoute",
    },
  });
  //Load in the nac async
  $.getJSON('/menu.json', function(d) {
    var nav = new NavCollection(d.menu);
    var navView = new NavView({model: nav});
    $('.wrapper--nav').html(navView.el);
  })

  //Get the router going
  var appRouter = new AppRouter();

  var IndexPage = Backbone.View.extend({
    initialize: function() {
      var indexMd = new MarkDown('/content/index.md');
      this.indexView = new MarkDownView({model: indexMd});
      this.listenTo(this.indexView, 'change', this.render());
      this.render();
    },
      render: function() {
        $('.wrapper--content').html(this.indexView.el);
      }
  });
  appRouter.on('route:defaultRoute', function() {
    new IndexPage();
  });
  Backbone.history.start();
}(jQuery));

