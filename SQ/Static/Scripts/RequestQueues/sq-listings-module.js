/* requestTable.init() method gets called
 *  by .kendoGrid object (see dataSource)
 *  Table manipulations for UI styles
 */
var singleQueueTables = (function ($) {

	/* ------->  Private functions and methods  <------- */

	// common functions for all tables - Table DOM manipulations
	var commonStyles = (function () {

		function summarySecStyles(numCol) {
			$('th').each(function () {
				if ($(this).data("index") > numCol) {
					$(this).addClass('summary-th');
				}
			})
		};

		function summaryBorder(colClass) {
			$(colClass).parent('td').addClass('summary-start');
		};

		// TODO: temp function should be removed by Eder (Styles to match mocks)
		function tempStyles() {

			// urgent, new and legacy labels
			var taggedCol = $('.title-col'),
					label = ['<span class="icon urgent">Urgent</span>',
						'<span class="icon new">New</span>',
						'<span class="icon legacy">Legacy</span>',
						'<span class="icon legacy">Legacy</span>'];

			for (var i = 0; i < taggedCol.length; i++) {
				$(taggedCol[i]).find('a').append(label[i]);
			}

			// late warning label
			var lateCol = ['.endDate-col', '.requestEndDate-col'];
			lateCol.forEach(function (element) {
				var temp = $(element)[0];
				$(temp).append('<span class="icon past-due"></span>');
			});
		};

		// pagination
		function GridRequest_DataBound() {
			var PagerConfig = {
				dataSource: $("#GridRequest").data("kendoGrid").dataSource,
				pageSize: 10,
				autoBind: true,
				selectTemplate: '<li class="active"><a class="data-pager-link" data-page="#=text#">#=text#</a></li>',
				linkTemplate: '<li><a class="data-pager-link" href="\\#" data-#=ns#page="#=text#">#=text#</a></li>',
				messages: {
					display: '<li class="">{0} - {1} of {2}</li>'
				}
			};

			// ---> Top Pagination Starts
			var TopPager = $('#TopPager');

			TopPager.kendoPager(PagerConfig);

			TopPager.find(".k-pager-first").hide().end().find('.k-pager-last').hide();
			TopPager.find('> ul').prepend("<li></li>");
			TopPager.find('.k-i-arrow-w').parent().addClass("prev").detach().appendTo('#TopPager>ul li:first').find("span").remove();
			TopPager.find('> ul').append("<li></li>");
			TopPager.find('.k-i-arrow-e').parent().addClass("next").detach().appendTo('#TopPager>ul li:last').find("span").remove();
			TopPager.find('> ul').prepend("<li></li>");
			TopPager.find('.k-pager-info').detach().appendTo('#TopPager>ul li:first');

			TopPager.data('processed', true);

			// ---> Bottom Pagination Starts
			var BottomPager = $('#BottomPager');

			BottomPager.kendoPager(PagerConfig);

			BottomPager.find(".k-pager-first").hide().end().find('.k-pager-last').hide();
			BottomPager.find('> ul').prepend("<li></li>");
			BottomPager.find('.k-i-arrow-w').parent().addClass("prev").detach().appendTo('#BottomPager>ul li:first').find("span").remove();
			BottomPager.find('> ul').append("<li></li>");
			BottomPager.find('.k-i-arrow-e').parent().addClass("next").detach().appendTo('#BottomPager>ul li:last').find("span").remove();
			BottomPager.find('> ul').prepend("<li></li>");
			BottomPager.find('.k-pager-info').detach().appendTo('#BottomPager>ul li:first');

			//Commented out as currently we do not know what these script purpose was.
			/*$(".data-pager-link").click(function (e) {
			 //return CheckDataChanges();
			 console.log("pager-link");
			 });
			 $(".k-pager-nav").click(function (e) {
			 //return CheckDataChanges();
			 console.log("pager-nav");
			 });*/
		}

		return {
			summarySecStyles: summarySecStyles,
			summaryBorder: summaryBorder,
			tempStyles: tempStyles,
			GridRequest_DataBound: GridRequest_DataBound
		}
	}());

	// Add color tags to owner field
	var ownerColorTag = function () {
		var colorToName = [
			{name: 'James Gomez', color: "#6ea204"},
			{name: 'Michael Hughes', color: "#42aeaf"},
			{name: 'Giovanni Monsalve', color: "#ee6411"}
		];
		// pick up owner name
		$('.owner-col').each(function () {
			var ownerName = $(this).find('.owner-name').text();
			var $that = $(this);

			// compare and if match add styles
			colorToName.forEach(function (owner) {
				if (owner.name == ownerName) {
					$that.find('span:first-child')
							.css('background-color', owner.color)
							.addClass('color-id');
				}
			});

		})
	};

	// Add icon to status
	var statusIcon = function () {
		var icons = [
			{status: 'In Progress', class: 'started-icon'},
			{status: 'Complete', class: 'done-icon'},
			{status: 'Pending', class: 'backlog-icon'}
		];
		$('.status-col').each(function () {
			var status = $(this).text(),
					iconPlaceholder = $(this).find('i');

			/*in edit mode remove icon*/
			if ($(this).find('select').length > 0) {
				$(this).find('i').hide();
			} else if (status.indexOf('Pending') >= 0) {
				iconPlaceholder.addClass('backlog-icon');
				$(this).find('i').show();
			}
			if (status.indexOf('In Progress') >= 0 || status.indexOf('Complete') >= 0) {
				$(this).parents('tr').addClass('bg-light-blue');
			}
			if (status.indexOf('Complete') >= 0) {
				$(this).parents('tr').addClass('text-light-gray');
			}
			icons.forEach(function (icon) {
				if (icon.status == status) {
					iconPlaceholder.addClass(icon.class);
				}
			});
		});
	};

	//Edit mode
	var editMode = function () {
		$('#edit-task-listing tr').each(function () {
			if ($(this).find('select').length > 0) {
				$(this).find('.edit-col a').text('OK').after('<a href="#" class="btn btn-default ml-10">Cancel</a>').end().find('i').hide();
			}
		});
	};

	// Bootstrap popover
	var ListingPopOver = (function () {

		/* private methods and Data example */

		//IS will pass real data,
		// for testing purposes we are using sample objects array.
		var reqData = [
			{
				id: '27139',
				group: 1,
				task: 'Writing Content',
				owner: 'James Gomez',
				status: 'In progress',
				'plannedStart': '5/20/2015',
				'plannedEnd': '6/1/2015',
				'actualStart': '6/1/2015',
				'actualEnd': '6/10/2015'
			},
			{
				id: '27139',
				group: 1,
				task: 'Key words',
				owner: 'Michael Hughes',
				status: 'Complete',
				'plannedStart': '5/20/2015',
				'plannedEnd': '5/20/2015',
				'actualStart': '6/1/2015',
				'actualEnd': '6/5/2015'
			},
			{
				id: 'MRCM-47411',
				group: 1,
				task: 'PDF Creation',
				owner: 'Giovanni Monsalve',
				status: 'In progress',
				'plannedStart': '5/20/2015',
				'plannedEnd': '5/20/2015',
				'actualStart': '6/1/2015',
				'actualEnd': '6/5/2015'
			},
			{
				id: 'MRCM-47411',
				group: 1,
				task: 'Upload to Website',
				owner: 'Carol Buckley',
				status: 'Pending',
				'plannedStart': '5/20/2015',
				'plannedEnd': '5/20/2015',
				'actualStart': '6/1/2015',
				'actualEnd': '6/5/2015'
			}
		];

		//find web request group
		function filterReqAndGroup(requestId) {
			var groupTasks = [];
			reqData.forEach(function (task) {
				if (task.id == requestId) {
					groupTasks.push(task);
				}
			})
			if (groupTasks.length > 0) {
				return groupTasks;
			} else {
				return 'No tasks found';
			}
		}

		// build popover template
		function popoverBuilder(requestId) {
			var filteredTasks = filterReqAndGroup(requestId), trTasks = "";

			if (Array.isArray(filteredTasks)) {

				// Iterate thru each task
				filteredTasks.forEach(function (task) {
					trTasks += String()
					+ '<tr><td><div class="tsk-group">' + task.group + '</div></td>'
					+ '<td><div class="tsk-task">' + task.task + '</div></td>'
					+ '<td><div class="tsk-owner">' + task.owner + '</div></td>'
					+ '<td><div class="tsk-owner">' + task.status + '</div></td>'
					+ '<td><div class="pln-start">' + task.plannedStart + '</div></td>'
					+ '<td><div class="pln-end">' + task.plannedEnd + '</div></td>'
					+ '<td><div class="actual-start">' + task.actualStart + '</div></td>'
					+ '<td><div class="actual-end">' + task.actualEnd + '</div></td></tr>';
				});


				// if tasks were found
				var tasksTmpl = String()
						+ '<div class="popover sq-popover" role="tooltip">'
						+ '<h3 class="popover-title">Group Tasks</h3>'
						+ '<div>'
						+ '<table><thead>'
						+ '<tr><th>Group</th><th>Task</th><th>Owner</th><th>Status</th><th>Planned Start</th><th>Planned End</th><th>Actual Start</th><th>Actual End</th></tr>'
						+ '</thead>'
						+ '<tbody class="popover-content">'
						+ '</tbody></table>'
						+ '</div></div>';

				var popUp = {
					tmpl: tasksTmpl,
					content: trTasks
				}

				return popUp;

			} else {
				// if no request found

				var tasksNotFound = String()
						+ '<div class="popover popover-nr" role="tooltip">'
						+ '<h3 class="popover-title">Group Tasks</h3>'
						+ '<div class="popover-content"></div>'
						+ '</div>';

				var noTaskResp = {
					tmpl: tasksNotFound,
					content: filteredTasks
				}

				return noTaskResp;
			}

		}


		/* Public Method */
		var init = function () {

			// initialize Bootstrap popover:
			$('.popoverTasks').hover(function () {
				var requestId = $(this).data('reqid'); // pull request Id from data attribute (data-reqID)
				var popoverTmpl = popoverBuilder(requestId);
				$(this).popover({
					html: true,
					content: popoverTmpl.content,
					template: popoverTmpl.tmpl,
					placement: 'top',
					selector: this,
					container: 'body'
				});
				$(this).popover("show");
			}, function () {
				$(this).popover('destroy')
			});


		}


		/* public  API */

		return {
			init: init
		}

	}());


	/* ------->  Public methods  <------- */

	// Request Listing Table
	var requestListings = {
		styles: function () {
			var summaryIndx = 11, summaryStartCol = ".group-col";
			commonStyles.summarySecStyles(summaryIndx);
			commonStyles.summaryBorder(summaryStartCol);
			commonStyles.tempStyles();
			commonStyles.GridRequest_DataBound();
			// modalTable.init(); --> Kendo window
			ListingPopOver.init();
		},
		addTableHeadings: function () {
			//Only allow 1 table group heading.
			if (!$('#GridRequest').find('.table-group-headings').length) {
				$('<thead class="table-group-headings"><tr><th colspan="12">Request Info</th><th colspan="5">Current Group Summary</th></tr></thead>').insertBefore('#GridRequest thead');
			}
		}
	};

	// Task Listing Table
	var taskListings = {
		styles: function () {
			var summaryIndx = 9, summaryStartCol = ".sprint-col";
			commonStyles.summarySecStyles(summaryIndx);
			commonStyles.summaryBorder(summaryStartCol);
			commonStyles.tempStyles();
			commonStyles.GridRequest_DataBound();
			ownerColorTag();
		},
		addTableHeadings: function () {
			//Only allow 1 table group heading.
			if (!$('#GridRequest').find('.table-group-headings').length) {
				$('<thead class="table-group-headings"><tr><th colspan="10">Request Info</th><th colspan="7">Task Info</th></tr></thead>').insertBefore('#GridRequest thead');
			}
		}
	};

	//Edit Request - Task listing table
	var editTaskListing = {
		styles: function () {
			ownerColorTag();
			// statusIcon(); as per Eder -- He will add this based on the backend logic
			editMode();
		}

	};


	/* ------->  API  <------- */
	return {
		requestListings: requestListings,
		taskListings: taskListings,
		editTaskListing: editTaskListing
	}

}(jQuery));