/* Template Loader is a temp script to load template sections
*  It allows us to work simultaneously on page sections
*/
var templateLoader = (function($,host){

	return{
		loadExtTemplate: function(path, target, scripts){

			var tmplLoader = $.get(path)
					.success(function(result){

						if(target === undefined || target === ''){
							$(".wrapper").append(result);
						}else {
							$(target).append(result);
						}

					})
					.error(function(result){
						alert("Error Loading Templates -- TODO: Better Error Handling");
					})
			tmplLoader.complete(function(){

        // Pass scripts that need to be passed after templates are loaded.
        if(Array.isArray(scripts)){
          // inject and js files required
          scripts.forEach(function(path){
            $.getScript(path)
              .done(function( script, textStatus ) {
                console.log( textStatus );
              })
              .fail(function( jqxhr, settings, exception ) {
                alert( "Triggered ajaxError handler. Cannot load: " + path );
              });
          });
        }

				$(host).trigger("TEMPLATE_LOADED", [path]);
			});
		}
	};
})(jQuery, document);


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