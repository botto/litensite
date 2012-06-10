// remap jQuery to $
(function($){})(window.jQuery);


/* trigger when page is ready */
//$(document).ready(function (){

	// your functions go here

//});


/* optional triggers

   $(window).load(function() {

   });

   $(window).resize(function() {

   });

*/

var html_page = function(target, source) {
  $(function() {
    var s = $(source);
    var loc = s.attr('data-loc') || '.';
    $.ajax({
      url: [loc, "/", s.attr('data-source')].join(''),
      dataType: "html",
      cache: false
    }).done(function(d) {
      $(target).html(d);
    });
  });
};

var md_items = function(target, item_pointer) {
    var conv = new Showdown.converter();
    $(function() {
      $.ajax({
        url: $(item_pointer).attr('data-source'),
        dataType: "text",
        cache: false
      }).done(function(data) {
        var articles_container = $(document.createElement("section"));
        var loc = $(item_pointer).attr('data-loc');
        $.each(data.split('\n'), function() {
          if (this.length > 0) {
            $.ajax({
              url: [loc, "/",this.toString(), ".md"].join(''),
              dataType: "text",
              cache: false
            }).done(function(d){
              var article = $(document.createElement("article"));
              article.html(conv.makeHtml(d));
              articles_container.append(article);
            });
          }
        });
        $(target).html(articles_container);
      })
    });
};

$(document).ready(function() {
  $('nav ol li a').each(function(i, e) {
    var element = $(e);
    switch(element.attr('data-type')) {
      case "md_items":
        element.click(function() {
          md_items("#main", element);
        });
      break;
      case "html_page":
        element.click(function() {
          html_page("#main", element);
        });
      break;
    }
  });
});
