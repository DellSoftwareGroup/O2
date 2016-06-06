/*created by: Elnaz Doostdar 1/19/2014*/
$(function () {
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
			//$('#search-container #search-btn').trigger('click');
			$('#top-search-btn').trigger('click');
		}
	});

	//filters click event
	var filterSubNavWrapper = $('#sq-filters .sub-nav-wrapper'),
			filterSubNav = filterSubNavWrapper.find('.sub-nav');

	// prevent propagation on multi-select under sub nav
	$('#sq-filters').on('click', '.ms-drop input, .ms-drop label', function (e) {
		e.stopPropagation();
	});

	$('#sq-filters').on('click', function (e) {
		//Do not toggle if clicking anywhere in the dropdown.
		if ($(e.target).parents('.sub-nav-wrapper').length) {
			return false;
		}

		e.stopPropagation();
		e.preventDefault();
		filterSubNav.toggle();
		$(this).toggleClass('add-bg');

		$(this).find('.sub-nav-wrapper').css('marginLeft', '');

		if ($('#sq-filters-item').hasClass('active-item-bg')) {
			$(this).removeClass('add-bg').find('.sub-nav-wrapper').css('marginLeft', '-6px');
		}

		if (filterSubNav.is(':visible')) {
			filterSubNavWrapper.css('height', '445px');
		}
		else {
			filterSubNavWrapper.css('height', '0');
		}
	});


	$('body').on('click', function (e) {
		$('#sq-filters').removeClass('add-bg');
		$('.sub-nav').hide();

		/*close any open popover when click elsewhere*/
		if ($(e.target).parent().find('.toggle-popover').length > 0) {
			$('.toggle-popover').popover('hide');
		}
	});

	//click state of bar icons
	var ribbonItem = $('.sq-top-ribbon > ul > li > ul > li'),// Todo: it was used for the previous ribbon style, should be removed? JL.
			subNavMultiSelct = $('.sub-nav .ms-parent').children();

	/*
	 $('#agile-status ul > li').on('click', function (e) {
	 e.preventDefault();
	 e.stopImmediatePropagation()

	 });
	 */

	(ribbonItem.children(), filterSubNav, $('.sub-nav .ms-parent').children(), $('.sq-top-ribbon select')).on('click', function (e) {
		e.stopPropagation();
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

	//Initialize multiple select for ribbon area
	$('.sq-top-ribbon').find('select').each(function() {
		if ($(this).attr('multiple') == 'multiple') {
			var id = $(this).attr('id'), title = $(this).data('title'), obj = {
				placeholder: title,
				minimumCountSelected: 0,
				//countSelected: title + '&nbsp;(#)',
				countSelected: title,
				selectAllText: $(this).data('select-all-text'),
				//allSelected: title + '&nbsp;(all)',
				allSelected: title,
				maxHeight: 240,
				onClose: function () {
					var $target = this.title;

					ribbonListener.onCloseMultiFilter($target);
				},
				onOpen: function (elem) {
					var nextElem = $(elem).next(), ul = nextElem.find('ul');

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
					$('.sq-top-ribbon').find('select').each(function() {
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

	/*date picker*/
	/*$(".date-picker").kendoDatePicker({
		"format": "MM/dd/yyyy",
		"min": new Date(1900, 0, 1, 0, 0, 0, 0),
		"max": new Date(2099, 11, 31, 0, 0, 0, 0)
	});*/

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

	/*kendo editor*/
	$(".editor").kendoEditor({
		resizable: {
			content: true,
			toolbar: true
		}
	});

	$('.hour').keydown(function (e) {
		var key = e.charCode || e.keyCode || 0;
		// allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
		// home, end, period, and numpad decimal
		return (
		key == 8 ||
		key == 9 ||
		key == 13 ||
		key == 46 ||
		key == 110 ||
		key == 190 ||
		(key >= 35 && key <= 40) ||
		(key >= 48 && key <= 57) ||
		(key >= 96 && key <= 105));
	});

	$('.sq-top-ribbon').addClass('initialized');
});

$(window).load(function () {
	//change image position based on browser for select
	if ($('.k-multiselect').length && false) {
		var arrow = $('.arrow');
		if ($.browser.chrome) {
			arrow.addClass('chrome');
		}
		else if ($.browser.mozilla && !$('html').hasClass('k-ie11')) {
			//arrow.addClass('firefox');
		}
		else if ($('html').hasClass('ie9') || $('html').hasClass('k-ie9')) {
			arrow.addClass('ie9');
		}
		else if ($('html').hasClass('k-ie11')) {
			arrow.addClass('ie11');
		}
		else {
			arrow.addClass('safari');
		}
	}
	//ie9 placeholder plugin
	if ($('html').hasClass('k-ie9')) {
		$('input, textarea').placeholder();
	}
});

function toggleActiveItem(elem) {
	$(elem).toggleClass('active-item-bg').end().removeClass('disable-hover');
	if ($(elem).attr('id') == 'sq-filters-item') {
		$(elem).find('#sq-filters').removeClass('add-bg');
	}
}