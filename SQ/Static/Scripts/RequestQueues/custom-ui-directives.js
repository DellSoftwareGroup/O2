//Angular module used at taxonomyLearnItem

var TaxonomyLearnItemApp = angular.module('TaxonomyLearnItemApp');

// Directive: Add title attributes to child elements using the the child text
// useful for adding attributes to dynamic dropdowns use on edit.cshtml
TaxonomyLearnItemApp.directive('dynamicTitleAttr', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			// use this to add title attribute to child elem
			// e.g adding title attribute to options add directive to parent select
			var $childType = attrs.onChildType;
			$(window).load(function () {
				$(element).on('hover', $childType, function (e) {
					var $text = $(e.target).text();
					var $title = $(e.target).attr('title');

					if (!$title || $title !== $text) {
						$(e.target).attr('title', $text);
						console.log('$title');
					}

				})
			});
		}
	}
});
