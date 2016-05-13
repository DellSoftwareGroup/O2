/*function ribbon_change(obj) {
 console.log('from IS form: ', obj);
 }*/

var ribbonListener = function () {

	/* Private Variables */
	var ribbonReqObj = {};

	/* -----> Private Methods <-----*/

	function rebuildRibbonState($rbWrapper) {
		var $filter = $($rbWrapper).find('[data-isFilter=true]');
		ribbonReqObj = {};
		return filtersCollection($filter);

	}

	// Internal methods to handle filters by type:
	function handleMultiSelect($multiSelect, filterType) {
		var hasActive = false, parentTag = $multiSelect.closest('li');
		if ($multiSelect.data('title') !== null || $multiSelect.data('title') !== undefined) {
			ribbonReqObj[$multiSelect.data('title')] = [];
		} else {
			console.error('Undefined filter title');
		}

		$multiSelect.next().find('.ms-drop li').each(function () {
			var $li = $(this);
			var option = {};

			option.isSelected = function () {
				if ($li.hasClass('selected')) {
					// console.log(parentTag.children('.filter').length);
					if ($li.parents('.sub-nav').length == 0) { // prevent "More Filter" issue with bg.
						parentTag.addClass('active-item-bg');
					}

					hasActive = true;
					return true
				} else {
					return false
				}
			}();// end of is selected

			option.value = $li.find('input').attr('value'); // end of value

			option.text = $li.find('label').text(); // end of text

			option.type = filterType;

			ribbonReqObj  [$multiSelect.data('title')].push(option);
		});
		if (!hasActive) { // if no active options remove active bg class
			parentTag.removeClass('active-item-bg');
		}
	}

	function handleDefaultSelect(defaultSelect, filterType) {
		if (defaultSelect.data('title') !== null || defaultSelect.data('title') !== undefined) {
			ribbonReqObj[defaultSelect.data('title')] = [];
		} else {
			alert('No Title issue: see ribbon.js')
		}

		defaultSelect.find('option').each(function () {
			var $option = $(this);
			var option = {};
			option.text = $option.text();
			option.value = $option.attr('value');
			option.type = filterType;

			option.isSelected = function () {
				if ($option.attr('selected')) {
					return true
				} else {
					return false;
				}
			}();


			ribbonReqObj[defaultSelect.data('title')].push(option);
		});
	}

	function handleValueFromModal(whichModal, filtertype) {
		var $thisModal = $(whichModal);
		var option = {};
		ribbonReqObj[$thisModal.data('title')] = [];

		option.value = $thisModal.find('div:first-child').attr('filterid');
		option.text = $thisModal.find('div:first-child').text();
		option.isSelected = (typeof option.value != 'undefined' && option.value != '');
		option.type = filtertype;

		ribbonReqObj[$thisModal.data('title')].push(option);
	}

	function handleNoSelectFilters(noSelect, filterType) {
		var $prntLi = noSelect.parents('li'),
				prTitle = $prntLi.data('title');

		// check the title is valid
		if (prTitle !== null || prTitle !== undefined) {
			if (prTitle in ribbonReqObj) {
				// property exist
			} else {
				ribbonReqObj[prTitle] = []
			}
		} else {
			console.error('undefined title!!!')
		}

		// Collect filter info
		var option = {};

		option.text = noSelect.find('a span:last-child').text();
		option.value = "no value assigned"; // this filter section doesn't have values
		option.type = filterType;
		option.isSelected = noSelect.hasClass('active-item-bg') ? true : false;

		// test if object exist
		if (ribbonReqObj[prTitle].length > 0) {
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

	function handleDynamicSelect(fromPopup, filterType) {
		var filterTitle = $(fromPopup).find('[data-title]').data('title'),
				$dynamicSelectElem = $(fromPopup).find('.dynamic-select');

		// add filter to object
		if (filterTitle !== null || filterTitle !== undefined) {
			ribbonReqObj[filterTitle] = [];
		}
		// check if select exist
		if ($dynamicSelectElem.length > 0) {
			$dynamicSelectElem.find('option').each(function () {
				var $option = $(this);
				var option = {};
				option.text = $option.text();
				option.value = $option.attr('value');
				option.email = $option.data('email');
				option.type = filterType;
				option.isSelected = true;

				ribbonReqObj[filterTitle].push(option);
			});
		}
	}

	function viewsSectionLogic() {

		//local variables
		var $checkBoxes = $('#views').find('.ms-drop').find('input'), views = {active: ''};

		function bindViewChanges() {
			$('#views').on('change.views', $checkBoxes, function (e) {
				e.preventDefault()
				var $selected = $(e.target);

				if ($selected.is('select')) {
					views.clicked = getView($selected);
					if (views.clicked === views.active) {
						if ($($selected).multipleSelect('getSelects') == 0) { // test if user is clearing all options
							selectOppositeView(getView($selected));
						} else {
							return;  // users is selecting more options from same view
						}
					} else { // user is selecting from a different view - clear opposite view
						if ($($selected).multipleSelect('getSelects') == 0) { // helps prevent posible infinite loop by changes from filter section (below ribbon)
							return;
						}
						clearOppositeView(getView($selected))
					}
				}

			})
		} // bind select event to trigger business logic

		function selectOppositeView(title) {
			var oppositeView = (title == 'My Work') ? 'All Teams' : 'My Work';
			var $selectBack = $('#views').find('select[data-title="' + oppositeView + '"]');
			$selectBack.data('trigger', 'dynamic');
			views.active = oppositeView;
			$('#views').off('.views'); // turn off bind to prevent a infinite change cycle
			//$selectBack.multipleSelect('setSelects', allOptions);
			$selectBack.multipleSelect('checkAll');
			$selectBack.parent('li').addClass('active-item-bg');
			bindViewChanges(); //turn on binding again
		}

		function clearOppositeView(title) {
			if (title == undefined) {
				return;
			} else {
				var oppositeView = (title == 'My Work') ? 'All Teams' : 'My Work';
				var $selectOff = $('#views').find('select[data-title="' + oppositeView + '"]');
				$selectOff.data('trigger', 'dynamic')
				// $('#views').off('.views'); // need to unbind original .on to prevent cycle
				views.active = title;
				$('#views').off('.views'); // turn off bind to prevent a infinite change cycle
				$selectOff.multipleSelect('setSelects', []);
				$selectOff.parent('li').removeClass('active-item-bg');
				bindViewChanges() //turn on binding again
			}

		}

		function getView(target) {
					var title = $(target).data('title');
					$(target).parent('li').addClass('active-item-bg')
					return title;
		}; // finds clicked filter by title

		// bind view selects
		bindViewChanges()
	}


	/* -----> IS Interactions <-----*/

	var initISfunc = {};

	// gets function passed in the init and saves it for later use in an obj
	function getISfunction(funcPassed) {
		initISfunc = (function () {
			var passedFunc = funcPassed;

			function run() {
				if (typeof passedFunc !== "undefined" || typeof passedFunc !== 'function') {
					passedFunc(getISobj(ribbonReqObj));
				}
			}

			return {
				passedFund: passedFunc,
				run: run
			}
		}());
	}

	// function converts object to meet IS requirements
	function getISobj(uiObj) {

		var ISribbonObj = {}, obj = (uiObj == undefined) ? ribbonReqObj : uiObj;

		// Extend String - Capitalize method
		String.prototype.capitalize = function () {
			if (this.length > 0) {
				return this.charAt(0).toUpperCase() + this.slice(1);
			}

		}


		function ISobjBuilder() {

			this.addProperty = function (propertyName, values) {
				ISribbonObj[propertyName] = values;
			}
			this.fixedPropertyName = function (title, option) {
				var fixedTitle = '';
				if (typeof option !== "undefined") {
					title = title + ' ' + option;
				}
				if (title.indexOf(' ') > 0) {
					var titleArr = title.split(' ');
					titleArr.forEach(function (word) {
						if (typeof word == 'string') {
							fixedTitle = fixedTitle + word.capitalize();
						}
					});
				} else {
					if (typeof title == 'string') {
						fixedTitle = title.capitalize();
					}
				}
				return fixedTitle;
			}

		} // end of ISobjBuilder

		function buildObj(obj) {
			var numValues = [], activeOptions = [], objValue = [];

			$.each(obj, function (title, valueObj) {
				// test is there is active and what type of value this filter has
				if (Array.isArray(valueObj) && valueObj.length > -1) {
					valueObj.forEach(function (option) {
						if (option.isSelected === true) {
							// what type of value
							if (option.type == 'array-list') {
								numValues.push(option.value); // if is a number it is a dropdown
							} else if (option.type == 'boolean') {
								activeOptions.push(option.text);
							} else if (option.type === 'userType') { // there could not be other case but we are checking for undefined.
								optObj = {
									value: option.value,
									email: option.email
								};
								objValue.push(optObj);
							}

						}
					});
					if (numValues.length > 0) {
						isDropDown(title, numValues);
						numValues = [];
						return true;
					} else if (activeOptions.length > 0) {
						noDropDown(title, activeOptions);
						activeOptions = [];
						return true;
					} else if (objValue.length > 0) {
						isdynamicFilter(title, objValue);
						objValue = [];
						return true;
					}

				}
			});

		}

		function isDropDown(title, values) {
			var buildObj = new ISobjBuilder()

			buildObj.addProperty(
					buildObj.fixedPropertyName(title),
					values // array with values only
			);
		}

		function noDropDown(title, options) {
			var buildObj = new ISobjBuilder();

			options.forEach(function (optionName) {
				buildObj.addProperty(
						buildObj.fixedPropertyName(title, optionName),
						true
				);
			});
		}

		function isdynamicFilter(title, options) {
			var buildObj = new ISobjBuilder();

			buildObj.addProperty(
					buildObj.fixedPropertyName(title),
					options
			);
		}

		// Call to build object
		// check object is not empty
		if ($.isEmptyObject(obj)) {  // IS may call the function with and empty object
			console.error('empty object -- see func isdynamicFilter');
			return false;
		} else {
			buildObj(obj);

			var IsObj = JSON.stringify(ISribbonObj);
			// console.log('ISobj: ', IsObj)
			return IsObj;
		}

	}


	/* -----> Public functions <-----*/

	// create ribbonReqObj   filters object
	function filtersCollection($filter) {
		// Iterate filters by type:
		$filter.each(function () {
			// Filter Types
			if ($(this).attr('multiple')) { // check for multiselect
				handleMultiSelect($(this), 'array-list');

			} else if ($(this).attr('data-select') === "default") { // check for default select elem
				handleDefaultSelect($(this), 'array-list');

			} else if ($(this).attr('data-dynamic') === "true") {
				handleDynamicSelect($(this), 'userType');

			} else if ($(this).attr('filter-type') === 'from-modal') {
				handleValueFromModal($(this), 'array-list'); // Array-list is set as it will be process as an arrary for ISobj

			} else if ($(this).find('select').length == 0) {  //check for filter options without select elem
				handleNoSelectFilters($(this), 'boolean');

			}
		})
		ribbonWidgets.filterCollectorModule();

		// Will trigger IS function passed as argument in the init
		initISfunc.run();
		// console.log(getISobj(ribbonReqObj));
		return ribbonReqObj;
	}

	// add listener to filters, triggers IS function
	function filterListener($rbWrapper) {
		var isTimerRunning = false, ifMultipleClicks = "";

		// on select change event
		$('.sq-top-ribbon').on('change', 'select', function(event) {
			if (isTimerRunning) {
				clearTimeout(ifMultipleClicks);
			}
			// delay to allow for fast multiple clicking on a filter
			ifMultipleClicks = setTimeout(function () {

				// rebuild ribbonReqObj   filters state
				rebuildRibbonState($rbWrapper);
				isTimerRunning = true;

			}, 500);

		});

		// on click event for li with now select
		$('#agile-status').on('click', 'a', function(e) {
			e.preventDefault();
			toggleActiveItem($(this).parent('li')); // function comes from single-queue.js
			// rebuild ribbonReqObj   filters state
			rebuildRibbonState($rbWrapper);

		});

		// manual change of sprints IS returns only "[ALL]" so we manually maintain it.
		$('#dp-sprint-dd').find('option:first-child').text('All Sprints');

	}

	// get object used to pase object to external widgets
	function passFilterStateObj() { // function called at filterCollectorModule to pass the ribbon obj.
		return ribbonReqObj;
	}


	/* -----> init <-----*/
	function init(ISprocess) {
		var $rbWrapper = $('.sq-top-ribbon'),
				$filter = $rbWrapper.find('[data-isFilter=true]'); // variable will be moved when ribbon gets integrated with pages.

		getISfunction(ISprocess);
		filtersCollection($filter);
		filterListener($rbWrapper);
		viewsSectionLogic();
		ribbonWidgets.filterCollectorModule();// filters under ribbon - comes from custom-ui.js

		//console.log(ribbonReqObj); // test object
		//console.log('ISobj: ', getISobj(ribbonReqObj)); // test obj passed to IS
	}

	/* -----> API -- */
	return {
		init: init,
		rebuildRibbonState: rebuildRibbonState,
		passFilterStateObj: passFilterStateObj,
		getISobj: getISobj
	}

}();

var ribbonWidgets = function () {

	function filterCollectorModule() {
		var filterObj = ribbonListener.passFilterStateObj();

		// Clear filter collector area
		$('.filter-collector').html('');

		function findActiveFilters() {
			var activeFilters = {};
			$.each(filterObj, function (filter, options) {
				if (Array.isArray(options)) {
					options.forEach(function (option) {
						if (option.isSelected == true) {
							if (filter in activeFilters) {
								activeFilters[filter].push(option);
							} else {
								activeFilters[filter] = [];
								activeFilters[filter].push(option);
							}

						}
					});
				}
			});
			return activeFilters;
		}

		function buildTmpl(activeFilters) {
			// append filter tag:
			$('.filter-collector').append('<ul><li>Filters:</li></ul>');
			var filterHtml = '', activeArr = [];
			$.each(activeFilters, function (filter, options) {
				filterHtml = String()
						+ '<ul>'
						+ '<li>' + filter + '<a href="#"> X</a></li>';
				if (Array.isArray(options)) {
					options.forEach(function (option) {
						filterHtml = filterHtml + '<li><span>' + option.text + '</span><a href="#"> X</a></li>';
					});
				}
				filterHtml = filterHtml + '</ul>'
				activeArr.push(filterHtml);
			});
			var cleanFilters = activeArr.join(' ');
			$('.filter-collector').append(cleanFilters);
		}

		// Remove Filters
		function setXTrigger() {

			// helping functions
			function updateMultiSelect(filterType, option) {
				var updatedValues = [];
				if (option === undefined) {  // Process for removing whole filter
					$(filterType).multipleSelect('setSelects', []);

				} else { // Process to remove single option
					var optionValues = $(filterType).multipleSelect('getSelects'),
							optionTxt = $(filterType).multipleSelect('getSelects', 'text');
					optionTxt.forEach(function (optionTxt, index) {
						if (option == optionTxt) {
							updatedValues = optionValues.splice(index, 1);
						}
					})
					$(filterType).data('trigger', 'dynamic');
					$(filterType).multipleSelect('setSelects', optionValues);
				}

			}

			function updateDefaultSelect(filterType) {
				$(filterType).val('0'); // default to "All Sprints" -- TODO: need to revise when values are set from IS data.
				ribbonListener.rebuildRibbonState($('.sq-top-ribbon'));
			}

			function updateDynamicSelect(filterType, option) {
				var $filterWrap = $(filterType).parent('a');

				if (option === undefined) {
					$filterWrap.find('select').html(''); // Remove all options
					ribbonListener.rebuildRibbonState($('.sq-top-ribbon'));
					$(filterType).text($(filterType).data('title'));
				} else {
					$filterWrap.find('select option').each(function () {
						if ($(this).text() == option) {
							$(this).remove();
							ribbonListener.rebuildRibbonState($('.sq-top-ribbon')); // Remove only clicked option
							editCountToLabel(filterType);
						}
					})

				}

			}

			function updateOptionFromModal(filterType) {
				var $thisModal = $(filterType);
				$thisModal.find('div:first-child').attr('filterid', '');
				$thisModal.find('div:first-child').html('<span>' + $thisModal.data('title') + '</span>');
				ribbonListener.rebuildRibbonState($('.sq-top-ribbon'));
			}

			function updateNoSelectFilters(filterType, option) {

				if (option == undefined) {
					$(filterType).find('li').each(function () {
						$(this).hasClass('active-item-bg') ? $(this).removeClass('active-item-bg') : false; // Clear all items
					});
					ribbonListener.rebuildRibbonState($('.sq-top-ribbon'));
				} else {
					$(filterType).find('li').each(function () {
						if ($(this).find('a span:last-child').text() == option) {
							$(this).removeClass('active-item-bg'); // clear only option clicked
							ribbonListener.rebuildRibbonState($('.sq-top-ribbon'));
						}
					})
				}

			}

			function findFilterTitle(clickedElm) {
				var filterUl = $(clickedElm).closest('ul'),
						filterTxt = filterUl.find('li').eq(0).text(),
						filterTile = cleanFilterTxt(filterTxt);
				return filterTile;
			}

			function findOptionTxt(clickedElm) {
				var optionTxt = $(clickedElm).siblings('span').text();
				return optionTxt;
			}

			function cleanFilterTxt(filter) {
				var filterTypeArr = filter.split(' ');
				filterTypeArr.pop();
				filter = filterTypeArr.join(' ');
				return filter;
			}

			function removeLabelParenthesis(label) {
				var tagTxtArr = label.split(' ');
				tagTxtArr.pop();
				label = tagTxtArr.toString();
				return label;
			}

			function editCountToLabel(filterType) {
				var tagTxt = filterType.text(),
						optionCount = $(filterType).siblings('select').find('option').length;

				// check if tag has been modified with parenthesis
				if (tagTxt.indexOf('(') > -1) {
					tagTxt = removeLabelParenthesis(tagTxt);

					// check if options container is not empty when options are removed
					if (optionCount !== 0) {
						tagTxt = tagTxt + ' (' + optionCount + ')';
						$(filterType).text(tagTxt);
					} else {
						$(filterType).text(tagTxt);
					}
				} else {
					tagTxt = tagTxt + ' (' + optionCount + ')';
					$(filterType).text(tagTxt);
				}

			}

			function whichFilterType(filterType, option) {
				// which type of fiter is it
				if ($(filterType).attr('multiple')) { // check for multiselect
					updateMultiSelect($(filterType), option);

				} else if ($(filterType).attr('data-select') === "default") { // check for default select elem
					updateDefaultSelect($(filterType));

				} else if ($(filterType).parent('a').attr('data-dynamic') === 'true') {
					updateDynamicSelect($(filterType), option);

				} else if ($(filterType).attr('filter-type') === "from-modal") {
					updateOptionFromModal($(filterType));

				} else if ($(filterType).find('select').length == 0) {  //check for filter options without select elem
					updateNoSelectFilters($(filterType), option);

				}
			}

			// Register Events and trigger responses

			$('.filter-collector').on('click', 'a', function (e) {
				e.preventDefault();
				var filterType = findFilterTitle($(this));

				// if clicked on grouping filter
				if ($(this).siblings('span').length > 0) {
					var optionTxt = findOptionTxt($(this));
					whichFilterType($('[data-title="' + filterType + '"]'), optionTxt); // determine which filter type and remove option
				} else {
					whichFilterType($('[data-title="' + filterType + '"]')); // determine and remove whole filter type
				}

			});
		}

		buildTmpl(findActiveFilters());
		setXTrigger()

	}

	var moreFiltersPopover = function () {

		// when campaign or project field change
		function onModalInputchange($modalName) {
			var changeIcon = function () {
						$('#filter-' + $modalName).find('#' + $modalName + '-btn')
								.addClass('hidden').end()
								.find('> span').removeClass('hidden');
					},

					callRibbonListener = function () {
						ribbonListener.rebuildRibbonState('.sq-top-ribbon');
					};

			$.when(changeIcon()).done(callRibbonListener());
		}

		function init() {
			// Clear campaign or project fields when icon is clicked
			$('.sub-nav').on('click', '.clear-btn', function () {
				var thisParent = $(this).parent('div');
				$(this).siblings('div')
						.attr('filterid', '')
						.html('<span>' + thisParent.data('title') + '</span>').end()
						.addClass('hidden')
						.siblings('input[type=button]').removeClass('hidden');

				// call ribbonListener to track changes
				ribbonListener.rebuildRibbonState('.sq-top-ribbon');
			})
		}

		return {
			init: init,
			onModalInputchange: onModalInputchange
		}

	}();

	return {
		filterCollectorModule: filterCollectorModule,
		moreFiltersPopover: moreFiltersPopover
	}

}();








