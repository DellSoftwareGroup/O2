var globalScripts = (function ($) {

  // This js module will only run at editRequest.cshtml
  var editRequestTmpl = function () {

    //Private functions
    function _HistoryTracking() {
      /*set current group*/
      var currentG = $('#groups .task-group:first-child > div:last-child');
      currentG.collapse('show');

      //Initialize multiple select
      $('.multiple-select').each(function () {
        var title = $(this).data('title'),
            elem = $(this);

        $(this).multipleSelect({
          placeholder: title,
          minimumCountSelected: 0,
          countSelected: $(this).attr('id') == 'comments-status-changes-dd' ? $(this).next().find('li.selected').text() : title + '&nbsp;(#)',
          selectAllText: $(this).data('select-all-text'),
          allSelected: title,
          onClick: function (view) {
            var selectedOptions = elem.multipleSelect('getSelects');

            $('.task-group').find('.box-alert').hide();

            if (selectedOptions.length != 0) {
              //unckeck all selected and onUnchekall not triggering workaround
              if (selectedOptions.length == 2) {
                return false;
              }
              $('.comment-box > div').each(function () {
                var that = this;
                var hasComment = false;
                $.each(selectedOptions, function (key, value) {

                  if (value == "1") {
                    if ($(that).hasClass('comment')) {
                      $(that).show();
                    } else {
                      $(that).hide();
                    }
                  } else {
                    if ($(that).hasClass('comment')) {
                      $(that).hide();
                    } else {
                      $(that).show();
                    }
                  }
                });
              });
              /*if ($('#filter-by-group-dd').multipleSelect('getSelects') == 0) {
               $('.group-alert').removeClass('hidden');
               }*/
            } else {
              $('.comment-box > div').hide();
              findEmptyBoxes('');
              return false;
            }
            findEmptyBoxes(selectedOptions.toString());
            currentG.collapse('show');
          },
          onCheckAll: function () {
            $('.comment-box > div').show();
            findEmptyBoxes('1,2');
            currentG.collapse('show');
          },
          onUncheckAll: function () {
            $('.comment-box > div').hide();
            showMessage($('.task-group .comment-box'), 'no records');
            currentG.collapse('show');
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
            nextElem.css({'top': ' 100%', 'box-shadow': '0 4px 5px rgba(0,0,0,0.15)'});

            if ($('.table-responsive').length > 0) { // added if statement to prevent 'top' undefined error when .table-responsive is not being used
              var dropdownHeight = nextElem.outerHeight(true);
              if (nextElem.offset().top + dropdownHeight > $(document).scrollTop() + $('body').height()) {
                nextElem.css({'top': -1 * dropdownHeight, 'box-shadow': '0 -4px 5px rgba(0,0,0,0.15)'});
              }
            }
          }
        });
      });

      //on page load
      $('#comments-status-changes-dd').multipleSelect('setSelects', [1]);
      $('.comment-box > div').each(function () {
        if (!$(this).hasClass('comment')) {
          $(this).hide();
        }
      });

      /*empty comment box*/
      function findEmptyBoxes(selectedOptions) {
        $('.task-group').find('.box-alert').hide();

        $('.task-group').find('.comment-box').each(function () {
          if ($(this).find('> div').length > 0) {
            if (selectedOptions == '1') {
              if ($(this).find('> div.comment:visible').length == 0) {
                showMessage($(this), 'no comments');
              }
            } else if (selectedOptions == '2') {
              if ($(this).find('> div.status:visible').length == 0) {
                showMessage($(this), 'no status changes');
              }
            } else {
              if ($(this).find('> div.status:visible').length == 0 && $(this).find('> div.comment:visible').length == 0) {
                showMessage($(this), 'no records');
              } else {
                $('.task-group').find('.box-alert').hide();
              }
            }
          } else {
            showMessage($(this), 'no records');
          }
        });
      }

      $('#groups .task-group > div:last-child').on('shown.bs.collapse', function () {
        var box = $(this).find('.comment-box'),
            selectedOptions = $('#comments-status-changes-dd').multipleSelect('getSelects').toString();
        if (box.data('processed') == undefined) {
          if (box.find('> div').length > 0) {
            if (selectedOptions == '1') {
              if ($(this).find('.comment-box > div.comment:visible').length == 0) {
                showMessage(box, 'no comments');
              }
            } else if (selectedOptions == '2') {
              if ($(this).find('.comment-box > div.status:visible').length == 0) {
                showMessage(box, 'no status changes');
              }
            } else {
              if ($(this).find('.comment-box > div.status:visible').length == 0 && $(this).find('.comment-box > div.comment:visible').length == 0) {
                showMessage(box, 'no records');
              } else {
                $('.task-group').find('.box-alert').hide();
              }
            }

          } else {
            showMessage(box, 'no records');
          }
          box.data('processed', true);
        }
        if (box.data('processed') == true) {
          if (selectedOptions == '1' && box.find('> div.comment').length != 0) {
            box.find('.box-alert').hide();
          } else if (selectedOptions == '2' && box.find('> div.status').length != 0) {
            box.find('.box-alert').hide();
          } else {
            if (selectedOptions == '1,2' && box.find('> div.status').length != 0 && box.find('> div.comment').length != 0) {
              box.find('.box-alert').hide();
            }
          }
        }
      });


      function showMessage(box, message) {
        if (message == 'no comments') {
          box.find('.box-alert h4').text('There are no comments.');
          box.find('.box-alert').removeClass('hidden').show();
        } else if (message == 'no status changes') {
          box.find('.box-alert h4').text('There are no status changes.');
          box.find('.box-alert').removeClass('hidden').show();
        } else {
          box.find('.box-alert h4').text('There are no status changes or comments.');
          box.find('.box-alert').removeClass('hidden').show();
        }
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
    }

    // close/hide "Add Task" section after Angular
    // function will be called by IS
    function hideAddTaskSection() {
      $('.task-triggers').slideDown(400, function () {
        $('.add-task-form').slideUp(600);
      });
    }

    function hideRejectTaskSection() {
      $('.task-triggers').slideDown(400, function () {
        $('.reject-task').slideUp(600);
      });
    }

    // Init
    function init() {

      // messaging scripts by Elnaz
      _HistoryTracking();

      // Add task link interaction
      $('.task-triggers').find('a.add-slide').on('click', function (e) {
        e.preventDefault();
        $(this).parent('div').slideToggle(400, function () {
          $('.add-task-form').slideToggle(600);
        });
      });

      $('.edit-col').find('.btn-default').on('click', function (e) {
        e.preventDefault();
        $('.task-triggers').slideToggle(400, function () {
          $('.add-task-form').slideToggle(600);
        });
      });

      // Reject a task
      $('.task-triggers').find('a.reject-slide').on('click', function (e) {
        e.preventDefault();
        $(this).parent('div').slideToggle(400);
        $('.reject-task').slideToggle(600);

      });

      $('.reject-task').find('.btn-default').on('click', function (e) {
        e.preventDefault();
        $('.task-triggers').slideToggle(400, function () {
          $('.reject-task').slideToggle(600);
        });
      });

      // run common js scripts
      multiTmpl.init();
    }

    // API
    return {
      init: init,
      hideAddTaskSection: hideAddTaskSection,
      hideRejectTaskSection: hideRejectTaskSection
    }

  }();

  // This js module will only run at addRequest.cshtml
  var addRequestTmpl = function () {

    var init = function () {
      //Prevent auto complete on input field.
      //$('#data_Requester_UserIDUser').attr('autocomplete', /Chrome/.test(navigator.userAgent) ? false : 'off');
      $('#data_Requester_UserIDUser').attr('autocomplete', 'off');

      // run common js scripts
      multiTmpl.init();
    };

    return {
      init: init
    }
  }();

  // This js module will only run only on both addRequest.cshtml and editRequest.cshtml
  var multiTmpl = function () {

    var init = function () {
      /*collapsibles*/
      /*keep border bottom only when they are collapsed*/
      $('.panel-group-collapsible').each(function () {
        if ($(this).find('.panel-title > a').hasClass('collapsed')) {
	        $(this).addClass('border-b-grey');
        }
      });
      $('.panel .table-responsive').on('hidden.bs.collapse', function (e) {
        /*prevent toggling border by Notified collapsibles in comments */
        if (!$(e.target).attr('id').match('^Notified')) {
	        $(this).parent().parent().addClass('border-b-grey');
        }
      }).on('shown.bs.collapse', function (e) {
        /*prevent toggling border by Notified collapsibles in comments */
        if (!$(e.target).attr('id').match('^Notified')) {
	        $(this).parent().parent().removeClass('border-b-grey');
        }
      });
    };
    return {
      init: init
    }
  }();

  return {
    editRequestTmpl: editRequestTmpl,
    addRequestTmpl: addRequestTmpl,
    multiTmpl: multiTmpl
  }

}(jQuery));

$(function () {
  // initialize editRequest scripts
  !!$('#editRequesTmpl').length && globalScripts.editRequestTmpl.init();

  // initialize addRequest scripts
  !!$('#addRequestTmpl').length && globalScripts.addRequestTmpl.init();
});