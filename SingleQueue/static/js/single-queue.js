/*created by: Elnaz Doostdar 1/19/2014*/
$(function () {
  //add search placeholder hack in ie9
  $(document).ajaxComplete(function () {
    if ($('html').hasClass('k-ie9')) {
      var searchQuery = $('iframe').contents().find('#search-query');
      searchQuery.val('Search').css('color', '#ccc');

      searchQuery
          .on(focus, function () {
            $(this).val('').css('color', '#000');
          })
          .on('blur', function () {
            $(this).val('Search').css('color', '#ccc');
          });
    }
  });

  //trigger search button click when enter
  $("#search-query").keypress(function (e) {
    if (e.which == 13) {
      //$('#search-container #search-btn').trigger('click');
      $('#top-search-btn').trigger('click');
    }
  });

  //filters click event
  var filterSubNavWrapper = $('#rq-filters .sub-nav-wrapper'),
      filterSubNav = filterSubNavWrapper.find('.sub-nav');

  $('#rq-filters').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    filterSubNav.toggle();
    $(this).toggleClass('add-bg');
    if ($('#rq-filters-item').hasClass('active-item-bg')) {
      $(this).removeClass('add-bg').find('.sub-nav-wrapper').css('marginLeft', '-6px');
    } else {
      $('.sub-nav-wrapper').css('marginLeft', '-11px');
    }
    if (filterSubNav.is(':visible')) {
      filterSubNavWrapper.css('height', '445px');
    } else {
      filterSubNavWrapper.css('height', '0');
    }
  });


  $('body').on('click', function () {
    $('#rq-filters').removeClass('add-bg');
  });

  //click state of bar icons
  var ribbonItem = $('.rq-top-ribbon > ul > li > ul > li');
  ribbonItem.on('click', function () {
    $(this).toggleClass('active-item-bg').end().removeClass('disable-hover');
    if ($(this).attr('id') == 'rq-filters-item') {
      $(this).find('#rq-filters').removeClass('add-bg');
    }
  });

  (ribbonItem.children(),filterSubNav, $('.rq-top-ribbon select')).on('click', function (e) {
    e.stopPropagation();
  });

  /*top nav state*/
  $('.has-subnav')
      .on('mouseover', function () {
        $(this).addClass('nav-active');
        $(this).children().find('.sub-nav-col').show();
      })
      .on('mouseout', function () {
        $(this).removeClass('nav-active');
        $(this).children().find('.sub-nav-col').hide();
      });

  //Initialize multiple select for ribbon area
  $('.rq-top-ribbon').find('select').each(function () {
    if ($(this).attr('multiple') == 'multiple') {
      var title = $(this).data('title');

      $(this).multipleSelect({
        placeholder: title,
        minimumCountSelected: 0,
        countSelected: title + '&nbsp;(#)',
        selectAllText: $(this).data('select-all-text'),
        allSelected: title,
        onClose: function () {
        },
        onOpen: function (elem) {
          var nextElem = $(elem).next(), ul = nextElem.find('ul');
          /*width/height fix imported from DSG*/
          if (ul.outerHeight() < ul.prop('scrollHeight') && !ul.data('width-fixed')) {
            ul.css('width', ul.outerWidth() + $.position.scrollbarWidth());
            ul.data('width-fixed', true);
          }

          //Check if dropdown needs to be reversed.
          nextElem.css('right', 'auto');

          if (nextElem.offset().left + nextElem.find('ul').outerWidth(true) > $('body').width()) {
            nextElem.css('right', 0);
          }
          else {
            nextElem.css('right', 'auto');
          }
        }
      });
      //$(this).multipleSelect("checkAll");
    }
  });
});

$(window).load(function () {
  //change image position based on browser for select
  if ($('.k-multiselect').length) {
    var arrow = $('.arrow');
    if ($.browser.chrome) {
      arrow.addClass('chrome');
    } else if ($.browser.mozilla && !$('html').hasClass('k-ie11')) {
      arrow.addClass('firefox');
    } else if ($('html').hasClass('ie9') || $('html').hasClass('k-ie9')) {
      arrow.addClass('ie9');
    } else if ($('html').hasClass('k-ie11')) {
      arrow.addClass('ie11');
    } else {
      arrow.addClass('safari');
    }
  }
  //ie9 placeholder plugin
  if ($('html').hasClass('k-ie9')) {
    $('input, textarea').placeholder();
  }
});
