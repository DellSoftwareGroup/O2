//
var ribbonListener = function (ISoperations) {

  /* Private Variables */
  var ribbon = {};

  /*  Private Methods*/

  function rebuildRibbonState($rbWrapper) {
    var $filter = $rbWrapper.find('[data-isFilter=true]');
    ribbon = {};
    return filtersCollection($filter);
  }

  // Internal methods to handle filters by type:
  function handleMultiSelect($multiSelect) {
    if ($multiSelect.data('title') !== null || $multiSelect.data('title') !== undefined) {
      ribbon[$multiSelect.data('title')] = [];
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


      ribbon[$multiSelect.data('title')].push(option);
    });
  };

  function handleDefaultSelect(defaultSelect) {
    if (defaultSelect.data('title') !== null || $multiSelect.data('title') !== undefined) {
      ribbon[defaultSelect.data('title')] = [];
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


      ribbon[defaultSelect.data('title')].push(option);
    });
  };

  function handleNoSelectFilters(noSelect) {
    var $prntLi = noSelect.parents('li'),
        prTitle = $prntLi.data('title');

    // check the title is valid
    if (prTitle !== null || prTitle !== undefined) {
      if (prTitle in ribbon) {
        // property exist
      } else {
        ribbon[prTitle] = []
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
    if (ribbon[prTitle].length > 0) {
      var tempArr = ribbon[prTitle].filter(function (obj) {
        if (obj.text === option.text) {
          return false; // remove modified filter
        } else {
          return true;
        }
      })
      tempArr.push(option);
      ribbon[prTitle] = tempArr;
    } else {
      ribbon[prTitle].push(option); // if option does not exist simple add option
    }
    }


  // create ribbon filters object
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
    return ribbon;
  }

  // add listener to filters
  function filterListener($rbWrapper) {

    $rbWrapper.on('click', function (event) {
      rebuildRibbonState($rbWrapper);
      // ISopertion(currentStateObj) --> Will run here.
      console.log('after click: ' + ribbon);
    })
  }


  /* -----> Public Methods -- */
  function init() {
    var $rbWrapper = $('.sq-top-ribbon'),
        $filter = $rbWrapper.find('[data-isFilter=true]'); // variable will be moved when ribbon gets integrated with pages.

    filtersCollection($filter);
    filterListener($rbWrapper);

    console.log(ribbon); // test object
  }

  /* -----> API -- */
  return {
    init: init
  }

}();


$(function () {
  if ($('.sq-top-ribbon').length === 0) {
    var timerOne = setInterval(function () {  // timer needed only for localhost
      if ($('.sq-top-ribbon').length > 0) {
        ribbonListener.init()
        clearInterval(timerOne);
      }
    }, 1000);
  }
});



