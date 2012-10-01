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
    console.log([loc, "/", s.attr('data-source')].join(''));
    $.ajax({
      url: [loc, "/", s.attr('data-source')].join(''),
      dataType: "html",
      cache: false
    }).done(function(d) {
      $(target).html(d);
    });
  });
};

var md_items = function(target, mditems_loc, mditems_list) {
  var conv = new Showdown.converter();
  var articles_container = $(document.createElement("section"));
  $.each(mditems_list, function() {
    if (this.length > 0) {
     console.log([mditems_loc, "/",this.toString(), ".md"].join('')); 
     $.ajax({
        url: [mditems_loc, "/",this.toString(), ".md"].join(''),
        dataType: "text",
        cache: false 
      }).done(function(d){
        var article = $(document.createElement("article"));
        article.html(conv.makeHtml(d));
        articles_container.append(article);
      }).fail(function(jq, ts) {
        console.log(ts);
      });
    }
  });
  $(target).html(articles_container);
}; 


var get_mditems = function(list_file) {
  var list = [];
  $.ajax({
    url: list_file,
    dataType: "text",
    cache: false,
    async: false
  }).done(function(d) {
    $.each(d.split('\n'), function(i, val) {
      list.push(val);
    });
  }).fail(function(jq, ts) {
    console.log(ts);
  });
  return list;
};


$(document).ready(function() {
  var nav_links = $('nav ol li a');
  nav_links.each(function(i, e) {
    var element = $(e);
    element.click(function() {
      nav_links.removeClass('active');
      element.addClass('active');
      switch(element.attr('data-type')) {
        case "md_items":
          md_items($("#main"), element.attr('data-loc'), get_mditems(element.attr('data-source')));
        break;
        case "html_page":
          html_page("#main", element);
        break;
      }
    });
  });
  nav_links.first().click();
});
