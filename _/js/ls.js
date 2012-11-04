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
            //Reuild the location of the index file, but only if ajax was sucesfull
            var md_files_loc = attr['source'].split('/');
            md_files_loc.pop();
            md_files_loc = md_files_loc.join(' ');
            $.each(mdmani.split('\n'), function (i, e) {
              if (e.length > 0) {
                handler('md_item')({
                  'source': [md_files_loc, '/', e, '.md'].join(''),
                  'target': attr['target']
                });
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
      $(['[data-type="',i,'"]'].join('')).click(function() {
        var e = $(this);
        handler(i)({
          'target': e.attr('data-target'),
          'source': e.attr('data-source') 
        });
      });
    });
    $('nav ol li a').first().click();
  });
})(window.jQuery);
