/*function ribbon_change(obj) {
 console.log('from IS form: ', obj);
 }*/

var ribbonElem = null;
var moreFiltersElem = null;

var initRibbon = function () {
	/* utility functions */
	function splitCamelCase(word) {
		return word
		// insert a space before all caps
				.replace(/([A-Z])/g, ' $1')
				// uppercase the first character
				.replace(/^./, function (str) {
					return str.toUpperCase();
				});
	}

	function getOption(word) {
		//word == Request Status Idea
		var obj = {};
		var rem = word.split(' ');
		obj.option = rem.pop();
		obj.title = rem.join(' ');
		//obj == {option: "Idea", title: "Request Status"}
		return obj;
	}

	function getFilterInfo(filterType) {
		var whichFilter = $(filterType).data('title');
		whichFilter = $.trim(whichFilter);
		return filtersMap[whichFilter];
	}

	/*function optionsCount($thisSelect) {
		return $thisSelect.find('option').length;
	}*/

	// private variables
	var $filters = [], filtersMap = {}, activeFilters = {};

	function findActiveFilters(lastFiltersObj) {
		if (!$.isEmptyObject(lastFiltersObj)) {
			this.init(lastFiltersObj);
		}
		else {
			console.warn('No ribbon cookie information found!');
		}
	}

	function processActiveFilters(filterObj) {
		function getFilterTitle() {
			var filterTitles = [];
			
			$.each(filterObj, function (prop, val) {
				var title = $.trim(splitCamelCase(prop));

				if (title.indexOf('Request Status') > -1) {
					var info = getOption(title);
					title = info.title;
					
					if (title in filtersMap) {
						var arr = filtersMap[title]['option'];
						arr.push(info.option);
						val = arr;
					}
					else {
						arr = [];
						arr.push(info.option);
						val = arr;
						title = info.title;
					}
				}

				if (filterTitles.length == 0) {
					filterTitles.push(title)
				}
				else {
					var titleExist = false;
					
					filterTitles.forEach(function (eTitle) {
						if (eTitle == title) {
							titleExist = true;
						}
					});

					!titleExist && filterTitles.push(title);
				}

				filtersMap[title] = {
					option: val,
					original: prop
				}
			});

			return filterTitles;
		}

		var filterTitles = getFilterTitle();

		$.each(filterTitles, function(indx, title) {
			var elem = ribbonElem.find('[data-title = "' + title + '"]');

			if(elem) {
				$filters.push(elem);
			}
		});

		// determine each kind of filter and route to right set method
		function typeOfFilter() {
			$filters.forEach(function (filterType) {
				var filterTypeElem = $(filterType), filterInfo = getFilterInfo(filterType);

				if(filterTypeElem.parents('#sq-filters-item').length) {
					$('#sq-filters-item').removeClass('active-item-bg');
				}
				else {
					filterTypeElem.parents('li').removeClass('active-item-bg');
				}

				// If multiSelect filter typ
				if (filterTypeElem.attr('multiple')) { // check for multiselect
					//setMultiSelects($(filterType), filterInfo.option);
					$(filterType).multipleSelect('setSelects', filterInfo.option);

					if(filterInfo.option.length) {
						if($(filterType).parents('#sq-filters-item').length) {
							$('#sq-filters-item').addClass('active-item-bg');
						}
						else {
							$(filterType).parents('li').addClass('active-item-bg');
						}
					}
				}

				// If no dropdown or input text filter (e.g Request Status)
				else if (filterTypeElem.data('title') == "Request Status") {
					setSimpleNoSelectFilters($(filterType), filterInfo.option);
				}

				// from popover "Dynamic"
				else if (filterTypeElem.parent('a').attr('data-dynamic') === 'true') {
					setDynamicFilters($(filterType), filterInfo.option);
				}
			});
		}

		/*function setMultiSelects(multiSelct, option) {
			var options = multiSelct.find('option'), optionValues = [], updatedValues = [];

			$(options).each(function () {
				var val = $(this).val();
				optionValues.push(val);
			});

			console.log('target', multiSelct);
			console.log('optionValues', optionValues);

			optionValues.forEach(function (optionTxt, index) {
				if ($.isArray(option)) {
					console.log(option);
					option.filter(function (val) {
						if (val == optionTxt) {
							updatedValues.push(index);
						}
					})
				}
				else {
					if (option == optionTxt) {
						updatedValues.push(index);
					}
				}
			});

			$(multiSelct).data('trigger', 'dynamic');

			updatedValues.forEach(function (i, index) {
				i = i + 1; // "all" option is not accounted as option;
				// $(multiSelct).off('change').multipleSelect('setSelects', [i]);
				addSelectedClass(multiSelct, i); //!important - class is not added when select is triggered programatically
			});
		}*/

		function setSimpleNoSelectFilters(multiSelct, options) {
			$(multiSelct).find('li').each(function () {
				var $li = $(this);

				//$li.removeClass('active-item-bg'); // there are some of this filters have class from source code;

				options.forEach(function (option) {
					if (!!$li.find('a[title="' + option + '"]').length) {
						$li.addClass('active-item-bg');
					}
				})
			})
		}

		function setDynamicFilters(multiSelct, options) {
			var $li = $(multiSelct).closest('li'), $select = $li.find('select');

			if(options.length) {
				options.forEach(function (option) {
					$select.append('<option value="' + option.value + '" data-name="' + option.name + '">' + option.name + '</option>');
				});

				$li.addClass('active-item-bg');
			}
		}

		/*function addSelectedClass(multiSelect, index) {
			var parentTag = multiSelect.closest('li');
			var $li = multiSelect.next().find('.ms-drop li');
			var $liSelected = $li.eq(index);
			$liSelected.addClass('selected');
			$liSelected.find('input').prop('checked', true);
			if ($liSelected.parents('.sub-nav').length == 0) { // prevent "More Filter" issue with bg.
				parentTag.addClass('active-item-bg');
			}
		}*/

		return {
			typeOfFilter: typeOfFilter
		}
	}

	function init(filterObj) {
		activeFilters = processActiveFilters(filterObj);
		activeFilters.typeOfFilter();
	} // end of init

	// call ribbonListener

	return {
		init: init,
		findActiveFilters: findActiveFilters
	}
}();

var ribbonListener = function () {
	/* Private Variables */
	var ribbonReqObj = {}, isDoneLoading = false; // it gets set by kendo Grid on Databound

	/* -----> Private Methods <-----*/
	function rebuildRibbonState($rbWrapper) {
		var $filter = $($rbWrapper).find('[data-isFilter=true]');
		ribbonReqObj = {};
		isDoneLoading = false;
		return filtersCollection($filter);
	}

	// Internal methods to handle filters by type:
	function handleMultiSelect($multiSelect, filterType) {
		var parentTag = $multiSelect.closest('li');

		if ($multiSelect.data('title') !== null || $multiSelect.data('title') !== undefined) {
			ribbonReqObj[$multiSelect.data('title')] = [];
		}
		else {
			console.error('Undefined filter title');
		}

		$multiSelect.next().find('.ms-drop li').each(function () {
			var $li = $(this), option = {};

			option.isSelected = function () {
				if ($li.hasClass('selected')) {
					if ($li.parents('.sub-nav').length) { // prevent "More Filter" issue with bg.
						$('#sq-filters-item').addClass('active-item-bg');
					}
					else {
						parentTag.addClass('active-item-bg');
					}

					return true;
				}
				else {
					return false;
				}
			}();// end of is selected

			option.value = $li.find('input').attr('value'); // end of value

			option.text = $li.find('label').text(); // end of text

			option.type = filterType;

			ribbonReqObj  [$multiSelect.data('title')].push(option);
		});
	}

	function handleDefaultSelect(defaultSelect, filterType) {
		if (defaultSelect.data('title') !== null || defaultSelect.data('title') !== undefined) {
			ribbonReqObj[defaultSelect.data('title')] = [];
		}
		else {
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
		var $thisModal = $(whichModal), option = {};

		ribbonReqObj[$thisModal.data('title')] = [];

		option.value = $thisModal.find('div:first-child').attr('filterid');
		option.text = $thisModal.find('div:first-child').text();
		option.isSelected = (typeof option.value != 'undefined' && option.value != '');
		option.type = filtertype;

		if(option.isSelected) {
			if ($thisModal.parents('.sub-nav').length) { // prevent "More Filter" issue with bg.
				$('#sq-filters-item').addClass('active-item-bg');
			}
			else {
				$thisModal.parents('li').addClass('active-item-bg');
			}
		}

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
			});
			tempArr.push(option);
			ribbonReqObj  [prTitle] = tempArr;
		} else {
			ribbonReqObj  [prTitle].push(option); // if option does not exist simple add option
		}

	}

	function handleDynamicSelect(fromPopup, filterType) {
		var filterTitle = $(fromPopup).find('[data-title]').data('title'),
				$dynamicSelectElem = $(fromPopup).siblings('.dynamic-select');

		// add filter to object
		if (filterTitle !== null || filterTitle !== undefined) {
			ribbonReqObj[filterTitle] = [];
		}

		// check if select exist
		if ($dynamicSelectElem.length > 0) {
			if($dynamicSelectElem.find('option').length) {
				$(fromPopup).parent().addClass('active-item-bg');

				$dynamicSelectElem.find('option').each(function () {
					var $option = $(this), option = {};

					option.text = $option.text();
					option.value = $option.attr('value');
					option.name = $option.data('name');
					option.type = filterType;
					option.isSelected = true;

					ribbonReqObj[filterTitle].push(option);
				});
			}
			else {
				//$(fromPopup).parent().removeClass('active-item-bg');
			}
		}
	}

	function viewsSectionLogic() {
		//local variables
		var $checkBoxes = $('#views').find('.ms-drop').find('input'), views = {active: ''};

		function bindViewChanges() {
			$('#views').on('change.views', $checkBoxes, function (e) {
				e.preventDefault();
				var $selected = $(e.target);

				if ($selected.is('select')) {
					views.clicked = getView($selected);
					if (views.clicked === views.active) {
						if ($($selected).multipleSelect('getSelects') == 0) { // test if user is clearing all options
							selectOppositeView(getView($selected));
						}
						else {
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
			}
			else {
				var oppositeView = (title == 'My Work') ? 'All Teams' : 'My Work',
					$selectOff = $('#views').find('select[data-title="' + oppositeView + '"]');

				$selectOff.data('trigger', 'dynamic');
				// $('#views').off('.views'); // need to unbind original .on to prevent cycle
				views.active = title;
				$('#views').off('.views'); // turn off bind to prevent a infinite change cycle
				$selectOff.multipleSelect('setSelects', []);
				$selectOff.parent('li').removeClass('active-item-bg');
				bindViewChanges(); //turn on binding again
			}

		}

		function getView(target) {
			var title = $(target).data('title');
			$(target).parent('li').addClass('active-item-bg');
			return title;
		} // finds clicked filter by title

		// bind view selects
		bindViewChanges()
	}

	function isFilterSecMultSelect(test) {
		var $multiselect = $('#filters-section').find('select[multiple="multiple"]'), isFilter = false;

		$multiselect.each(function () {
			var title = $(this).data('title');
			if (test === title) {
				isFilter = true;
			}
		});

		return isFilter;
	}

	/*function onCloseMultiSelectFilter($clicked) {
		!!isFilterSecMultSelect($clicked) && rebuildRibbonState('.sq-top-ribbon');
	}*/

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

		};

		function ISobjBuilder() {
			this.addProperty = function (propertyName, values) {
				ISribbonObj[propertyName] = values;
			};

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
									name: option.name
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

			return IsObj;
		}

	}

	/* -----> Public functions <-----*/

	// create ribbonReqObj   filters object
	function filtersCollection($filter) {
		$filter.each(function() {
			if($(this).parents('#sq-filters-item').length) {
				$('#sq-filters-item').removeClass('active-item-bg');
			}
			else {
				$(this).parents('li').removeClass('active-item-bg');
			}
		});

		// Iterate filters by type:
		$filter.each(function () {
			// Filter Types
			if ($(this).attr('multiple')) { // check for multiselect
				handleMultiSelect($(this), 'array-list');
			}
			else if ($(this).attr('data-select') === "default") { // check for default select elem
				handleDefaultSelect($(this), 'array-list');
			}
			else if ($(this).attr('data-dynamic') === "true") {
				handleDynamicSelect($(this), 'userType');
			}
			else if ($(this).attr('filter-type') === 'from-modal') {
				handleValueFromModal($(this), 'array-list'); // Array-list is set as it will be process as an arrary for ISobj
			}
			else if ($(this).find('select').length == 0) {  //check for filter options without select elem
				handleNoSelectFilters($(this), 'boolean');
			}
		});

		ribbonWidgets.filterCollectorModule();

		$.cookie("SQFilterSettings", ribbonListener.getISobj(), {path:'/'});

		// Will trigger IS function passed as argument in the init
		initISfunc.run();

		return ribbonReqObj;
	}

	// add listener to filters, triggers IS function
	function filterListener($rbWrapper) {
		var isTimerRunning = false, ifMultipleClicks = "", isLoop = 0;

		// on select change event
		/*ribbonElem.on('change', 'select', function(event) {
			// test if trigger is multiselect from filter section
			event.preventDefault();
			var $target = $(event.target);
			var filterRibonTriggered = $target.data('trigger');
			if (isFilterSecMultSelect($target.data('title'))) {
				if (filterRibonTriggered !== 'dynamic') {
					return;
				}
				else {
					if (isLoop > 0) {
						isLoop = 0;
						return;
					}
					$target.data('trigger', '');
					isLoop++;
				}
			}



			if (isTimerRunning) {
				clearTimeout(ifMultipleClicks);
			}
			// delay to allow for fast multiple clicking on a filter
			ifMultipleClicks = setTimeout(function () {
				// rebuild ribbonReqObj   filters state
				rebuildRibbonState($rbWrapper);
				isTimerRunning = true;
			}, 500);
		});*/
		
		// on click event for li with now select
		$('#agile-status').on('click', 'a', function(e) {
			e.preventDefault();

			if(!$('#agile-status').hasClass('disabled')) {
				toggleActiveItem($(this).parent('li')); // function comes from single-queue.js
				// rebuild ribbonReqObj   filters state
				rebuildRibbonState($rbWrapper);
			}
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
		var $filter = ribbonElem.find('[data-isFilter=true]'); // variable will be moved when ribbon gets integrated with pages.

		getISfunction(ISprocess);
		filtersCollection($filter);
		filterListener(ribbonElem);
		viewsSectionLogic();
	}

	/* -----> API -- */
	return {
		isDoneLoading: isDoneLoading,
		init: init,
		rebuildRibbonState: rebuildRibbonState,
		//onCloseMultiFilter: onCloseMultiSelectFilter,
		passFilterStateObj: passFilterStateObj,
		isFilterSecMultSelect: isFilterSecMultSelect,
		getISobj: getISobj
	}

}();

var ribbonWidgets = function () {
	function filterCollectorModule() {
		var filterObj = ribbonListener.passFilterStateObj(), filterCollectorElem = $('.filter-collector');

		// Clear filter collector area
		filterCollectorElem.html('');

		function findActiveFilters() {
			var activeFilters = {};

			$.each(filterObj, function (filter, options) {
				if (Array.isArray(options)) {
					options.forEach(function (option) {
						if (option.isSelected == true) {
							if (filter in activeFilters) {
								activeFilters[filter].push(option);
							}
							else {
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
			//filterCollectorElem.append('<ul><li class="h3" style="font-weight: 700;">Filters:</li></ul>');
			filterCollectorElem.append('<span class="h3">Filters:</span>');
			filterCollectorElem.append('<ul><li>Clear All Filters <a href="#" data-action="clear-cookie"> X</a></li></ul>');
			var filterHtml = '', activeArr = [];

			$.each(activeFilters, function (filter, options) {
				// if it is a multiselect from Filters area
				// do not add cross and anchor to options
				filterHtml = String()
						+ '<ul>'
						+ '<li>' + filter + '<a href="#"> X</a></li>';
				if (Array.isArray(options)) {
					options.forEach(function (option) {
						filterHtml = filterHtml + '<li><span>' + option.text + '</span></li>';
					});
				}
				filterHtml = filterHtml + '</ul>';
				activeArr.push(filterHtml);
			});
			var cleanFilters = activeArr.join(' ');
			filterCollectorElem.append(cleanFilters);
		}

		// Remove Filters
		function setXTrigger() {
			// helping functions
			function updateMultiSelect(filterType, option) {
				var updatedValues = [];
				if (option === undefined) {  // Process for removing whole filter
					$(filterType).data('trigger', 'dynamic');
					$(filterType).multipleSelect('setSelects', []);

				}
				else { // Process to remove single option
					var optionValues = $(filterType).multipleSelect('getSelects'),
							optionTxt = $(filterType).multipleSelect('getSelects', 'text');
					optionTxt.forEach(function (optionTxt, index) {
						if (option == optionTxt) {
							updatedValues = optionValues.splice(index, 1);
						}
					});
					$(filterType).data('trigger', 'dynamic');
					$(filterType).multipleSelect('setSelects', optionValues);
				}
			}

			function updateDefaultSelect(filterType) {
				$('#dp-sprint-dd').val(''); // default to "All Sprints" --
			}

			function updateDynamicSelect(filterType, option) {
				var $filterWrap = $(filterType).parent('a');

				if (option === undefined) {
					//$filterWrap.parent().removeClass('active-item-bg');
					$filterWrap.siblings('select').html(''); // Remove all options
					$(filterType).text($(filterType).data('title'));
				}
				else {
					$filterWrap.parent().addClass('active-item-bg');
					$filterWrap.siblings('select option').each(function () {
						if ($(this).text() == option) {
							$(this).remove();
							//editCountToLabel(filterType);
						}
					})
				}
			}

			function updateOptionFromModal(filterType) {
				var $thisModal = $(filterType);
				$thisModal.find('div:first-child').attr('filterid', '');
				$thisModal.find('div:first-child').html('<span>' + $thisModal.data('title') + '</span>');
			}

			function updateNoSelectFilters(filterType, option) {
				if (option == undefined) {
					/*$(filterType).find('li').each(function () {
						$(this).hasClass('active-item-bg') ? $(this).removeClass('active-item-bg') : false; // Clear all items
					});*/
				}
				else {
					/*$(filterType).find('li').each(function () {
						if ($(this).find('a span:last-child').text() == option) {
							$(this).removeClass('active-item-bg'); // clear only option clicked
						}
					});*/
				}
			}

			function findFilterTitle(clickedElm) {
				var filterUl = $(clickedElm).closest('ul'),
						filterTxt = filterUl.find('li').eq(0).text(),
						filterTile = cleanFilterTxt(filterTxt);
				return filterTile;
			}

			function findOptionTxt(clickedElm) {
				return $(clickedElm).siblings('span').text();
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
						//tagTxt = tagTxt + ' (' + optionCount + ')';
						$(filterType).text(tagTxt);
					}
					else {
						$(filterType).text(tagTxt);
					}
				}
				else {
					//tagTxt = tagTxt + ' (' + optionCount + ')';
					$(filterType).text(tagTxt);
				}

			}

			function whichFilterType(filterType, option) {
				if($(filterType).parents('#sq-filters-item').length) {
					$('#sq-filters-item').removeClass('active-item-bg');
				}
				else {
					$(filterType).parents('li').removeClass('active-item-bg');
				}

				// which type of fiter is it
				if ($(filterType).attr('multiple')) { // check for multiselect
					updateMultiSelect($(filterType), option);
				}
				else if ($(filterType).attr('data-select') === "default") { // check for default select elem
					updateDefaultSelect($(filterType));
				}
				else if ($(filterType).parent('a').attr('data-dynamic') === 'true') {
					updateDynamicSelect($(filterType), option);
				}
				else if ($(filterType).attr('filter-type') === "from-modal") {
					updateOptionFromModal($(filterType));
				}
				else if ($(filterType).find('select').length == 0) {  //check for filter options without select elem
					updateNoSelectFilters($(filterType), option);
				}
			}

			// Register Events and trigger responses
			if(!filterCollectorElem.data('initialize')) {
				filterCollectorElem.data('initialize', true);

				filterCollectorElem.on('click', 'a', function (e) {
					e.preventDefault();

					if($(this).data('action') == 'clear-cookie') {
						initRibbon.findActiveFilters(ribbonWidgets.userPreferences());
						ribbonListener.rebuildRibbonState('.sq-top-ribbon');

						return;
					}

					// Prevent loop between ribbon and filter collection area

					var filterType = findFilterTitle($(this)),
						$dataTitle = ribbonElem.find('[data-title="' + filterType + '"]'); // needed as there may be additional data-title with same value

					// if clicked on grouping filter
					if ($(this).siblings('span').length > 0) {
						var optionTxt = findOptionTxt($(this));
						whichFilterType($dataTitle, optionTxt); // determine which filter type and remove option
					}
					else {
						whichFilterType($dataTitle); // determine and remove whole filter type
					}

					ribbonListener.rebuildRibbonState(ribbonElem);
				});
			}
		}

		buildTmpl(findActiveFilters());
		setXTrigger();
	}

	function getUserPreferences() {
		var obj = {};

		if($.isEmptyObject(UserPreferences)) {
			obj.MyWork = [1,2];
			obj.RequestStatusIdea = true;
			obj.RequestStatusBacklog = true;
			obj.RequestStatusStarted = true;
		}
		else {
			if (UserPreferences.MyWorkList != null) {
				if(UserPreferences.RQL_ViewPreference == 'All Team') {
					obj.AllTeams = UserPreferences.MyWorkList;
				}
				else {
					obj.MyWork = UserPreferences.MyWorkList;
				}
			}

			if (UserPreferences.DepartmentList != null) {
				obj.Departments = UserPreferences.DepartmentList;
			}

			if (UserPreferences.RequestStatusList != null) {
				$.each(UserPreferences.RequestStatusList, function(indx, val) {
					obj['RequestStatus' + requestStatuses[val].charAt(0).toUpperCase() + requestStatuses[val].substr(1)] = true;
				});
			}
		}

		return obj;
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
		moreFiltersPopover: moreFiltersPopover,
		userPreferences: getUserPreferences
	}

}();

function toggleActiveItem(elem) {
	$(elem).toggleClass('active-item-bg').end().removeClass('disable-hover');

	if ($(elem).attr('id') == 'sq-filters-item') {
		moreFiltersElem.removeClass('add-bg');
	}
}

function doSearch() {
	var GridType = $('#GridType').val(), searchFilterElem = $('.search-filter-collector'), searchField = $('#search-query');

	query = searchField.val().trim();

	if(query == '') {
		return;
	}

	searchField.val('');

	if(GridViewType == 'calendar') {
		ReloadCalendar();
	}
	else if(GridViewType == 'list' || GridViewType == 'list-edit') {
		ReloadGrid(0);
	}
	else if(GridViewType == 'list-edit-legacy') {
		//$("#GridRequestLegacyEdit").data("kendoGrid").refresh();
		ReloadLegacyRequestsGrid();
	}

	var ribbonLis = ribbonElem.find('> ul').find('> li');

	filterStatus(false);

	$('.filter-collector').hide();
	searchFilterElem.find('span').text(query).end().show();
	
	if(!searchFilterElem.data('initialize')) {
		searchFilterElem.on('click', 'a', function(e) {
			e.preventDefault();

			query = '';
			filterStatus(true);

			$('.filter-collector').show();
			searchFilterElem.hide();

			if(GridViewType == 'calendar') {
				ReloadCalendar();
			}
			else if(GridViewType == 'list' || GridViewType == 'list-edit') {
				ReloadGrid(0);
			}
			else if(GridViewType == 'list-edit-legacy') {
				ReloadLegacyRequestsGrid();
			}
		});

		searchFilterElem.data('initialize', true);
	}

	function filterStatus(enable) {
		ribbonLis.each(function(i) {
			if(i) {
				if(enable) {
					$(this).removeClass('disabled');
				}
				else {
					$(this).addClass('disabled');
				}
			}
		});

		ribbonElem.find('select').each(function() {
			if($(this).attr('multiple') == 'multiple') {
				if(enable) {
					$(this).multipleSelect('enable');
				}
				else {
					$(this).multipleSelect('disable');
				}
			}
		});
	}
}

$(function () {
	ribbonElem = $('.sq-top-ribbon');
	moreFiltersElem = $('#sq-filters');

	//Remove [All] option under sprint
	/*if($('#dp-sprint-dd').find('option:eq(0)').val() == '') {
		$('#dp-sprint-dd').find('option:eq(0)').remove();
	}*/

	var ribbonItem = ribbonElem.find('> ul > li > ul > li');

	$('body').on('click', function (e) {
		moreFiltersElem.removeClass('open');

		/*close any open popover when click elsewhere*/
		if ($(e.target).parent().find('.toggle-popover').length > 0) {
			$('.toggle-popover').popover('hide');
		}
	});

	// prevent propagation on multi-select under sub nav
	moreFiltersElem
		.on('click', '.ms-drop input, .ms-drop label', function(e) {
			e.stopPropagation();
		})
		.on('click', function(e) {
			e.stopPropagation();
			e.preventDefault();

			if(!$(this).parents('.disabled').length) {
				//Do not toggle if clicking anywhere in the dropdown.
				if ($(e.target).parents('.sub-nav-wrapper').length) {
					return false;
				}

				$(this).toggleClass('open');
			}
		});

	//Initialize multiple select for ribbon area
	ribbonElem.find('select').each(function() {
		if ($(this).attr('multiple') == 'multiple') {
			var id = $(this).attr('id'), title = $(this).data('title'), obj = {
				placeholder: title,
				minimumCountSelected: 0,
				countSelected: title,
				selectAllText: $(this).data('select-all-text'),
				allSelected: title,
				maxHeight: 240,
				onClose: function () {
					var currentValues = this.target.multipleSelect('getSelects');
					//$target = this.title
					//Check if the value has changed. If changed, call onCloseMultiFilter method.
					if($(this.previousValues).not(currentValues).length !== 0 || $(currentValues).not(this.previousValues).length !== 0) {
						//ribbonListener.onCloseMultiFilter($target);
						ribbonListener.rebuildRibbonState('.sq-top-ribbon');
					}
				},
				onOpen: function (elem) {
					this.target = $(elem).parent().prev();
					this.previousValues = this.target.multipleSelect('getSelects');

					var nextElem = $(elem).next(), ul = nextElem.find('ul');

					if(!nextElem.find('.btn').length) {
						nextElem.append('<div class="mt-10 mb-10 text-right"><button class="btn btn-default mr-10">Reset</button><button class="btn btn-primary mr-10">Apply</button></div>');

						nextElem.on('click', '.btn-default', function() {
							$(elem).parents('.ms-parent').prev().multipleSelect('uncheckAll');
						});

						nextElem.on('click', '.btn-primary', function() {
							$(this).parents('.ms-parent').prev().multipleSelect('close');
						});
					}

					//fix for bg toggle issue when multiple select clicked
					ribbonItem.off('click');

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
						if ($(elem).parents('.table-responsive').offset().top + $(elem).parents('.table-responsive').outerHeight(true) < nextElem.offset().top + nextElem.find('ul').outerHeight(true)) {
							nextElem.css({'top': ' -90px', 'box-shadow': '0 -4px 5px rgba(0,0,0,0.15)'});
						}
						else {
							nextElem.css({'top': ' 100%', 'box-shadow': '0 4px 5px rgba(0,0,0,0.15)'});
						}
					} else {
						nextElem.css({'top': ' 100%', 'box-shadow': '0 4px 5px rgba(0,0,0,0.15)'});
					}

					var selectTagElem = $(elem).parent().prev().get(0);

					//Close all other multiselect dropdown
					ribbonElem.find('select').each(function() {
						if (selectTagElem != this && $(this).attr('multiple') == 'multiple') {
							var elem = $(this).next();

							elem.find('.ms-choice').find('> div').removeClass('open').end().next().hide();
						}
					});
				}
			};

			if ($.inArray(id, ['dp-team-dd', 'dp-mywork-dd']) > -1) {
				obj.width = 80;
			}
			else if (id == 'dp-sprint-dd') {
				$.extend(obj, {
					width: 60,
					selectAll: false
				});
			}
			else if ($.inArray(id, ['priority-dd', 'region-dd', 'route-to-market-dd']) > -1) {
				obj.width = 223;
			}
			else if ($(this).parents('#filters-section').length) {
				obj.width = 100;
			}

			$(this).multipleSelect(obj);
		}
	});

	//Retrieve session cookie for filters.
	(function() {
		var sessionFilterSettings = $.cookie("SQFilterSettings");

		if(sessionFilterSettings) {
			initRibbon.findActiveFilters($.parseJSON(sessionFilterSettings));
		}
		else {
			initRibbon.findActiveFilters(ribbonWidgets.userPreferences());
		}
	})();

	ribbonElem.addClass('initialized');
});