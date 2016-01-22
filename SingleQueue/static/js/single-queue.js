﻿/*created by: Elnaz Doostdar 1/19/2014*/
$(function () {
  var filterFlag = false; // this is to keep filter open when user clicks anywhere in the sub-nav area

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
      $('#search-container #search-btn').trigger('click');
    }
  });

  //filters click event
  var filterSubNavWrapper = $('#rq-filters .sub-nav-wrapper'),
      filterSubNav = filterSubNavWrapper.find('.sub-nav');

  $('#rq-filters').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    //only trigger when user clicks on the filters icon
    if (!filterFlag || $(e.target).attr('id') == 'filters-icon' || $(e.target).attr('id') == 'filters-wrapper') {
      filterSubNav.toggle();
      $(this).toggleClass('add-bg');
      if (filterSubNav.is(':visible')) {
        filterSubNavWrapper.css('height', '445px');
      } else {
        filterSubNavWrapper.css('height', '0');
      }
    }
  });

  filterSubNav.children().on('click', function () {
    if ($(this).attr('id') == 'search') {
      filterFlag = false;
    } else {
      filterFlag = true;
    }
  });

  //click state of bar icons
  $('.rq-top-ribbon > ul > li > ul > li').on('click', function () {
    $(this).toggleClass('active-item-bg').end().removeClass('disable-hover');
  });

  $('.rq-top-ribbon > ul > li > ul > li select').on('click', function (e) {
    e.stopPropagation();
  });

  //active filter
  $('.sub-nav').children().on('change', function () {

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