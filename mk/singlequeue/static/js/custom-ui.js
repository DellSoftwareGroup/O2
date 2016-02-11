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

	function RibbonPopupMultiSelect() {

		// create html template for popover
		var msPopoverContent = String()
				+ '<form>'
				+ '<div class="k-content">'
				+ '<label for="ownerInput">Owner</label>'
				+ '<input id="ownerInput" style="width: 100%;" />'
				+ '</div>'
				+ '<button type="button" class="btn btn-default popOverbtn">Close</button>'
				+ '</form>';

		var msHtmlPopover = String()
				+ '<div class="popover ribbon-popover" role="tooltip" >'
				+ '<div class="arrow">'
				+ '</div>'
				+ '<h3 class="popover-title"></h3>'
				+ '<div class="popover-content" >'
				+ '</div>'
				+ '</div>';

		// initiate popover

		$('.popoverMS').on('click', function (e) {

			console.log('onClick', e);
			$(this).popover({
				html: true,
				placement: 'left',
				content: msPopoverContent,
				template: msHtmlPopover
			});
			$(this).popover("show");
			initKendoMultiSelect()
		});

		// close popover
		$('#filters-section').on('click', '.popOverbtn', function () {
			$('.popoverMS').popover('destroy');
		})

		// initiate kendo multiselect
		function initKendoMultiSelect() {
			$("#ownerInput").kendoMultiSelect({
				dataTextField: "Name",
				filter: "contains",
				separator: ", ",
				minLength: 2,
				dataSource: {
					transport: {
						read: {
							url: '/mk/singlequeue/widgets/views/data/users.json',
							datatype: 'json'
						}
					}
				},
				select: function (e) {
					console.log(e);
				}
			});
		}

  }


  function init() {

  }

  return {
    init: init,
		RibbonPopupMultiSelect: RibbonPopupMultiSelect,
  }

}(jQuery));


$(function () {
	if ($('.sq-top-ribbon').length === 0) {
		var timerOne = setInterval(function () {  // timer needed only for localhost
			if ($('.sq-top-ribbon').length > 0) {
				commonWidgets.RibbonPopupMultiSelect();
				clearInterval(timerOne);
			}
		}, 1000);
	}
});