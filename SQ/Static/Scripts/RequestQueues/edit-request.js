$(function () {
  //Initialize multiple select
  $('body').find('select').each(function () {
    if ($(this).attr('multiple') == 'multiple') {
      var title = $(this).data('title'),
          elem = $(this);

      $(this).multipleSelect({
        placeholder: title,
        minimumCountSelected: 0,
        countSelected: title + '&nbsp;(#)',
        selectAllText: $(this).data('select-all-text'),
        allSelected: title,
        onClick: function (view) {
          if (elem.attr('id') == 'filter-by-group-dd') {

          } else {

          }
        },
        onCheckAll: function () {
          if (elem.attr('id') == 'filter-by-group-dd') {

          } else {

          }
        },
        onUncheckAll: function () {
          if (elem.attr('id') == 'filter-by-group-dd') {

          } else {

          }
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

          /*check if dropdown needs to be on top*/
          /*reset*/
          nextElem.css({ 'top': ' 100%', 'box-shadow': '0 4px 5px rgba(0,0,0,0.15)' });

          if ($('.table-responsive').length > 0) { // added if statement to prevent 'top' undefined error when .table-responsive is not being used
            if ($(elem).parents('.table-responsive').offset().top + $(elem).parents('.table-responsive').outerHeight(true) < nextElem.offset().top + nextElem.find('ul').outerHeight(true)) {
              nextElem.css({ 'top': ' -90px', 'box-shadow': '0 -4px 5px rgba(0,0,0,0.15)' });
            }
            else {
              nextElem.css({ 'top': ' 100%', 'box-shadow': '0 4px 5px rgba(0,0,0,0.15)' });
            }
          } else {
            nextElem.css({ 'top': ' 100%', 'box-shadow': '0 4px 5px rgba(0,0,0,0.15)' });
          }
        }
      });
    }
  });

  $('#comments-status-changes-dd').multipleSelect("checkAll");

  /*set current group*/
  var currentG = $('#current').attr('value');
  if (currentG.indexOf(',')) {
    var gArr = currentG.split(',');
    $('#filter-by-group-dd').multipleSelect('setSelects', gArr);
  } else {
    $('#filter-by-group-dd').multipleSelect('setSelects', currentG);
  }

  /*popover*/
  $('.toggle-popover').popover({
    html: true,
    trigger: "manual",
    content: function () {
      return $(".popover-content", this).html();
    }
  }).on("mouseenter", function () {
    var _this = this;
    $(this).popover("show");
    $(this).siblings(".popover").on("mouseleave", function () {
      $(_this).popover('hide');
    });
  }).on("mouseleave", function () {
    var _this = this;
    setTimeout(function () {
      if (!$(".popover:hover").length) {
        $(_this).popover("hide")
      }
    }, 100);
  });

  /*collapsibles*/
  /*keep border bottom only when they are collapsed*/
  $('.panel-group-collapsible').each(function () {
    if ($(this).find('.panel-title > a').hasClass('collapsed')) {
      $(this).css('border-bottom', '1px solid #aaa');
    }
  });
  $('.table-responsive').on('hidden.bs.collapse', function (e) {
    /*prevent toggling border by Notified collapsibles in comments */
    if (!$(e.target).attr('id').match('^Notified')) {
      $(this).parent().parent().css('border-bottom', '1px solid #aaa');
    }
  }).on('shown.bs.collapse', function (e) {
    /*prevent toggling border by Notified collapsibles in comments */
    if (!$(e.target).attr('id').match('^Notified')) {
      $(this).parent().parent().attr('style', '');
    }
  });
});