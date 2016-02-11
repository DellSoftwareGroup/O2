// Mockup function, eventually IS will use this function to run their process.
function ribbon_change(obj) {
  console.log('ribbon_change: ', obj)
}

var ribbonListener = function () {

  /* Private Variables */
  var ribbonReqObj = {};

  /*  Private Methods*/

  function rebuildRibbonState($rbWrapper) {
    var $filter = $rbWrapper.find('[data-isFilter=true]');
    ribbonReqObj = {};
    return filtersCollection($filter);
  }

  // Internal methods to handle filters by type:
  function handleMultiSelect($multiSelect) {
    if ($multiSelect.data('title') !== null || $multiSelect.data('title') !== undefined) {
      ribbonReqObj  [$multiSelect.data('title')] = [];
    } else {
      console.log('Undefined filter title')
      }

    $multiSelect.next().find('.ms-drop li').each(function () {
      var $li = $(this);
      var option = {};

      option.isSelected = function () {
        if ($li.hasClass('selected')) {
          return true;
        } else {
          return false;
        }
      }();// end of is selected

      option.value = $li.find('input').attr('value'); // end of value

      option.text = $li.find('label').text(); // end of text


      ribbonReqObj  [$multiSelect.data('title')].push(option);
    });
  };

  function handleDefaultSelect(defaultSelect) {
    if (defaultSelect.data('title') !== null || $multiSelect.data('title') !== undefined) {
      ribbonReqObj  [defaultSelect.data('title')] = [];
    } else {
      alert('Undefined ? whats?')
    }

    defaultSelect.find('option').each(function () {
      var $option = $(this);
      var option = {};
      option.text = $option.text();
      option.value = $option.attr('value');
      option.isSelected = function () {
        if ($option.attr('selected')) {
          return true
        } else {
          return false;
        }
      }();


      ribbonReqObj  [defaultSelect.data('title')].push(option);
    });
  };

  function handleNoSelectFilters(noSelect) {
    var $prntLi = noSelect.parents('li'),
        prTitle = $prntLi.data('title');

    // check the title is valid
    if (prTitle !== null || prTitle !== undefined) {
      if (prTitle in ribbonReqObj) {
        // property exist
      } else {
        ribbonReqObj  [prTitle] = []
      }
    } else {
      console.log('undefined title!!!')
    }

    // Collect filter info
    var option = {};

    option.text = noSelect.find('a span:last-child').text();
    option.value = "no value assigned"; // this filter section doesn't have values
    option.isSelected = function () {
      if (noSelect.hasClass('active-item-bg')) {
        return true;
      } else {
        return false;
      }
    }();

    // test if object exist
    if (ribbonReqObj  [prTitle].length > 0) {
      var tempArr = ribbonReqObj  [prTitle].filter(function (obj) {
        if (obj.text === option.text) {
          return false; // remove modified filter
        } else {
          return true;
        }
      })
      tempArr.push(option);
      ribbonReqObj  [prTitle] = tempArr;
    } else {
      ribbonReqObj  [prTitle].push(option); // if option does not exist simple add option
    }
    }


  // create ribbonReqObj   filters object
  function filtersCollection($filter) {
    // Iterate filters by type:
    $filter.each(function () {
      // Filter Types
      if ($(this).attr('multiple')) { // check for multiselect
        handleMultiSelect($(this));

      } else if ($(this).attr('data-select') === "default") { // check for default select elem
        handleDefaultSelect($(this));

      } else if ($(this).find('select').length === 0) {  //check for filter options without select elem
        var noSelect = $(this);
        handleNoSelectFilters(noSelect)
      }
    })

    return ribbonReqObj;
  }

  // add listener to filters, triggers IS function
  function filterListener($rbWrapper, ISFunc) {
    var isTimerRunning = false, ifMultipleClicks = "";
    $('.sq-top-ribbon li li').on('click', function (event) {

      if (isTimerRunning) {
        clearTimeout(ifMultipleClicks);
        isTimerRunning = true;
      } else {
        isTimerRunning = true;
      }

      // delay to allow for fast multiple clicking on a filter
      ifMultipleClicks = setTimeout(function () {

        // rebuild ribbonReqObj   filters state
        rebuildRibbonState($rbWrapper);

        // Will trigger IS function passed in the module arguments
        if (ISFunc !== "undefined" || ISFunc === 'function') {
          ISFunc(ribbonReqObj);
        }
      }, 3000)

    });
  }


  /* -----> Public Methods -- */
  function init(ISprocess) {
    var $rbWrapper = $('.sq-top-ribbon'),
        $filter = $rbWrapper.find('[data-isFilter=true]'); // variable will be moved when ribbon gets integrated with pages.
    console.log('1: ', typeof ISprocess);
    filtersCollection($filter);
    filterListener($rbWrapper, ISprocess);

    console.log(ribbonReqObj); // test object
  }

  /* -----> API -- */
  return {
    init: init
  }

}();


// Standard jquery onload function will trigger ribbonListener init method
$(function () {
  if ($('.sq-top-ribbon').length === 0) {
    var timerOne = setInterval(function () {  // timer needed only for localhost
      if ($('.sq-top-ribbon').length > 0) {
        ribbonListener.init(ribbon_change);
        clearInterval(timerOne);
      }
    }, 1000);
  }
});



