/*
function ribbon_change(obj) {
	console.log('from IS form: ', obj);
}
 */

var ribbonListener = function () {

	/* Private Variables */
	var ribbonReqObj = {};

	/* -----> Private Methods <-----*/

	function rebuildRibbonState($rbWrapper) {
		var $filter = $rbWrapper.find('[data-isFilter=true]');
		ribbonReqObj = {};
		return filtersCollection($filter);

	}

	// Internal methods to handle filters by type:
	function handleMultiSelect($multiSelect, filterType) {
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

			option.type = filterType;

			ribbonReqObj  [$multiSelect.data('title')].push(option);
		});
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
			console.log('undefined title!!!')
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
		var $checkBoxes = $('#views').find('.ms-drop').find('input');
		var triggered = false;

		// Utiliti functions
		function clearOppositeView(title) {
			if (title == undefined) {
				return;
			} else {
				var oppositeView = (title == 'My Work') ? 'All Teams' : 'My Work';
				var $selectOff = $('#views').find('select[data-title="' + oppositeView + '"]');

				$selectOff.multipleSelect('setSelects', []);
				$selectOff.parent('li').removeClass('active-item-bg');
			}

		}

		function activeView(target) {
			if ($(target).is('select')) {
				if (triggered == false) {
					var title = $(target).data('title');
					$(target).parent('li').addClass('active-item-bg')
					triggered = true;
					return title;
				} else {
					triggered = false;
					return;
				}
			}
		};

		// events
		$('#views').on('change', $checkBoxes, function (e) {
			e.preventDefault();
			clearOppositeView(activeView(e.target));
		})
	}


	/* -----> IS Interactions <-----*/

	var initISfunc = {};

	// gets function passed in the init and saves it for later use in an obj
	//TODO: In the future if only one function needs to be called when filter changes, we can simplify this portion.
	function getISfunction(funcPassed) {
		initISfunc = (function () {
			var passedFunc = funcPassed; //funcPassed is a function

			function run() {
				if (typeof passedFunc == 'function') {
					passedFunc(getISobj(ribbonReqObj));
				}
			}

			return {
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
			console.log('empty object');
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

			} else if ($(this).find('select').length == 0) {  //check for filter options without select elem
				handleNoSelectFilters($(this), 'boolean');

			}
		})
		ribbonWidgets.filterCollectorModule();

		// Will trigger IS function passed as argument in the init
		initISfunc.run();
		console.log(getISobj(ribbonReqObj));
		return ribbonReqObj;
	}

	// add listener to filters, triggers IS function
	function filterListener($rbWrapper) {
		var isTimerRunning = false, ifMultipleClicks = "";

		// on select change event
		$('.sq-top-ribbon select').on('change', function (event) {

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

			}, 500)

		});

		// on click event for li with now select
		$('#agile-status').find('li').on('click', function (e) {
			e.preventDefault();
			// rebuild ribbonReqObj   filters state
			rebuildRibbonState($rbWrapper);
		});

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

		console.log(ribbonReqObj); // test object
		console.log('ISobj: ', getISobj(ribbonReqObj)); // test obj passed to IS
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

	// factories
	function PopoverHtmlBuilder(filter) {
		//Create content section of popover
		this.msPopoverContent = String()
				+ '<form class="dyn-select-form">'
				+ '<div class="k-content">'
				+ '<label for="popoverInput">' + filter + '</label>'
				+ '<input id="popoverInput" />'
				+ '</div>'
				+ '<div class="panel panel-default taglist-parent" style="display:none;">'
				+ '<div class="panel-body">'
				+ '<div  unselectable="on">'
				+ '<ul role="listbox" unselectable="on" class="k-reset" id="popoverInput_taglist_prev"></ul>'
				+ '</div>'
				+ '</div>'
				+ '</div>'
				+ '<button type="button" class="btn btn-default popOverbtn">Close</button>'
				+ '<button type="button" class="btn btn-primary saveSelected">Apply</button>'
				+ '</form>';

		//Create popover template
		this.msHtmlPopover = String()
				+ '<div class="popover ribbon-popover" role="tooltip" >'
				+ '<div class="arrow">'
				+ '</div>'
				+ '<h3 class="popover-title"></h3>'
				+ '<div class="popover-content" >'
				+ '</div>'
				+ '</div>';

		return {
			content: this.msPopoverContent,
			tmpl: this.msHtmlPopover
		}
	}

	function ModalHtmlBuilder(modalInfo) {

		this.modal = String()
				+ '<div class="modal fade ribbon-modal" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">'
				+ '<div class="modal-dialog" role="document">'
				+ '<div class="modal-content">'
				+ '<div class="modal-header">'
				+ '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
				+ '<h4 class="modal-title" id="myModalLabel">' + modalInfo.title + '</h4>'
				+ '</div>'
				+ '<div class="modal-body">'
				+ modalInfo.content
				+ '</div>'
				+ '<div class="modal-footer">'
				+ '<button type="submit" class="btn select-btn btn-primary">Select</button>'
				+ '<button type="reset" class="btn reset-btn btn-default">Reset</button>'
				+ '</div></div></div></div>';

		this.initModal = function () {
			$('#body-content').append(this.modal);
		};

		this.show = function () {
			$('#myModal').modal('show');
		};

		this.preventEventPropagation = function () {
			$(".modal").click(function (e) {
				e.stopPropagation();
				e.preventDefault();
			});
		}

		this.afterModalLoad = function (process) {
			process();
		}

		this.destroyListener = function () {
			$('#myModal').on('hidden.bs.modal', function (e) {
				$('body').find('.ribbon-modal').remove();
			})
		}
	}


	// Widget Modules:
	function ribbonPopupModule() {
		/* ------> Scope varibles <------- */
		var targetInput = "#popoverInput", popupTrigger = '.popoverMS', resultsData = [];

		// Dynamic Select factory
		function BuildDynamicSelect(wrapper) {
			this.createSelectElem = function () {
				if ($(wrapper).find('.dynamic-select').length == 0) {
					$(wrapper).append('<select class="dynamic-select" style="display:none">');
				}

			};
			this.createOption = function (option) {
				// add email data attribute from resulsData
				var email = '';
				if (Array.isArray(resultsData)) {
					resultsData.forEach(function (result) {
						if (result.Alias == option.value) {
							email = result.Email
						}
					});
				}
				;
				// build option
				$(wrapper).find('.dynamic-select').append('<option value="' + option.value + '" data-email="' + email + '">' + option.text + '</option>');
			};
			this.optionsCount = function () {
				var count = $(wrapper).find('option').length;
				return count;
			};
			this.sanitizeLabel = function (label) {
				var tagTxtArr = label.split(' ');
				tagTxtArr.pop();
				label = tagTxtArr.toString();
				return label;
			};
			this.addCountToLabel = function () {
				var tagTxt = $(wrapper).find('span[data-title]').text();

				// check if tag has been modified with parenthesis
				if (tagTxt.indexOf('(') > -1) {
					tagTxt = this.sanitizeLabel(tagTxt);

					// check if options container is not empty when options are removed
					if (this.optionsCount() !== 0) {
						tagTxt = tagTxt + ' (' + this.optionsCount() + ')';
						$(wrapper).find('span[data-title]').text(tagTxt);
					} else {
						$(wrapper).find('span[data-title]').text(tagTxt);
					}
				} else {
					tagTxt = tagTxt + ' (' + this.optionsCount() + ')';
					$(wrapper).find('span[data-title]').text(tagTxt);
				}

			}
		}


		/* ------> Private Functions <------- */
		// initiate kendo multiselect
		function initKendoMultiSelect() {

			var userDataSource = new kendo.data.DataSource({
				//type: 'odata',
				serverFiltering: true,
				transport: {
					read: function (options) {
						if (typeof options.data.filter != 'undefined') {
							$.ajax({
								url: endPoints.users + "?key=" + options.data.filter.filters[0].value,
								dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
								success: function (result) {
									// notify the data source that the request succeeded
									options.success(result.data);
									resultsData = result.data; //need to pull additional data: email
								},
								error: function (result) {
									// notify the data source that the request failed
									options.error(result);
								}
							});
						}
						else {
							options.success([]);
						}
					}
				}
			});

			$("#popoverInput").kendoMultiSelect({
				filter: "contains",
				separator: ", ",
				placeholder: 'Enter name...',
				minLength: 3,
				dataSource: userDataSource,
				dataTextField: "DisplayName",
				dataValueField: "Alias"
			});
		}

		// add Previously selected options to popover
		function addPrevSelectionsToPopover(target) {
			var $dynamicSelect = $(target).find('.dynamic-select');

			if ($dynamicSelect.length > 0) { // check if dynamic select has been created

				if ($dynamicSelect.find('option').length > 0) { // if options are existing show
					$('.taglist-parent').show();
				}
				$dynamicSelect.find('option').each(function () {
					var name = $(this).text();
					var temp = String()
							+ '<li class="k-button" unselectable="on"><span unselectable="on">' + name + '</span><span unselectable="on" class="k-select">'
							+ '<span unselectable="on" class="k-icon k-i-close remove-prev">delete</span></span></li>';

					// attach li to popover
					$('#popoverInput_taglist_prev').append(temp);
				})
			}
			$(this).find('')
		};

		function removePrevOptions(target, option) {
			var $dynamicSelect = $(target).find('.dynamic-select'),
					cleanTag = new BuildDynamicSelect(target);

			$dynamicSelect.find('option').each(function () {
				if ($(this).text() == option) {
					$(this).remove();
				}
			});
			// remove frame if no previous options
			if ($dynamicSelect.find('option').length == 0) {
				$('.taglist-parent').hide('slow');
			}
			// re-adjust tag count
			cleanTag.addCountToLabel();
		}

		/* ------> Utility Functions <------- */
		// Detects filter's title
		function whichFilter(target) {
			var ckFilter = '';
			$(target).find('span').each(function () {
				if ($(this).data('title')) {
					ckFilter = $(this).data('title');
				}
			});
			return ckFilter;
		};

		function closePopup() {
			$(popupTrigger).popover('destroy');
		};

		function saveSelected() {
			var $selctWrapper = $(targetInput).closest('li').find(popupTrigger),
					buildNewSelect = new BuildDynamicSelect($selctWrapper);

			// check if first if any name has been selected
			if ($(targetInput).find('option[selected]').length > 0) {

				// prepare select element
				buildNewSelect.createSelectElem();

				// iterate each option and attach to new selection
				$(targetInput).find('option').each(function () {
					if ($(this).attr('selected')) {
						buildNewSelect.createOption(this);
					}
				});
				buildNewSelect.addCountToLabel();
				closePopup();
			} else {
				alert('Please select Owner name'); //TODO: Should we spend time styling this
			}

		};

		/* ------> Dom, Events and Triggers <------- */
		// initiate popover
		$(popupTrigger).on('click', function (e) {

			var buildHtml = new PopoverHtmlBuilder(whichFilter(this));

			$(this).popover({
				html: true,
				placement: 'left',
				content: buildHtml.content,
				template: buildHtml.tmpl
			});
			$(this).popover("show");

			initKendoMultiSelect();
			addPrevSelectionsToPopover(this);
		});

		// close popover
		$('#filters-section').on('click', '.popOverbtn', function () {

			ribbonListener.rebuildRibbonState($('.sq-top-ribbon')); // Check for possible filter changes
			closePopup()
		})

		// handle selected
		$('#filters-section').on('click', '.saveSelected', function () {
			saveSelected();
			ribbonListener.rebuildRibbonState($('.sq-top-ribbon')); // method from ribbon.js
		});

		// remove previous selection
		$('#filters-section').on('click', '.remove-prev', function () {
			var target = $(this).parents('.popover').siblings(popupTrigger),
					thisOption = $(this).parents('li.k-button'),
					thisName = thisOption.find('span').eq(0).text();

			// remove it from DOM
			removePrevOptions(target, thisName);

			// remove it from popover
			thisOption.remove();

		});

	}

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

				} else if ($(filterType).find('select').length == 0) {  //check for filter options without select elem
					updateNoSelectFilters($(filterType), option);

				}
			}

			// Register Events and trigger responses

			$('.filter-collector').on('click', 'a', function (e) {
				e.stopImmediatePropagation();
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

	var moreFiltersModals = function () {
		// Module variables
		var creator = {alias: null, refresh: false};

		// Private & helpers
		function removeInputKendoStyles() {
			$("#campaignFilter").removeClass('k-input').parent().removeClass("k-widget k-autocomplete k-header form-control");
		}

		function groupByCreatorName(results) {
			var namesList = [];
			objNameList = [];
			if (Array.isArray(results.data)) {
				results.data.forEach(function (campaign) {

					if ($.inArray(campaign.CreatedByName, namesList) == -1) {

						namesList.push(campaign.CreatedByName); // intersections array
						campgnObj = {};
						campgnObj.name = campaign.CreatedByName;
						campgnObj.alias = campaign.CreatedBy;
						objNameList.push(campgnObj); // consumable object array

					}
				})
			} else {
				console.error('see ribbon.js | function:: groupByCreator')
			}
			objNameList.pop();
			namesList.pop(); // always the last is null;
			return objNameList;
		}

		function refreshCampaignModal(selectElm, option) {
			console.log('optionPassed: ', option);
			creator.alias = option;
			creator.refresh = true;
			campaignModal.initCampaignAutoComplete('#campaignFilter'); // refresh kendo autocomplete;
			removeInputKendoStyles();
		}

		function exportSelectedToPopover(target, option) {

			if ($.isEmptyObject(option)) {
				alert('Please select campaign!')
				return
			}
			// add ellipsis if name to long
			if (option.name.length > 27) {
				option.name = option.name.substr(0, 26) + '...';
			}
			// find which modal (campaign or project : may grow later time)
			var $modalName = $('.ribbon-modal form').data('modalname');
			$('#filter-' + $modalName).find('input:first-child')
					.val(option.name)
					.attr('filterId', option.val);

			$('#myModal').modal('hide')
		}

		// public methods
		var campaignModal = function () {

			function runCampaignModal() {
				var campaignInfo = {};

				campaignInfo.content = String()
						+ '<div>'
						+ '<form class="form-horizontal" data-modalName="campaign">'
						+ '<div class="form-group">'
						+ '<label for="campaignFilter">Campaign name: </label>'
						+ '<input type="text" class="form-control" id="campaignFilter" placeholder="Campaign">'
						+ '<div id="hidenDropdown" style="display: none"></div>'
						+ '</div>'
						+ '<p>And</p>'
						+ '<div class="form-group">'
						+ '<label for="campaignFilter">Campaign Creator: </label>'
						+ '<select  id="campaignCreator" class="form-control" placeholder="Campaign">'
						+ addCreatorOptions(campaignCreatorNames)
						+ '</select>'
						+ '</div>'
						+ '<p></p>'
						+ '<select class="campFilterResults form-control" size="12" style="width:490px;"></select>'
						+ '</form></div>';
				campaignInfo.title = 'Search Campaign';

				var buildModal = new ModalHtmlBuilder(campaignInfo);

				buildModal.initModal();
				buildModal.show();
				buildModal.preventEventPropagation();
				buildModal.afterModalLoad(function () {
							var selectedOption = {}
							// campaign select dropdown
							$('.campFilterResults').change(function (e) {
								selectedOption = {
									val: e.target.selectedOptions[0].value,
									name: e.target.selectedOptions[0].text
								}
							});
							// bind select btn event
							$('.ribbon-modal .select-btn').click(function () {
								console.log('clicked a');
								exportSelectedToPopover(this, selectedOption);
							});
							// bind reset btn event
							$('.ribbon-modal .reset-btn').click(function () {
								$('#campaignCreator').val('All');
								$('#campaignFilter').val('');
								$('.campFilterResults').html(''); // make sure all options are new
								creator.key = '';
								refreshCampaignModal('', 'All');
								// clear previous searches
								$('#campaignFilter').on('focus', function () {
									creator.key = '';
								});

							});
						}
				)
				buildModal.destroyListener();

				initCampaignAutoComplete('#campaignFilter');
				// remove kendo styles
				removeInputKendoStyles();
			};

			var campaignCreatorNames = function () {
				$.ajax({
					url: endPoints.campaigns,
					dataType: 'json',
					success: function (data) {
					},
					error: function (error) {
						console.error(error);
					}
				}).done(function (data) {
					campaignCreatorNames = groupByCreatorName(data);
				});

			}();

			function initCampaignAutoComplete(id) {
				var keyEntered = {};
				// Temporary data fix
				var campaignDataSource = new kendo.data.DataSource({
					serverFiltering: true,
					transport: {
						read: function (options) {
							if (typeof options.data.filter != 'undefined') {
								creator.key = options.data.filter.filters[0].value;
								$.ajax({
									url: endPoints.campaigns + "?key=" + options.data.filter.filters[0].value,
									dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
									success: function (result) {
										// notify the data source that the request succeeded
										options.success(result.data);
										resultsData = result.data; //need to pull additional data: email
									},
									error: function (result) {
										// notify the data source that the request failed
										options.error(result);
									}
								});
							}
							else {
								options.success([]);
							}
						}
					},
					change: function (e) {
						$('.campFilterResults').html('');
						var view = campaignDataSource.view();
						console.log(view.length);
						if (creator.alias !== null && creator.alias !== "All") { // if creator has been selected
							var resultsTally = [];
							view.forEach(function (results) {
								if (results.CreatedBy == creator.alias) {
									$('.campFilterResults').append('<option value="' + results.ID + '">' + results.Name + '</option>');
									resultsTally.push(results.Name);
								}
								;
							});
							if (resultsTally.length === 0) {
								$('.campFilterResults').append('<option>0 Camapigns found!</option>');
							} else {
								resultsTally = [];
							}
						} else {
							for (var i = 0; i < view.length; i++) {
								$('.campFilterResults').append('<option value="' + view[i].ID + '">' + view[i].Name + '</option>');
							}
						}
					}
				});

				$(id).kendoAutoComplete({
					dataSource: campaignDataSource,
					filter: "contains",
					dataTextField: "Name",
					minLength: 3,
					popup: {
						appendTo: $("#hidenDropdown")
					},
					animation: false
				});
				var autocomplete = $(id).data("kendoAutoComplete");

				if (creator.refresh === true) {
					autocomplete.search(creator.key); // kendo .search() method is the only way to dynamically trigget change event!
				}
			}

			function addCreatorOptions(nameList) {
				var names = '<option>All</option>';
				if (Array.isArray(nameList)) {
					nameList.forEach(function (creator) {
						currntName = String()
								+ '<option value="' + creator.alias + '">'
								+ creator.name
								+ '</option>';
						names = names + currntName;
					})
				}
				return names;
			}

			return {
				runCampaignModal: runCampaignModal,
				initCampaignAutoComplete: initCampaignAutoComplete
			}
		}();

		var projectModal = function () {
			// Project Modal
			function runProjectModal() {
				var projectInfo = {};

				projectInfo.content = String()
						+ '<div>'
						+ '<form class="form-horizontal" data-modalName="project">'
						+ '<div class="form-group">'
						+ '<label for="projectFilter">Project Name</label>'
						+ '<input type="text" class="form-control" id="projectFilter">'
						+ '<div id="hidenDropdown" style="display: none"></div>'
						+ '</div>'
						+ '<p>And</p>'
						+ '<div class="form-group">'
						+ '<label for="projectOwner">Project Owner</label>'
						+ '<select  id="projectOwner" class="form-control">'
						+ addCreatorOptions()
						+ '</select>'
						+ '</div>'
						+ '<p></p>'
						+ '<div class="form-group">'
						+ '<label for="agileTeam">Agile Team</label>'
						+ '<select  id="agileTeam" class="form-control">'
						+ addCreatorOptions()
						+ '</select>'
						+ '</div>'
						+ '<p></p>'
						+ '<div class="form-group">'
						+ '<label for="sprintFilter">Sprint</label>'
						+ '<select  id="sprintFilter" class="form-control">'
						+ addCreatorOptions()
						+ '</select>'
						+ '</div>'
						+ '<p></p>'
						+ '<select class="projectFilterResults form-control" size="12" style="width:490px;"></select>'
						+ '</form></div>';
				projectInfo.title = 'Search project';

				var buildModal = new ModalHtmlBuilder(projectInfo);

				buildModal.initModal();
				buildModal.show();
				buildModal.preventEventPropagation();
				buildModal.destroyListener();

				initProjectAutoComplte('#projectFilter');

			}

			function initProjectAutoComplte(projectFilter) {

				var resultsData = [];
				var projectDataSource = new kendo.data.DataSource({
					serverFiltering: true,
					transport: {
						read: function (options) {
							if (typeof options.data.filter != 'undefined') {
								$.ajax({
									url: endPoints.projects + "?key=" + options.data.filter.filters[0].value,
									dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
									success: function (result) {
										// notify the data source that the request succeeded
										options.success(result.data);
										resultsData = result.data; //need to pull additional object properties (campagin owner, status etc)
									},
									error: function (result) {
										// notify the data source that the request failed
										options.error(result);
									}
								}).done(function () {
									console.log('done: ', resultsData.length);
								});
							}
							else {
								options.success([]);
							}
						}
					},
					change: function (e) {
						var view = projectDataSource.view();
						console.log(view.length);
						console.log(view[0]);
						$('.projectFilterResults').html('');
						for (var i = 0; i < view.length; i++) {
							$('.projectFilterResults').append('<option>' + view[i].Name + '</option>');
						}
					}
				});

				$(projectFilter).kendoAutoComplete({
					filter: "contains",
					dataSource: projectDataSource,
					dataTextField: "Name",
					minLength: 3,
					popup: {
						appendTo: $("#hidenDropdown")
					}
				});
				// prevents issues with field styles
				$('#projectFilter').removeClass('k-input').parent().removeClass("k-widget k-autocomplete k-header form-control");


			}

			return {
				runProjectModal: runProjectModal
			}
		}();

		function init() {

			// Events

			$('#campaign-btn').on('click', function (e) {
				campaignModal.runCampaignModal();
			});

			$('#project-btn').on('click', function (e) {
				projectModal.runProjectModal();
			});

			// add selected attr
			$('#body-content').on('change', '#campaignCreator', function (e) {
				var selectElm = e.target;
				var option = $(selectElm).find('option:selected').val(); // get selected value which is Alias
				refreshCampaignModal(selectElm, option)
			});

		}

		return {
			init: init
		}
	}();

	return {
		ribbonPopupModule: ribbonPopupModule,
		filterCollectorModule: filterCollectorModule,
		moreFiltersModals: moreFiltersModals
	}

}();








