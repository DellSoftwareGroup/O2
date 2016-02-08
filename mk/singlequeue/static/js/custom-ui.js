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

 /* ------->  Private functions and methods  <------- */

      // common functions for all tables - Table DOM manipulations
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
          function GridRequest_DataBound(){

            // ---> Top Pagination Starts
              var pager = $("#TopPager").kendoPager({
                dataSource: $("#GridRequest").data("kendoGrid").dataSource,
                pageSize: 50,
                autoBind: true,
                selectTemplate: '<li class="active"><a class="data-pager-link" data-page="#=text#">#=text#</a></li>',
                linkTemplate: '<li><a class="data-pager-link" href="\\#" data-#=ns#page="#=text#">#=text#</a></li>',
                messages: {
                  display: '<li class="">{0} - {1} of {2}</li>'
                }
              });

              $(".k-i-seek-w").parent().hide();
              $(".k-i-seek-e").parent().hide();

              $('#TopPager>ul').prepend("<li></li>");
              $('#TopPager .k-i-arrow-w').parent().addClass("prev").detach().appendTo('#TopPager>ul li:first').find("span").remove();
              $('#TopPager>ul').append("<li></li>");
              $('#TopPager .k-i-arrow-e').parent().addClass("next").detach().appendTo('#TopPager>ul li:last').find("span").remove();
              $('#TopPager>ul').prepend("<li></li>");
              $('#TopPager .k-pager-info').detach().appendTo('#TopPager>ul li:first');


            // ---> Bottom Pagination Starts
              var pager = $("#BottomPager").kendoPager({
                dataSource: $("#GridRequest").data("kendoGrid").dataSource,
                pageSize: 10,
                autoBind: true,
                selectTemplate: '<li class="active"><a class="data-pager-link" data-page="#=text#">#=text#</a></li>',
                linkTemplate: '<li><a class="data-pager-link" href="\\#" data-#=ns#page="#=text#">#=text#</a></li>',
                messages: {
                  display: '<li class="">{0} - {1} of {2}</li>'
                }
              })
              console.log('pager: ' + pager);
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

      // Add color tags to owner field
      var ownerColorTag = function(){
      var colorToName = [
        { name: 'James Gomez', color: "#6ea204"},
        { name: 'Michael Hughes', color: "#42aeaf"},
        { name: 'Giovani Monsalve', color : "#ee6411"}
      ]
      // pick up owner name
      $('.owner-col').each(function(){
        var ownerName = $(this).find('.owner-name').text();
        var $that = $(this);

        // compare and if match add styles
        colorToName.forEach(function(owner){
          if (owner.name == ownerName){
            $that.find('span:first-child')
              .css('background-color', owner.color)
              .addClass('color-id');
          }
        });

      })
      };

      //Kendo Window widget + Grid
      var modalTable = (function(data){
        // data will come from IS
        // for now we are using this sample data
        var dataObj = [
          {
            "id": "27139",
            "title": "Active Administrator for DNS Management",
            "type": "Tech Brief"
          },
          {
            "id": "47554",
            "title": "TZ 215 Product Page",
            "type": "Blog Post Series"
          },
          {
            "id": "MRCM-47411",
            "title": "TX Series White Papers",
            "type": "White Paper"
          }];

        function dataFilter(){
          return dataObj;
        }

        function makeTable(){
          var dataSet = dataFilter();

          // Using Kendo Grid to create table Dynamically
          $('#modalTable').kendoGrid({
            columns: [{title: "ID", field: "id",
              template: "<div class='id-col'>#= id #</div>"},
              {title: "Title", field: "title",
                template: "<div class='title-col'><a href=''>#= title #</a></div>"},
              {title: "Type", field: "type",
                template: "<div class='type-col'>#= type #</div>"}],
            dataSource: {
              data: dataSet,
              pageSize: 10,
              page: 1,
              total: 0
            },
          });

        }

        function activateKendoWindow() {

          // Use of Kendo "Window" widget for Modal
          var myWindow = $('#modalWrapper'),
            undo = $("#undo");

          undo.click(function() {
            myWindow.data("kendoWindow").open();
            undo.fadeOut();
          });

          function onClose() {
            undo.fadeIn();
          }

          myWindow.kendoWindow({
            width: "600px",
            title: "test Table",
            visible: false,
            actions: [
              "Close"
            ],
            close: onClose
          }).data("kendoWindow").center().open();
        }
        /* End of Kendo "Window" widget code */


       // Public method
        function init(){
          $('body').on('hover', '.active-col', function(){
            activateKendoWindow();
            makeTable();
          })
        }

       // API
        return {
          init : init
        }
      }());

  // Bootstrap popover
  var BootsPopOver = (function () {

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
        'actualEnd': '6/10/2015',
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
        'actualEnd': '6/5/2015',
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
        'actualEnd': '6/5/2015',
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
        'actualEnd': '6/5/2015',
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
        console.log('one: ' + popoverTmpl);
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
        styles: function(){
          var summaryIndx = 11,  summaryStartCol =".group-col";
          commonStyles.summarySecStyles(summaryIndx);
          commonStyles.summaryBorder(summaryStartCol);
          commonStyles.tempStyles();
          commonStyles.GridRequest_DataBound();
          // modalTable.init(); --> Kendo window
          BootsPopOver.init();
        }
      };

      // Task Listing Table
      var taskListings =  {
        styles: function(){
          var summaryIndx =9,  summaryStartCol =".sprint-col";
          commonStyles.summarySecStyles(summaryIndx);
          commonStyles.summaryBorder(summaryStartCol);
          commonStyles.tempStyles();
          commonStyles.GridRequest_DataBound();
          ownerColorTag();
        }
      };


  /* ------->  API  <------- */
	return {
		requestListings: requestListings,
		taskListings: taskListings
	}

}(jQuery));


var commonWidgets = (function ($) {

  function kendoTree(targetElm) {

    if (targetElm.typeof === "string") {
      $(targetElm).kendoTreeView();
    } else {
      console.log('')
    }

  }

  function init() {

  }

  return {
    init: init,
    kendoTree: kendoTree
  }

}(jQuery));


$(function () {
  commonWidgets.kendoTree('#files-treeview')
});

