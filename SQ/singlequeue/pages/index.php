<?php require 'widget.class.php'; $widget = new Widget(); ?><!DOCTYPE html>
<html>
<head>
    <title><?= $_GET['page'] ?></title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <link href="http://stage-o2.prod.quest.corp/SQ/Static/Content/kendo/2015.1.318/kendo.requestqueues.min.css"
          rel="stylesheet" type="text/css"/>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.min.css">
    <link rel="stylesheet" href="http://stage-o2.prod.quest.corp/SQ/Static/CSS/web-queue-plugins-style.min.css"/>
    <link rel="stylesheet"
          href="http://stage-o2.prod.quest.corp/SQ/Static/Scripts/RequestQueues/qtip/jquery.qtip-custom.min.css"/>
    <link rel="stylesheet" href="http://stage-o2.prod.quest.corp/SQ/Static/CSS/bootstrap.min.css" type="text/css"/>
    <link rel="stylesheet" href="/SQ/Static/CSS/custom-ui.min.css"/>
    <link rel="stylesheet" href="http://stage-o2.prod.quest.corp/SQ/Static/CSS/custom-ui-is.min.css"/>

    <script type="text/javascript">
        var RootPath = "http://stage-o2.prod.quest.corp/SQ/",
          WebMarketingRootPath = "http://webmarketingstage.prod.quest.corp",
          O2URL = "http" + '://' + "stage-o2" + "http://stage-o2.prod.quest.corp/SQ/";
    </script>

    <script src="//code.jquery.com/jquery-1.10.2.min.js"></script>
    <script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
    <script src="//software.dell.com/hidden/scripts/angular.min.js"></script>
    <script src="//software.dell.com/hidden/scripts/angular-sanitize.min.js"></script>

    <script type="text/javascript" src="/SQ/Static/Scripts/RequestQueues/jquery.multiple.select.min.js"></script>
    <script type="text/javascript" src="http://stage-o2.prod.quest.corp/SQ/Static/Scripts/jquery.validate.min.js"></script>
    <script type="text/javascript" src="http://stage-o2.prod.quest.corp/SQ/Static/Scripts/jquery.validate.unobtrusive.min.js"></script>
    <script type="text/javascript" src="http://stage-o2.prod.quest.corp/SQ/Static/Scripts/jqueryDateFormat.js"></script>
    <!--[if IE 9]>
    <script type="text/javascript" src="/SQ/Static/Scripts/RequestQueues/jquery.placeholder.min.js"></script>
    <![endif]-->
    <script type="text/javascript" src="http://stage-o2.prod.quest.corp/SQ/Static/Library/bowser-master/bowser.min.js"></script>
    <script type="text/javascript" src="http://stage-o2.prod.quest.corp/SQ/View-Scripts/Common.min.js"></script>
    <script type="text/javascript" src="//code.jquery.com/ui/1.10.3/jquery-ui.min.js"></script>
    <script type="text/javascript" src="/SQ/Static/Scripts/RequestQueues/bootstrap-3.3.4.min.js"></script>
    <script type="text/javascript" src="http://stage-o2.prod.quest.corp/SQ/Static/Scripts/moment.min.js"></script>
    <script type="text/javascript" src="http://stage-o2.prod.quest.corp/SQ/View-Scripts/PlugIn/idapJQuery.js"></script>
    <script type="text/javascript"
            src="http://stage-o2.prod.quest.corp/SQ/Static/Scripts/jquery.cookie.min.js"></script>
    <script type="text/javascript" src="/SQ/Static/Scripts/RequestQueues/web-queue-plugins.min.js"></script>
    <script type="text/javascript" src="/SQ/Static/Scripts/RequestQueues/qtip/jquery.qtip.min.js"></script>
    <script type="text/javascript" src="http://stage-o2.prod.quest.corp/SQ/Static/Scripts/TimeZone.min.js"></script>
    <script type="text/javascript"
            src="//software.dell.com/hidden/scripts/kendo/kendo.custom.singlequeuelisting.min.js"></script>
    <script>
        var endPoints = {
            users: RootPath + "Common/GetSearchMKUserNames",
            projects: RootPath + "SingleQueue/ProjectsData_Get",
            campaigns: RootPath + "SingleQueue/CampaignData_Get"
        };

        var requestStatuses = new Array();
        requestStatuses["e8031367-8c77-428d-9ed7-1a893f9df71b"] = "idea";
        requestStatuses["e569ecf1-8848-4f46-9444-88a044fd3d5a"] = "done";
        requestStatuses["0b90b122-df41-4bd0-8860-93a037f63345"] = "backlog";
        requestStatuses["ba556a23-6639-4033-bba3-b0818e5e94c1"] = "started";
        requestStatuses["d092c288-d631-418d-ad3d-b1c2c30769d7"] = "council";
        requestStatuses["9fa11812-dcec-492c-9886-c15c3255e2b7"] = "cancelled";

        var SelectedProjectID = 0;
        var SelectedProjectName = "";
    </script>

    <script src="/SQ/Static/Scripts/RequestQueues/sq-listings-module.js"></script>
    <script type="text/javascript" src="/SQ/Static/Scripts/RequestQueues/ribbon.js"></script>
    <script type="text/javascript" src="/SQ/Static/Scripts/RequestQueues/o2-global-modules.js"></script>
    <script>
        kendo.culture("en-US");
    </script>
    <script type="text/javascript"
            src="http://stage-o2.prod.quest.corp/SQ/View-Scripts/_RequestQueuesLayoutV2.min.js"></script>
</head>

<body>

<div class="wrapper">
	<?php
		echo file_get_contents('../widgets/top-area.tmpl.htm');
	?>
</div>

<?php
	echo $widget->content();
?>


            <script src="http://stage-o2.prod.quest.corp/SQ/static/scripts/RequestQueues/custom-ui.js"></script>
<?php
  $localURL = $_SERVER['REQUEST_URI'];
  if($localURL == 'http://stage-o2.prod.quest.corp/SQ/singlequeue/pages/view_requests/view-requests.html'){
	  echo "<script src=\"http://stage-o2.prod.quest.corp/SQ/static/scripts/RequestQueues/ribbon.js\"></script>";
  }

?>
			<script src="http://stage-o2.prod.quest.corp/SQ/static/scripts/RequestQueues/single-queue.js"></script>
			<script src="http://stage-o2.prod.quest.corp/SQ/static/scripts/RequestQueues/sq-listings-module.js"></script>
			<script src="http://stage-o2.prod.quest.corp/SQ/static/scripts/RequestQueues/o2-global-modules.js"></script>




<?php
	echo $widget->js();
?>

<script>
	$(document).ready(function() {
		if ($('#tabs').length > 0) {
			$('#tabs').tabs({
				active: 0,
				beforeActivate: function(event, ui) {
					return CheckParentDataChanges();
				},
				activate: function(event, ui) {
					//Add/Remove vertical pipe on the tabs when an individual tab is activated.
					var indx = $('#tabs').find('> ul > li').index(ui.newTab);
					//alert(indx);
					var id = ui.newTab.find('a').attr('href');

					if (!$(id).data('processed')) {
						if (id == '#oasis2') {
							window.parent.location.href = "http://stage-o2.prod.quest.corp/";
							$('#sub-logo').attr('src', '/images/portal/images/sublogo-oasis2.png');
						}
						else {
							window.parent.location.href = "http://stage-o2.prod.quest.corp/SQ/RequestQueues/Requests/";
							$('#sub-logo').attr('src', '/images/portal/images/sublogo-marketing-request-queue.png');
						}

						$(id).data('processed', true);
					}

					var imgsrc = '';
					var linkurl = '';

					if (id == '#oasis2') {
						imgsrc = '/images/portal/images/sublogo-oasis2.png';
						linkurl = 'http://stage-o2.prod.quest.corp/'
					}
					else {
						imgsrc = '/images/portal/images/sublogo-marketing-request-queue.png';
						linkurl = 'http://stage-o2.prod.quest.corp/SQ/RequestQueues/Requests/'
					}

					$('#sub-logo').attr('src', imgsrc);
					$('#sub-logo-link').attr('href', linkurl);

					$('#tabs').find('> ul > li').removeClass('hide-pipe');

					if (indx) {
						for (var c = indx - 1; c >= 0; c--) {
							var tab = $('#tabs').find('> ul > li:eq(' + c + ')');

							if (tab.is(':visible')) {
								tab.addClass('hide-pipe');
								break;
							}
						}
					}

				}
			}).show();
		}

		$("a#ui-id-1").click(function() {
			if ("0" == "0") {
				if (CheckParentDataChanges()) {
					window.parent.location.href = "http://stage-o2.prod.quest.corp/SQ/RequestQueues/Requests/";
				}
			}
		});
	});

	function doSearch() {
		var q = document.getElementById("search-query").value;
		var t = 0;
		var targets = document.getElementsByName("searchtype");
		for (var i = 0; i < targets.length; i++) {
			if (targets[i].checked) {
				t = targets[i].value;
			}
		}

		if (q.length > 0) {
			var searchUrl = "/include/search.aspx?q=" + encodeURIComponent(q) + "&t=" + t;
			window.open(searchUrl, "_blank");
		}

		return false;
	}

	function onSearchKeyPress(e) {
		if (e.keyCode == 13) {
			doSearch();
		}
	}

	function CheckParentDataChanges() {
		try {
			if (typeof parent.CheckDataChanges == 'undefined') {
				return true;
			}
			else {
				if (parent.CheckDataChanges()) {
					parent.ClearDataChangesCheck();
					return true;
				}
				else {
					return false;
				}
			}
		} catch (e) {
		}
	}
</script>
</body>
</html>