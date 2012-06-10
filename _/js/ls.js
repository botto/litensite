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

$(document).ready(function() {
  var conv = new Showdown.converter();
  var article_list_file = "/articles.ls";

  $(function() {
    $.ajax({
      url: article_list_file,
      dataType: "text",
    }).done(function(data) {
      var articles_container = $(document.createElement("section"));
      
      $.each(data.split('\n'), function() {
        if (this.length > 0) {
          $.ajax({
            url: ["articles/", this.toString(), ".md"].join(''),
            dataType: "text"
          }).done(function(d){
            var article = $(document.createElement("article"));
            article.html(conv.makeHtml(d));
            articles_container.append(article);
          });
        }
      });
      $("#main").append(articles_container);
    })
  });

});
