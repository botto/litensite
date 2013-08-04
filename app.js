define(['require', 'exports', 'backbone', 'jquery', 'hogan'], function(require, exports, Backbone, jquery, hogan) {
  console.log(Backbone);
  var Routes = Backbone.Router.extend({
    routes: {
      "test":   "test"
    },

    test: function() {
      console.log('asd');
    }
  });
  return Routes;
});

