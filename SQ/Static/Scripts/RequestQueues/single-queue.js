/*created by: Elnaz Doostdar 1/19/2014*/
$(function() {
	//add search placeholder hack in ie9
	$(document).ajaxComplete(function() {
		if ($('html').hasClass('k-ie9')) {
			var searchQuery = $('iframe').contents().find('#search-query');
			searchQuery.val('Search').css('color', '#ccc');

			searchQuery
				.on(focus, function() {
					$(this).val('').css('color', '#000');
				})
				.on('blur', function() {
					$(this).val('Search').css('color', '#ccc');
				});
		}
	});

	//trigger search button click when enter
	$("#search-query").keypress(function(e) {
		if (e.which == 13) {
			//$('#search-container #search-btn').trigger('click');
			$('#top-search-btn').trigger('click');
		}
	});

	/*popover*/
	$('.toggle-popover')
		.popover({
			html: true,
			trigger: "manual",
			content: function() {
				return $(".popover-content", this).html();
			}
		})
		.on("mouseenter", function() {
			var _this = this;
			$(this).popover("show");
			$(this).siblings(".popover").on("mouseleave", function() {
				$(_this).popover('hide');
			});
		})
		.on("mouseleave", function() {
			var _this = this;
			setTimeout(function() {
				if (!$(".popover:hover").length) {
					$(_this).popover("hide")
				}
			}, 100);
		});

	/*collapsibles*/
	/*keep border bottom only when they are collapsed*/
	$('.panel-group-collapsible').each(function() {
		if ($(this).find('.panel-title > a').hasClass('collapsed')) {
			$(this).css('border-bottom', '1px solid #aaa');
		}
	});

	$('.table-responsive').on('hidden.bs.collapse', function(e) {
		/*prevent toggling border by Notified collapsibles in comments */
		if (!$(e.target).attr('id').match('^Notified')) {
			$(this).parent().parent().css('border-bottom', '1px solid #aaa');
		}
	}).on('shown.bs.collapse', function(e) {
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

	$('.hour').keydown(function(e) {
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
});

$(window).load(function() {
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