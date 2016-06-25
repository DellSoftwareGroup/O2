/*function ribbon_change(obj) {
 console.log('from IS form: ', obj);
 }*/

// Extend String - Capitalize method
String.prototype.capitalize = function () {
	if (this.length > 0) {
		return this.charAt(0).toUpperCase() + this.slice(1);
	}
};

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
		var whichFilter = $.trim(filterType.data('title'));

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
			ribbonElem.find('.active-item-bg').removeClass('active-item-bg');

			$filters.forEach(function (filterType) {
				var filterInfo = getFilterInfo(filterType);

				// If multiSelect filter typ
				if (filterType.attr('multiple')) { // check for multiselect
					//setMultiSelects($(filterType), filterInfo.option);
					filterType.multipleSelect('setSelects', filterInfo.option);

					if(filterInfo.option.length) {
						if(filterType.parents('#sq-filters-item').length) {
							$('#sq-filters-item').addClass('active-item-bg');
						}
						else {
							filterType.parents('li').addClass('active-item-bg');
						}
					}
				}

				// If no dropdown or input text filter (e.g Request Status)
				else if (filterType.data('title') == "Request Status") {
					setSimpleNoSelectFilters(filterType, filterInfo.option);
				}

				// from popover "Dynamic"
				else if (filterType.parent('a').attr('data-dynamic') === 'true') {
					setDynamicFilters(filterType, filterInfo.option);
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
		var arr = [];

		$multiSelect.find('option').each(function() {
			var isSelected = false;

			if($(this).prop('selected')) {
				setActiveFilter($multiSelect);
				isSelected = true;
			}

			arr.push({
				type: filterType,
				isSelected: isSelected,
				value: $(this).attr('value'),
				text: $(this).text()
			});
		});

		return arr;
	}

	function handleDefaultSelect(defaultSelect, filterType) {
		var arr = [];

		defaultSelect.find('option').each(function () {
			var $option = $(this);

			arr.push({
				text: $option.text(),
				value: $option.attr('value'),
				type: filterType,
				isSelected: $option.prop('selected')
			});
		});

		return arr;
	}

	function handleValueFromModal(whichModal, filterType) {
		var arr = [], option = {
			value: whichModal.find('div:first-child').attr('filterid'),
			text: whichModal.find('div:first-child').text(),
			type: filterType
		};

		option.isSelected = function() {
			if(typeof option.value != 'undefined' && option.value != '') {
				setActiveFilter(whichModal);
				return true;
			}

			return false;
		}();

		arr.push(option);

		return arr;
	}

	function handleNoSelectFilters(noSelect, filterType) {
		return {
			text: noSelect.find('a span:last-child').text(),
			value: "no value assigned",
			type: filterType,
			isSelected: noSelect.hasClass('active-item-bg') ? true : false
		};
	}

	function handleDynamicSelect(fromPopup, filterType) {
		var arr = [], $dynamicSelectElem = fromPopup.siblings('.dynamic-select');

		// check if select exist
		if ($dynamicSelectElem.length > 0) {
			if($dynamicSelectElem.find('option').length) {
				fromPopup.parent().addClass('active-item-bg');

				$dynamicSelectElem.find('option').each(function () {
					var $option = $(this);

					arr.push({
						text: $option.text(),
						value: $option.attr('value'),
						name: $option.data('name'),
						type: filterType,
						isSelected: true
					});
				});
			}
		}

		return arr;
	}

	function viewsSectionLogic() {
		//local variables
		var $checkBoxes = $('#views').find('.ms-drop').find('input'), views = {active: ''};

		function bindViewChanges() {
			$('#views').on('change.views', $checkBoxes, function(e) {
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
					}
					else { // user is selecting from a different view - clear opposite view
						if ($($selected).multipleSelect('getSelects') == 0) { // helps prevent posible infinite loop by changes from filter section (below ribbon)
							return;
						}

						clearOppositeView(getView($selected))
					}
				}
			});

			views.active = $('#views').find('.active-item-bg').find('> select').data('title');
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
			$(target).parent('li').addClass('active-item-bg');

			return $(target).data('title');
		} // finds clicked filter by title

		// bind view selects
		bindViewChanges();
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

	function setActiveFilter(target) {
		if (target.parents('.sub-nav').length) { // prevent "More Filter" issue with bg.
			$('#sq-filters-item').addClass('active-item-bg');
		}
		else {
			target.closest('li').addClass('active-item-bg');
		}
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
	function getISobj(uiObj, raw) {
		var ISribbonObj = {}, obj = (uiObj == undefined) ? ribbonReqObj : uiObj;

		raw = raw || false;

		function ISobjBuilder() {
			this.addProperty = function (propertyName, values) {
				ISribbonObj[propertyName] = values;
			};

			this.fixedPropertyName = function(title, option) {
				var fixedTitle = '';

				if (typeof option !== "undefined") {
					title = title + ' ' + option;
				}
				if (title.indexOf(' ') > 0) {
					var titleArr = title.split(' ');
					titleArr.forEach(function(word) {
						if (typeof word == 'string') {
							fixedTitle = fixedTitle + word.capitalize();
						}
					});
				}

				else {
					if (typeof title == 'string') {
						fixedTitle = title.capitalize();
					}
				}
				return fixedTitle;
			};
		} // end of ISobjBuilder

		function buildObj(obj) {
			$.each(obj, function(title, valueObj) {
				var numValues = [], activeOptions = [], objValue = [];

				// test is there is active and what type of value this filter has
				if (Array.isArray(valueObj) && valueObj.length > -1) {
					valueObj.forEach(function(option) {
						if (option.isSelected === true) {
							// what type of value
							if (option.type == 'array-list') {
								numValues.push(option.value); // if is a number it is a dropdown
							}
							else if (option.type == 'boolean') {
								activeOptions.push(option.text);
							}
							else if (option.type === 'userType') { // there could not be other case but we are checking for undefined.
								objValue.push({
									value: option.value,
									name: option.name
								});
							}
						}
					});

					if (numValues.length > 0) {
						isDropDown(title, numValues);
					}
					else if (activeOptions.length > 0) {
						noDropDown(title, activeOptions);
					}
					else if (objValue.length > 0) {
						isdynamicFilter(title, objValue);
					}
				}
			});
		}

		function isDropDown(title, values) {
			var buildObj = new ISobjBuilder();

			buildObj.addProperty(buildObj.fixedPropertyName(title), values); // array with values only
		}

		function noDropDown(title, options) {
			var buildObj = new ISobjBuilder();

			options.forEach(function (optionName) {
				buildObj.addProperty(buildObj.fixedPropertyName(title, optionName), true);
			});
		}

		function isdynamicFilter(title, options) {
			var buildObj = new ISobjBuilder();

			buildObj.addProperty(buildObj.fixedPropertyName(title), options);
		}

		// check object is not empty
		if ($.isEmptyObject(obj)) {  // IS may call the function with and empty object
			console.error('empty object -- see func isdynamicFilter');
			return false;
		}
		else {
			// Call to build object
			buildObj(obj);

			if(!raw) {
				$.each(ISribbonObj, function(n, v) {
					if(n == 'Sprint') {
						ISribbonObj[n] = (function() {
							var allSprintSelected = false, unassignedSprintSelected = false;

							var newArr = ISribbonObj[n].filter(function(value, index, arr) {
								if(value == '') {
									allSprintSelected = true;
								}
								else if(value == 'UNASSIGNED') {
									unassignedSprintSelected = true;
								}
								else if(allSprintSelected && value != 'UNASSIGNED') {
									return false;
								}

								return true;
							});

							if(allSprintSelected) {
								if(unassignedSprintSelected) {
									return null;
								}
								else {
									newArr[0] = null;
								}
							}

							return newArr;
						})();

						if(ISribbonObj[n] === null) {
							delete ISribbonObj[n];
						}
					}
					else if(n == 'Departments') {
						if(ribbonReqObj[n].length === v.length) {
							ISribbonObj[n] = [null];
						}
					}
				});
			}

			return ISribbonObj;
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
			var title = $(this).data('title') || $(this).parents('li').data('title');

			if(typeof ribbonReqObj[title] == 'undefined' && (title !== null || title !== undefined)) {
				ribbonReqObj[title] = [];
			}

			// Filter Types
			if ($(this).attr('multiple')) { // check for multiselect
				ribbonReqObj[title] = handleMultiSelect($(this), 'array-list');
			}
			else if ($(this).attr('data-select') === "default") { // check for default select elem
				ribbonReqObj[title] = handleDefaultSelect($(this), 'array-list');
			}
			else if ($(this).attr('data-dynamic') === "true") {
				ribbonReqObj[title] = handleDynamicSelect($(this), 'userType');
			}
			else if ($(this).attr('filter-type') === 'from-modal') {
				ribbonReqObj[title] = handleValueFromModal($(this), 'array-list'); // Array-list is set as it will be process as an arrary for ISobj
			}
			else if ($(this).find('select').length == 0) {  //check for filter options without select elem
				ribbonReqObj[title].push(handleNoSelectFilters($(this), 'boolean'));
			}
		});

		ribbonWidgets.filterCollectorModule();

		//Save filter preference
		$.cookie("SQFilterSettings", JSON.stringify(ribbonListener.getISobj(undefined, true)), {path:'/'});

		// Will trigger IS function passed as argument in the init
		initISfunc.run();

		return ribbonReqObj;
	}

	// add listener to filters, triggers IS function
	function filterListener($rbWrapper) {
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

		function findActiveFilters() {
			var activeFilters = {};

			$.each(filterObj, function (filter, options) {
				if (Array.isArray(options)) {
					options.forEach(function (option) {
						if (option.isSelected) {
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
			// Clear filter collector area
			filterCollectorElem.html('');

			// append filter tag:
			filterCollectorElem.append('<span class="h3">Filters:</span>');
			filterCollectorElem.append('<ul><li>Clear All Filters <a href="#" data-action="clear-cookie"> X</a></li></ul>');
			var filterHtml = '', activeArr = [];

			$.each(activeFilters, function (filter, options) {
				// if it is a multiselect from Filters area
				// do not add cross and anchor to options
				filterHtml = String()
						+ '<ul>'
						+ '<li>' + filter + '<a href="#" data-title="' + filter + '"> X</a></li>';
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

		function buildTmplNew(activeFilters) {
			filterCollectorElem.addClass('new');
			filterCollectorElem.find('> ul').empty();

			// append filter tag:
			filterCollectorElem.find('> ul').append('<li><span>Clear All Filters <a href="#" data-action="clear-cookie"> X</a></span><div>This will clear all filters and restore to your user preference.</div></li>');

			var filterHtml = '';

			$.each(activeFilters, function (filter, options) {
				// if it is a multiselect from Filters area
				// do not add cross and anchor to options
				filterHtml = '<li><span>' + filter + '<a href="#" data-title="' + filter + '"> X</a></span>';

				if (Array.isArray(options)) {
					filterHtml += '<div>';

					options.forEach(function (option) {
						filterHtml += '<span>' + option.text + '</span>';
					});

					filterHtml += '</div>';
				}

				filterHtml += '</li>';

				filterCollectorElem.find('> ul').append(filterHtml);
			});
		}

		// Remove Filters
		function setXTrigger() {
			// helping functions
			function updateMultiSelect(filterType, option) {
				if (option === undefined) {  // Process for removing whole filter
					$(filterType).data('trigger', 'dynamic').multipleSelect('setSelects', []);
				}
				else { // Process to remove single option
					var updatedValues = [],
						optionValues = $(filterType).multipleSelect('getSelects'),
						optionTxt = $(filterType).multipleSelect('getSelects', 'text');

					optionTxt.forEach(function (optionTxt, index) {
						if (option == optionTxt) {
							updatedValues = optionValues.splice(index, 1);
						}
					});

					$(filterType).data('trigger', 'dynamic').multipleSelect('setSelects', optionValues);
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
				if(filterType.parents('#sq-filters-item').length) {
					$('#sq-filters-item').removeClass('active-item-bg');
				}
				else if(filterType.parents('li').length) {
					filterType.parents('li').removeClass('active-item-bg');
				}
				else {
					filterType.find('.active-item-bg').removeClass('active-item-bg');
				}

				// which type of fiter is it
				if (filterType.attr('multiple')) { // check for multiselect
					updateMultiSelect(filterType, option);
				}
				else if (filterType.attr('data-select') === "default") { // check for default select elem
					updateDefaultSelect(filterType);
				}
				else if (filterType.parent('a').attr('data-dynamic') === 'true') {
					updateDynamicSelect(filterType, option);
				}
				else if (filterType.attr('filter-type') === "from-modal") {
					updateOptionFromModal(filterType);
				}
				/*else if (filterType.find('select').length == 0) {  //check for filter options without select elem
					updateNoSelectFilters(filterType, option);
				}*/
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

					var filterType = $(this).data('title'),
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

				if(location.search == '?v2') {
					filterCollectorElem.popover({
						html: true,
						placement: 'bottom',
						selector: 'li',
						trigger: 'hover',
						viewport: '.filter-collector',
						title: '',
						content: function() {
							return $(this).find('> div').html();
						}
					});
				}
			}
		}

		if(location.search == '?v2') {
			buildTmplNew(findActiveFilters());
		}
		else {
			buildTmpl(findActiveFilters());
		}

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
	searchFilterElem.find('.search-query-display').text(query).end().show();
	
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

	ribbonElemMS = ribbonElem.find('select').filter('[multiple=multiple]');

	//Initialize multiple select for ribbon area
	ribbonElemMS.each(function() {
		var title = $(this).data('title');

		$(this).multipleSelect({
			placeholder: title,
			minimumCountSelected: 0,
			countSelected: title,
			selectAllText: $(this).data('select-all-text'),
			allSelected: title,
			maxHeight: 240,
			onClose: function() {
				var currentValues = this.target.multipleSelect('getSelects');
				//$target = this.title
				//Check if the value has changed. If changed, call onCloseMultiFilter method.
				if ($(this.previousValues).not(currentValues).length !== 0 || $(currentValues).not(this.previousValues).length !== 0) {
					//ribbonListener.onCloseMultiFilter($target);
					ribbonListener.rebuildRibbonState('.sq-top-ribbon');
				}
			},
			onOpen: function(elem) {
				this.target = $(elem).parent().prev();
				this.previousValues = this.target.multipleSelect('getSelects');

				var nextElem = $(elem).next(), ul = nextElem.find('ul');

				if (!nextElem.find('.btn').length) {
					nextElem.append('<div class="mt-10 mb-10 text-right"><button class="btn btn-default mr-10">Reset</button><button class="btn btn-primary mr-10">Apply</button></div>');

					nextElem.on('click', '.btn-default', function() {
						$(elem).parents('.ms-parent').prev().multipleSelect('uncheckAll');
					});

					nextElem.on('click', '.btn-primary', function() {
						$(this).parents('.ms-parent').prev().multipleSelect('close');
					});
				}

				/*width/height fix imported from DSG*/
				if (ul.outerHeight() < ul.prop('scrollHeight') && !ul.data('width-fixed')) {
					ul.css('width', ul.outerWidth() + $.position.scrollbarWidth()).data('width-fixed', true);
				}

				//Check if dropdown needs to be reversed.
				nextElem.css('right', 'auto');

				if (nextElem.offset().left + nextElem.find('ul').outerWidth(true) > $('body').width()) {
					nextElem.css('right', 0);
				}

				/*if(nextElem.outerHeight(true) + nextElem.offset().top > $('body').height()) {
				 nextElem.css({'top': ' -90px'});
				 }*/

				var selectTagElem = $(elem).parent().prev().get(0);

				//Close all other multiselect dropdown
				ribbonElemMS.each(function() {
					if (selectTagElem != this) {
						var elem = $(this).next();

						elem.find('.ms-choice').find('> div').removeClass('open').end().next().hide();
					}
				});
			}
		});
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
	$('#search-container').addClass('initialized');
});