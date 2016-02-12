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


	/* Public methods*/
	function ribbonPopupModule() {
		/* ------> Scope varibles <------- */
		var targetInput = "#ownerInput", popupTrigger = '.popoverMS';

		/* ------> Factories <------- */
		// Popover factory
		function PopoverHtmlBuilder(filter) {
			//Create content section of popover
			this.msPopoverContent = String()
					+ '<form class="dyn-select-form">'
					+ '<div class="k-content">'
					+ '<label for="ownerInput">' + filter + '</label>'
					+ '<input id="ownerInput" />'
					+ '</div>'
					+ '<div class="panel panel-default taglist-parent" style="display:none;">'
					+ '<div class="panel-body">'
					+ '<div  unselectable="on">'
					+ '<ul role="listbox" unselectable="on" class="k-reset" id="ownerInput_taglist_prev"></ul>'
					+ '</div>'
					+ '</div>'
					+ '</div>'
					+ '<button type="button" class="btn btn-default popOverbtn">Close</button>'
					+ '<button type="button" class="btn btn-primary saveSelected">Select</button>'
					+ '</form>';

			//Create popover template
			this.msHtmlPopover = String()
					+ '<div class="popover ribbon-popover" role="tooltip" >'
					+ '<div class="arrow">'
					+ '</div>'
					+ '<h3 class="popover-title"></h3>'
					+ '<div class="popover-content" >'
					+ '</div>'
					+ '</div>';

			return {
				content: this.msPopoverContent,
				tmpl: this.msHtmlPopover
			}
		};
		// Dynamic Select factory
		function BuildDynamicSelect(wrapper) {
			this.createSelectElem = function () {
				if ($(wrapper).find('.dynamic-select').length == 0) {
					$(wrapper).append('<select class="dynamic-select" style="display:none">');
				}

			};
			this.createOption = function (option) {
				$(wrapper).find('.dynamic-select').append('<option value="' + option.value + '">' + option.text + '</option>');
			};
			this.optionsCount = function () {
				var count = $(wrapper).find('option').length;
				return count;
			};
			this.sanitizeLabel = function (label) {
				var tagTxtArr = label.split(' ');
				tagTxtArr.pop();
				label = tagTxtArr.toString();
				return label;
			};
			this.addCountToLabel = function () {
				var tagTxt = $(wrapper).find('span[data-title]').text();

				// check if tag has been modified with parenthesis
				if (tagTxt.indexOf('(') > -1) {
					tagTxt = this.sanitizeLabel(tagTxt);

					// check if options container is not empty when options are removed
					if (this.optionsCount() !== 0) {
						tagTxt = tagTxt + ' (' + this.optionsCount() + ')';
						$(wrapper).find('span[data-title]').text(tagTxt);
					} else {
						$(wrapper).find('span[data-title]').text(tagTxt);
					}
				} else {
					tagTxt = tagTxt + ' (' + this.optionsCount() + ')';
					$(wrapper).find('span[data-title]').text(tagTxt);
				}

			}
		};


		/* ------> Private Functions <------- */
		// initiate kendo multiselect
		function initKendoMultiSelect() {
			$("#ownerInput").kendoMultiSelect({
				filter: "contains",
				separator: ", ",
				minLength: 2,
				dataSource: {
					//serverFiltering: true, -> This setting needs to be activated when pulling data from server
					transport: {
						read: {
							url: '/mk/singlequeue/widgets/views/data/users.json',
							datatype: 'json'
						}
					},
					schema: {
						type: 'json',
						data: 'data'
					}
				},
				dataTextField: "Name",
				dataValueField: "Alias"
			});
				}

		// add Previously selected options to popover
		function addPrevSelectionsToPopover(target) {
			var $dynamicSelect = $(target).find('.dynamic-select');

			if ($dynamicSelect.length > 0) { // check if dynamic select has been created

				if ($dynamicSelect.find('option').length > 0) { // if options are existing show
					$('.taglist-parent').show();
				}
				$dynamicSelect.find('option').each(function () {
					var name = $(this).text();
					var temp = String()
							+ '<li class="k-button" unselectable="on"><span unselectable="on">' + name + '</span><span unselectable="on" class="k-select">'
							+ '<span unselectable="on" class="k-icon k-i-close remove-prev">delete</span></span></li>';

					// attach li to popover
					$('#ownerInput_taglist_prev').append(temp);
				})
					}
			$(this).find('')
		};

		function removePrevOptions(target, option) {
			var $dynamicSelect = $(target).find('.dynamic-select'),
					cleanTag = new BuildDynamicSelect(target);

			$dynamicSelect.find('option').each(function () {
				if ($(this).text() == option) {
					$(this).remove();
						}
			});
			// remove frame if no previous options
			if ($dynamicSelect.find('option').length == 0) {
				$('.taglist-parent').hide('slow');
					}
			// re-adjust tag count
			cleanTag.addCountToLabel();
				}

		/* ------> Utility Functions <------- */
		// Detects filter's title
		function whichFilter(target) {
			var ckFilter = '';
			$(target).find('span').each(function () {
				if ($(this).data('title')) {
					ckFilter = $(this).data('title');
				}
			});
			return ckFilter;
		};

		function closePopup() {
			$(popupTrigger).popover('destroy');
		};

		function saveSelected() {
			var $selctWrapper = $(targetInput).closest('li').find(popupTrigger),
					buildNewSelect = new BuildDynamicSelect($selctWrapper);

			// check if first if any name has been selected
			if ($(targetInput).find('option[selected]').length > 0) {

				// prepare select element
				buildNewSelect.createSelectElem();

				// iterate each option and attach to new selection
				$(targetInput).find('option').each(function () {
					if ($(this).attr('selected')) {
						buildNewSelect.createOption(this);
					}
				});
				buildNewSelect.addCountToLabel();
				closePopup();
			} else {
				alert('Please select Owner name'); //TODO: Should we spend time styling this
					}

		};

		/* ------> Dom, Events and Triggers <------- */
		// initiate popover
		$(popupTrigger).on('click', function () {

			var buildHtml = new PopoverHtmlBuilder(whichFilter(this));

			$(this).popover({
				html: true,
				placement: 'left',
				content: buildHtml.content,
				template: buildHtml.tmpl
			});
			$(this).popover("show");

			initKendoMultiSelect();
			addPrevSelectionsToPopover(this);
		});

		// close popover
		$('#filters-section').on('click', '.popOverbtn', function () {
			closePopup()
		})

		// handle selected
		$('#filters-section').on('click', '.saveSelected', saveSelected);

		// remove previous selection
		$('#filters-section').on('click', '.remove-prev', function () {
			var target = $(this).parents('.popover').siblings(popupTrigger),
					thisOption = $(this).parents('li.k-button'),
					thisName = thisOption.find('span').eq(0).text();

			// remove it from DOM
			removePrevOptions(target, thisName);

			// remove it from popover
			thisOption.remove();

		});

	} // end of ribbonPopupMultiSelect


  function init() {

  }

  return {
    init: init,
		ribbonPopupModule: ribbonPopupModule
  }

}(jQuery));


$(function () {
	if ($('.sq-top-ribbon').length === 0) {
		var timerOne = setInterval(function () {  // timer needed only for localhost
			if ($('.sq-top-ribbon').length > 0) {
				commonWidgets.ribbonPopupModule();
				clearInterval(timerOne);
			}
		}, 1000);
	}
});