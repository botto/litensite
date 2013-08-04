var MarkDown = Backbone.Model.extend({
  defaults: {
    md: 'Markdown Here',
  },
  initialize: function(mdFile) {
    $.ajax(mdFile, {
      cache: false,
      dataType: "text"
    })
    .done(function(d, ts) {
      this.md = d;
    });
  }
});
