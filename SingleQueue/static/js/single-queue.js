/*created by: Elnaz Doostdar 1/19/2014*/
$(function () {
  var filterFlag = false; // this is to keep filter open when user clicks anywhere in the sub-nav area
  //add search placeholder hack in ie9
  $(document).ajaxComplete(function () {
    if ($('html').hasClass('k-ie9')) {
      $('iframe').contents().find('#search-query').val('Search').css('color', '#ccc');

      $('iframe').contents().find('#search-query').focus(function () {
        $(this).val('').css('color', '#000');
      });

      $('iframe').contents().find('#search-query').on('blur', function () {
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

  $('#body-content').on('click', function () {
    $("#views-selector #views-list-mode").hide();
    $('.rq-top-ribbon > ul > li .sub-nav').hide();
    $('#rq-filters').removeClass('add-bg');
    $('.rq-top-ribbon > ul > li .sub-nav-wrapper').css('height', '0');

    filterFlag = false;

    if (checkDefaultValue()) {
      activateFilter();
    } else {
      dactivateFilter();
    }
  });

  //filters click event
  $('#rq-filters').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    //only trigger when user clicks on the filters icon
    if (!filterFlag || $(e.target).attr('id') == 'filters-icon' || $(e.target).attr('id') == 'filters-wrapper') {
      $('.rq-top-ribbon > ul > li .sub-nav').toggle();
      $(this).toggleClass('add-bg');
      if ($('.rq-top-ribbon > ul > li .sub-nav').is(':visible')) {
        $('.rq-top-ribbon > ul > li .sub-nav-wrapper').css('height', '445px');
      } else {
        $('.rq-top-ribbon > ul > li .sub-nav-wrapper').css('height', '0');
      }
    }
  });

  $('#rq-filters .sub-nav').children().on('click', function () {
    if ($(this).attr('id') == 'search') {
      filterFlag = false;
    } else {
      filterFlag = true;
    }
  });

  //click state of bar icons
  $('.rq-top-ribbon > ul > li > ul > li').on('click', function (e) {
    if (CheckDataChanges()) {
      if ($(this).parent().attr('id') == 'views') {
        $(this).parent().find('li').each(function () {
          $(this).removeClass('active-item-bg');
          $(this).removeClass('disable-hover');
        });
        $(this).addClass('active-item-bg');
        $(this).addClass('disable-hover');

      } else if ($(this).parents().attr('id') == 'agile-phase') {
        $(this).toggleClass('active-item-bg');
        $(this).toggleClass('disable-hover');
      } else {
        if ($(this).children().find('span').attr('id') != 'excel-icon' && $(this).attr('id') != 'sprints' && $(this).attr('id') != 'projectdates') {
          $(this).toggleClass('active-item-bg');
          $(this).removeClass('disable-hover');

          if ($(this).hasClass('active-item-bg')) {
            $(this).addClass('disable-hover');
          } else {
            $(this).removeClass('disable-hover');
          }
        }
      }
    } else {
      e.stopImmediatePropagation();
    }
  });

  $('.rq-top-ribbon > ul > li > ul > li select').on('change', function () {
    //$(this).parent().addClass('active-item-bg');
  });

  $('.rq-top-ribbon > ul > li > ul > li select').on('click', function (e) {
    /*
     $(this).parent().addClass('active-item-bg');
     if ($(this).attr('id') == 'dp-team-dd') {
     $('#views li:first-child').removeClass('active-item-bg');
     $('#views li:first-child').removeClass('disable-hover');
     }
     if ($(this).attr('id') == 'dp-mywork-dd') {
     $('#views li:last-child').removeClass('active-item-bg');
     $('#views li:last-child').removeClass('disable-hover');
     }
     */
    //} else {
    //    e.stopImmediatePropagation();
    //}
    e.stopPropagation();
  });

  //reset
  $('#reset').on('click', function () {
    clearFilters();
    $('#rq-filters').removeClass('activate-bg disable-hover');
    $('#rq-filters-item > span').css('padding-top', '23px');
  })

  //apply
  $('#search').on('click', function () {
    if (checkDefaultValue()) {
      activateFilter();
    } else {
      dactivateFilter();
    }
  });

  //active filter
  $('.sub-nav').children().on('change', function () {
    activateFilter();
  });

  //fix for chrome
  var selectClicked = false;
  $('#dp-team-dd, #fy-dd, #pfy-dd, #dp-mywork-dd').on('click', function () {
    selectClicked = true;
  });

  $('.has-subnav')
      .on('mouseover', function () {
        if (!selectClicked) {
          $(this).addClass('nav-active');
          $(this).children().find('.sub-nav-col').show();
        }
      })
      .on('mouseout', function () {
        selectClicked = false;
        $(this).removeClass('nav-active');
        $(this).children().find('.sub-nav-col').hide();
      });

  $("#views-selector #views-list").click(function () {
    SetView($(this).data("view"));
  });

  $("#views-selector #views-calendar").click(function () {
    SetView($(this).data("view"));
  });

  $("#views-selector #views-charts").click(function () {
    SetView($(this).data("view"));
  });

  $("#views-selector .views-list-mode").click(function () {
    SetView($(this).data("view"));
    $("#views-selector #views-list-mode").hide();
    return false;
  });

  $("#views-selector #views-list-edit").click(function () {
    $("#views-selector #views-list-mode").toggle();
    return false;
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

function checkDefaultValue() {//capture change on any sub-nav elements default value
  var defaultTextChanged = defaultOptionChanged = false,
      isDefaultValues = true;

  if (location.href.toLowerCase().indexOf('requests') >= 0) {
    isDefaultValues = checkDefaultValues('requests');
    if (!isDefaultValues) {
      $('.sub-nav input[type="text"]').each(function () {
        if ($(this).val() != '') {
          defaultTextChanged = true;
          return false;
        }
      });
    }
  } else {
    isDefaultValues = checkDefaultValues('projects');
    if (!isDefaultValues) {
      $('.sub-nav input[type="text"]').each(function () {
        if ($(this).val() != '') {
          defaultTextChanged = true;
          return false;
        }
      });
    }
  }

  $('.sub-nav select').each(function () {
    if ($(this)[0].selectedIndex != 0) {
      defaultOptionChanged = true;
      return false;
    }
  });

  if (defaultOptionChanged == true || defaultTextChanged == true) {
    return true;
  }
  if (defaultOptionChanged == false && defaultTextChanged == false) {
    return false;
  }
}

function activateFilter() {
  $('#rq-filters').addClass('activate-bg disable-hover');
  $('#rq-filters-item > span').css('padding-top', '11px');
}

function dactivateFilter() {
  $('#rq-filters').removeClass('activate-bg disable-hover');
  $('#rq-filters-item > span').css('padding-top', '23px');
}

function checkDefaultValues(page) {
  if (page == 'requests') {
    if (
        ($('#request-type-id').val() == 'Request Id' || $('#request-type-id').val() == '') &&
        ($('#request-type-text').val() == 'Request Type' || $('#request-type-text').val() == '') &&
        ($('#owner-text').val() == 'Owner' || $('#owner-text').val() == '') &&
        ($('#requester-text').val() == 'Requester' || $('#requester-text').val() == '') &&
        ($('#campaign-text').val() == 'Parent Campaign' || $('#campaign-text').val() == '') &&
        ($('#project-text').val() == 'Project' || $('#project-text').val() == '')) {
      return true;
    } else {
      return false;
    }
  } else {
    if (($('#owner-text').val() == 'Owner' || $('#owner-text').val() == '') && ($('#requester-text').val() == 'Requester' || $('#requester-text').val() == '') &&
        ($('#campaign-text').val() == 'Parent Campaign' || $('#campaign-text').val() == '')) {
      return true;
    } else {
      return false;
    }
  }
}

function clearFilters() {
  $('.sub-nav select').each(function () {
    $(this).find('option:eq(0)').prop('selected', true);
  });
  if ($('html').hasClass('k-ie9')) {
    $('.sub-nav input[type="text"]').each(function () {
      if ($(this).attr('placeholder') != undefined && $(this).attr('placeholder') != '') {
        $(this).val($(this).attr('placeholder')).css('color', '#ccc');
      }
    });
    $('.sub-nav input[type="text"]').trigger('focus').trigger('blur');
  }
}