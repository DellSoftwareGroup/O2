<?php require 'widget.class.php'; $widget = new Widget(); ?><!DOCTYPE html>
<html>
<head lang="en">
	<meta charset="UTF-8">
	<title>View Request Listings</title>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">

	<script>
		//document.location.href = document.location.href.replace("/v2", "/mk/");
		var RootPath = "http://qa-o2.prod.quest.corp/v2/";
		var WebMarketingRootPath = "http://webmarketingstage.prod.quest.corp";
		var O2URL = "http" + '://' + "qa-o2.prod.quest.corp" + "http://qa-o2.prod.quest.corp/v2/";
	</script>

	<script type="text/javascript" src="http://qa-o2.prod.quest.corp/v2/Static/Scripts/jquery-1.10.2.min.js"></script>
	<script type="text/javascript" src="http://qa-o2.prod.quest.corp/v2/Static/Scripts/jquery-migrate-1.2.1.min.js"></script>
	<script type="text/javascript" src="//code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
	<script src="/mk/static/scripts/RequestQueues/bootstrap-3.3.4.min.js"></script>
	<script src='http://qa-o2.prod.quest.corp/v2/Static/Scripts/moment.min.js'></script>

	<!-- Initialize jQuery Plugins -->
	<script src="/mk/static/scripts/RequestQueues/jquery.multiple.select.min.js"></script>
	<script src="http://qa-o2.prod.quest.corp/v2/Static/Scripts/jquery.cookie.js"></script>
	<script src="http://qa-o2.prod.quest.corp/v2/Static/Scripts/RequestQueues/web-queue-plugins.js"></script>
	<script src="http://qa-o2.prod.quest.corp/v2/Static/Scripts/RequestQueues/qtip/jquery.qtip.js"></script>
	<script src='http://qa-o2.prod.quest.corp/v2/Static/Scripts/fullcalendar/fullcalendar.min.js'></script>
	<script src="http://qa-o2.prod.quest.corp/v2/Static/Scripts/jquery.validate.min.js"></script>
	<script src="http://qa-o2.prod.quest.corp/v2/Static/Scripts/jquery.validate.unobtrusive.min.js"></script>
	<script src="http://qa-o2.prod.quest.corp/v2/Static/Scripts/jqueryDateFormat.js"></script>
	<script src="http://qa-o2.prod.quest.corp/v2/Static/Scripts/RequestQueues/jquery.placeholder.min.js"></script>
	<script src="http://qa-o2.prod.quest.corp/v2/Static/Library/bowser-master/bowser.min.js"></script>

	<script src="http://qa-o2.prod.quest.corp/v2/View-Scripts/Common.js"></script>

	<!-- Kendo UI -->

	<link href="http://qa-o2.prod.quest.corp/v2/Static/Content/kendo/2015.1.318/kendo.requestqueues.css" rel="stylesheet" type="text/css">
	<script src="http://qa-o2.prod.quest.corp/v2/Static/Scripts/kendo/2015.1.429/kendo.all.min.js"></script>
	<script src="http://qa-o2.prod.quest.corp/v2/Static/Scripts/kendo/2015.1.429/kendo.aspnetmvc.min.js"></script>
	<script>
		kendo.culture("en-US");
	</script>

	<script src='http://qa-o2.prod.quest.corp/v2/Static/Scripts/browser-warning.js'></script>
	<script src="http://qa-o2.prod.quest.corp/v2/Static/Scripts/TimeZone.js"></script>

	<link rel="stylesheet" href="//code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css">
	<link rel="stylesheet" href="/mk/static/css/bootstrap.min.css">
	<!--<link rel="stylesheet" href="http://qa-o2.prod.quest.corp/v2/Static/Content/RequestQueues/RequestQueues.css">
	<link rel="stylesheet" href="http://qa-o2.prod.quest.corp/v2/Static/Content/RequestQueues/Header.css">-->

	<!--<link rel="stylesheet" href="http://qa-o2.prod.quest.corp/v2/Static/CSS/web-queue-plugins-style.css" >-->
	<link rel="stylesheet" href="http://qa-o2.prod.quest.corp/v2/Static/CSS/smoothness/jquery-ui-1.9.2.custom.css">
	<link rel="stylesheet" href="http://qa-o2.prod.quest.corp/v2/Static/Scripts/RequestQueues/qtip/jquery.qtip.css">
	<link rel="stylesheet" href="http://qa-o2.prod.quest.corp/v2/Static/CSS/smoothness/jquery-ui-1.9.2.custom.css">
	<link rel="stylesheet" href="http://qa-o2.prod.quest.corp/v2/Static/Scripts/RequestQueues/qtip/jquery.qtip.css">
	<link rel="stylesheet" href="http://qa-o2.prod.quest.corp/v2/Static/Scripts/fullcalendar/fullcalendar.min.css">
	<link rel="stylesheet" href="http://qa-o2.prod.quest.corp/v2/Static/CSS/warning.css">
	<!--<link rel="stylesheet" href="http://qa-o2.prod.quest.corp/v2/Static/CSS/project-form.css">-->

	<style>
		#tabs > ul > li.ui-tabs-active a {
			cursor: pointer !important;
		}
	</style>

	<!-- */ End of Kendo and IS JS and Styles -->

	<!-- Global ui styles and js -->
	<link rel="stylesheet" href="/mk/static/css/custom-ui.css">
	
	<?php
		echo $widget->css();
	?>


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


            <script src="/mk/static/scripts/RequestQueues/custom-ui.js"></script>
<?php
  $localURL = $_SERVER['REQUEST_URI'];
  if($localURL == '/mk/singlequeue/pages/view_requests/view-requests.html'){
	  echo "<script src=\"/mk/static/scripts/RequestQueues/ribbon.js\"></script>";
	  echo "<script src=\"/mk/static/scripts/RequestQueues/single-queue.js\"></script>";
	  echo "<script src=\"/mk/static/scripts/RequestQueues/sq-listings-module.js\"></script>";
  }

?>
			<script src="/mk/static/scripts/RequestQueues/o2-global-modules.js"></script>




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
							window.parent.location.href = "http://stage-o2.prod.quest.corp/mk/RequestQueues/Requests/";
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
						linkurl = 'http://stage-o2.prod.quest.corp/mk/RequestQueues/Requests/'
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
					window.parent.location.href = "http://stage-o2.prod.quest.corp/mk/RequestQueues/Requests/";
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