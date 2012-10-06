// remap jQuery to $
(function($) {
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

  var show_md_item = function (target, md_item_loc) {
    $.ajax({
      url: md_item_loc,
      dataType: 'text',
      cache: false
    }).done(function(d) {
      var conv = new Showdown.converter();
      $(target).html(conv.makeHtml(d))
    });
  };
  
  var md_items = function(target, mditems_loc, mditems_list) {
    var conv = new Showdown.converter();
    var articles_container = $(document.createElement("section"));
    $.each(mditems_list, function() {
      if (this.length > 0) {
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
  
  
  var get_md_items = function(list_file) {
    var items = [];
    $.ajax({
      url: list_file,
      dataType: "text",
      cache: false,
      async: false
    }).done(function(d) {
      $.each(d.split('\n'), function(i, val) {
        items.push(val);
      });
    }).fail(function(jq, ts) {
      console.log(ts);
    });
    return items;
  };

  var show_pre_md_items = function(out_ele, data_loc, md_items_list) {
    var conv = new Showdown.converter();
    var md_items_container = $(document.createElement('section'));
    md_items_container.addClass('md-items');
    md_items_container.addClass(data_loc);
    $.each(md_items_list, function() {
      if (this.length > 0) {
       $.ajax({
          url: [data_loc, "/",this.toString(), "_pre.md"].join(''),
          dataType: "text",
          cache: false 
        }).done(function(d){
          var md_item = $(document.createElement("article"));
          md_item.html(conv.makeHtml(d));
          md_items_container.append(md_item);
        }).fail(function(jq, ts) {
          console.log(ts);
        });
      }
    });
    $(out_ele).html(md_items_container);
  };

  function md_item(jqcaller) {
    console.log(jqcaller);
  }

  $(function() {
    var nav_links = $('nav ol li a');
    nav_links.each(function(i, e) {
      var element = $(e);
      var main = $('#main');
      
      //main.filter('.visible').bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {
      
      element.click(function() {
        nav_links.removeClass('active');
        element.addClass('active');
        if (typeof(window[element.attr('data-type')] == 'function')) {
          window[element.attr('data-type')](element);
        }
        /*switch(element.attr('data-type')) {
          case 'md_item':
            show_md_item(main, element.attr('data-source'));
          break;
          case "md_items":
            show_pre_md_items(main, element.attr('data-loc'), get_md_items(element.attr('data-source')))
          break;
          case "html_page":
            html_page("#main", element);
          break;
        }*/
      });
    });
    nav_links.first().click();
  });

})(window.jQuery);
