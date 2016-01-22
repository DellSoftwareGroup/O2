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
		};

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
		};

		// pagination
		function GridRequest_DataBound(){
			var pager = $("#BottomPager").kendoPager({
				dataSource: $("#GridRequest").data("kendoGrid").dataSource,
				pageSize: 10,
				autoBind: true,
				selectTemplate: '<li class="active"><a class="data-pager-link" data-page="#=text#">#=text#</a></li>',
				linkTemplate: '<li><a class="data-pager-link" href="\\#" data-#=ns#page="#=text#">#=text#</a></li>',
				messages: {
					display: '<li class="">{0} - {1} of {2}</li>'
				}
			}).data("kendoPager");

			$(".k-i-seek-w").parent().hide();
			$(".k-i-seek-e").parent().hide();

			$('#BottomPager>ul').prepend("<li></li>");
			$('#BottomPager .k-i-arrow-w').parent().addClass("prev").detach().appendTo('#BottomPager>ul li:first').find("span").remove();
			$('#BottomPager>ul').append("<li></li>");
			$('#BottomPager .k-i-arrow-e').parent().addClass("next").detach().appendTo('#BottomPager>ul li:last').find("span").remove();
			$('#BottomPager>ul').prepend("<li></li>");
			$('#BottomPager .k-pager-info').detach().appendTo('#BottomPager>ul li:first');

			$(".data-pager-link").click(function (e) {
				//return CheckDataChanges();
        console.log("pager-link");
			});
			$(".k-pager-nav").click(function (e) {
				//return CheckDataChanges();
        console.log("pager-nav");
			});
		}

		return {
			summarySecStyles: summarySecStyles,
			summaryBorder: summaryBorder,
			tempStyles: tempStyles,
			GridRequest_DataBound: GridRequest_DataBound
		}
	}());

  var requestListings = {
		styles: function(){
			var summaryIndx = 11,  summaryStartCol =".group-col";
			commonStyles.summarySecStyles(summaryIndx);
			commonStyles.summaryBorder(summaryStartCol);
			commonStyles.tempStyles();
      //commonStyles.GridRequest_DataBound();
		}
	};

	var taskListings =  {
		styles: function(){
			var summaryIndx =9,  summaryStartCol =".sprint-col";
			commonStyles.summarySecStyles(summaryIndx);
			commonStyles.summaryBorder(summaryStartCol);
			commonStyles.tempStyles();
      commonStyles.GridRequest_DataBound()
		}
	};

	return {
		requestListings: requestListings,
		taskListings: taskListings,
		commonStyles: commonStyles
	}

}(jQuery));



