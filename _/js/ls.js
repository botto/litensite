(function($) {
  var theme = (function(id) {
    var formatting_engines = {};
    var formatters = {
      'md_item': function (markdown) {
        //Check if we have instantiated the themeing engine before
        if (typeof formatting_engines['markdown'] != 'function') {
          formatting_engines['markdown'] = new Showdown.converter();
        }
        return formatting_engines['markdown'].makeHtml(markdown);
      },
    }
    if (typeof id == 'undefined' || id.length <= 0) {
      return formatters;
    }
    else {
      return (formatters[id] ? formatters[id] : false);
    }
  });
  
  var handler = (function(id) {
    var handlers = {
      'md_item': function(attr) {
        $.ajax(attr['source'])
          .done(function(md) {
            $(attr['target']).html(theme('md_item')(md));
          });
      },
      'md_items': function(attr) {
        $.ajax(attr['source'])
          .done(function(mdmani) {
            //Remove everything in the target
            $(attr['target']).html('');

            //Reuild the location of the index file
            var md_files_loc = attr['source'].split('/');
            md_files_loc.pop();
            md_files_loc = md_files_loc.join(' ');

            //Loop through each entry
            //@todo: more generic itterator so we can use custom theme functions
            $.each(mdmani.split('\n'), function (i, e) {
              if (e.length > 0) {
                var article = document.createElement('article');
                handler('md_item')({
                  'source': [md_files_loc, '/', e, '.md'].join(''),
                  'target': article,
                });
                $(attr['target']).append(article);
              }
            });
          });
      }
    }
    if (typeof(id) == 'undefined' || id.length <= 0) {
      return handlers;
    }
    else {
      return (handlers[id] ? handlers[id] : false);
    }
  });

  $(function() {
    
    $.each(handler(), function(i,e) {
      //Select the link item on the page
      a = $(['a[data-type="',i,'"]'].join(''));

      //Set the href so we can share this link easier
      //We will always be pointing to #main when using a link
      a.attr('href', ['#', a.attr('data-type'), ',', a.attr('data-source')].join(''))

      //Assign the click action
      a.click(function() {
        var e = $(this);
        $('nav li').removeClass('active');
        e.parent('li').addClass('active');
        handler(i)({
          'target': e.attr('data-target'),
          'source': e.attr('data-source') 
        });
      });
    });

    //Not most optimal method to get the URI for a page
    //A better approach to this will be needed
    if (typeof location === 'object' && typeof location.hash === 'string' && location.hash.length > 1) {  
      $(['a[href="', location.hash, '"]'].join('')).click();
    }
    else {
      $('nav ol li a').first().click();
    }
  });
})(window.jQuery);
