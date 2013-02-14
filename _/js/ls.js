(function($) {
  var currentClasses = {};
  var theme = (function(id) {
    var formatting_engines = {};
    var formatters = {
      'md_item': function (markdown) {
        //Check if we have instantiated the showdown engine before
        if (typeof formatting_engines['markdown'] != 'function') {
          formatting_engines['markdown'] = new Showdown.converter();
        }
        return formatting_engines['markdown'].makeHtml(markdown);
      },
      'link': function (vars) {
        var a = $(document.createElement('a'));
        a.append(document.createTextNode(vars['text']));
        //a.attr('href', vars['source']);
        a.attr('href', [vars['target'],',',vars['stype'], ',', vars['source']].join(''))
        a.click(function() {
          handler(vars['stype'])(vars);
        });

        return a;
      },
      'paragraph': function (t) {
        var p = $(document.createElement('p'));
        p.append(document.createTextNode(t));
        return p.get()[0].outerHTML;
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
        lsClassHandler(attr['target'], ['md-item-',attr['source']].join(''));
        $.ajax(attr['source'])
        .done(function(md) {
          $(attr['target']).html(theme('md_item')(md));
        });
      },
      'md_items': function(attr) {
        $.ajax(attr['source'])
          .done(function(files_list) {
            //Rebuild the location of the index file
            //Currently the list file and the markdown file have to be in the same dir
            var md_files_loc = attr['source'].split('/');
            md_files_loc.pop();
            md_files_loc = md_files_loc.join(' ');
            lsClassHandler('#main', ['md-items-', md_files_loc].join(''));

            var container;
            var entries = files_list.split('\n');
            for (var i=0; i<entries.length; i++) {
              if (entries[i].length > 0) {
                if (entries[i].charAt(0) == '%') {
                  if (container && typeof container == 'object') {
                    $(attr['target']).append(container);
                  }
                  container = $(document.createElement('div'));
                  var md_entry = entries[i].split('|');
                  container.append(theme('link')({
                    'target': '#main',
                    'stype': 'md_item',
                    'source': [md_files_loc,'/',md_entry[0].substring(1)].join(''),
                    'text': md_entry[1]}
                  ));
                }
                else {
                  container.append(theme('paragraph')(entries[i]));
                }
              }
            }
            $(attr['target']).append(container);
          });
      },
    }
    if (typeof(id) == 'undefined' || id.length <= 0) {
      return handlers;
    }
    else {
      return (handlers[id] ? handlers[id] : false);
    }
  });

  var lsClassHandler = (function(e, c) {
    c = c.replace(/\W/g, '-');
    if (currentClasses[e] && typeof currentClasses[e] === 'object' && currentClasses[e].length > 0) {
      for (var i=0; i<currentClasses[e].length; i++) {
        $(e).removeClass(currentClasses[e][i]);
      }
      currentClasses[e] = [];
    }
    else {
      currentClasses[e] = [];
    }
    $(e).addClass(c);
    currentClasses[e].push(c);
  });

  $(function() {
    
    $.each(handler(), function(i,e) {
      //Select the link item on the page
      a = $(['a[data-type="',i,'"]'].join(''));

      //Set the href so we can share this link easier
      //We will always be pointing to #main when using a link
      a.attr('href', [a.attr('data-target'),',',a.attr('data-type'), ',', a.attr('data-source')].join(''))

      //Assign the click action
      a.click(function() {
        var e = $(this);
        $(e.attr('data-target')).html(' ');
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
    if (location && typeof location === 'object' && typeof location.hash === 'string' && location.hash.length > 1) {  
      var d = location.hash.split(',');
      handler(d[1])({
        'target': d[0], 
        'source': d[2]
      });
    }
    else {
      $('nav ol li a').first().click();
    }
  });
})(window.jQuery);
