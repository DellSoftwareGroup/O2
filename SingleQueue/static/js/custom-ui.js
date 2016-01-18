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

	// common functions for all tables
	var commonStyles = (function() {
		function summarySecStyles(numCol){
			$('th').each(function () {
				if ($(this).data("index") > numCol) {
					$(this).addClass('summary-th');
				}
			})
		};
		function summaryBorder(colClass){
			$(colClass).parent('td').addClass('summary-start');
		}

		// TODO: temp function should be removed by Eder (Styles to match mocks)
		function tempStyles(){

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
		}

		return {
			summarySecStyles: summarySecStyles,
			summaryBorder: summaryBorder,
			tempStyles: tempStyles
		}
	}());

  var requestListings = {
		styles: function(){
			var summaryIndx = 11,  summaryStartCol =".group-col";
			commonStyles.summarySecStyles(summaryIndx);
			commonStyles.summaryBorder(summaryStartCol);
			commonStyles.tempStyles()
		}
	};

	var taskListings =  {
		styles: function(){
			var summaryIndx =9,  summaryStartCol =".sprint-col";
			commonStyles.summarySecStyles(summaryIndx);
			commonStyles.summaryBorder(summaryStartCol);
			commonStyles.tempStyles()
		}
	};

	return {
		requestListings: requestListings,
		taskListings: taskListings,
		commonStyles: commonStyles
	}

}(jQuery));

