/* Template Loader is a temp script to load template sections
*  It allows us to work simultaneously on page sections
*/
var templateLoader = (function($,host){

	return{
		loadExtTemplate: function(path, target){

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

				$(host).trigger("TEMPLATE_LOADED", [path]);
			});
		}
	};
})(jQuery, document);


/* requestTable.init() method gets called
*  by .kendoGrid object (see dataSource)
*  Table manipulations for UI styles
*/
var singleQueueTables = (function($){

  var requestListings = {

		styles: function () {

			// DOM manipulations

			// Adds Class to first Current Group Summary Group (cgs)
			$('.group-col').parent('td').addClass('cgs-start');


			//Add Class to CGS table headings
			$('th').each(function () {
				if ($(this).data("index") > 11) {
					$(this).addClass('cgs-th');
				}
			})

			// ---- */ End of DOM manipulations

			// Temp Scripts
			/* TODO: Eder to remove this temp scripts
			 * as this script was created only
			 * to show case warning styles
			 */
			// urgent, new and legacy labels
			var taggedCol = $('.title-col'),
					label = ['<span class="urgent">Urgent</span>',
						'<span class="new">New</span>',
						'<span class="legacy">Legacy</span>',
						'<span class="legacy">Legacy</span>'];

			for (var i = 0; i < taggedCol.length; i++) {
				$(taggedCol[i]).find('a').append(label[i]);
			}

			// late warning label
			var lateCol = ['.endDate-col', '.requestEndDate-col'];
			lateCol.forEach(function (element) {
				var temp = $(element)[0];
				$(temp).append('<span class="past-due"></span>');
			});

			// ---- */ End of Temp scripts

		}
	};

	var taskListings = {

		styles: function() {
			console.log('taskListings');
		}
	}

	return {
		requestListings: requestListings,
		taskListings: taskListings
	}

}(jQuery));

