var commonWidgets = (function ($) {

	// view view widget kendo dropdown
	var listingDropdown = function () {
		$("#listingView").kendoDropDownList({
			dataSource: ["Requests", "Tasks"],
			change: function (e) {
				var value = this.value();
				console.log(value);
			}
		});
	}

	return {
		listingDropdown: listingDropdown
	}

}(jQuery));


$(function () {
	if ($('.sq-top-ribbon').length === 0) {
		var timerOne = setInterval(function () {  // timer needed only for localhost
			if ($('.sq-top-ribbon').length > 0) {
				commonWidgets.listingDropdown();
				clearInterval(timerOne);
			}
		}, 1000);
	}
});