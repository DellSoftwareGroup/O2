/**
 * Created by jleon on 3/11/2016.
 */

var globalModules = function () {

	var customModals = function () {

		function ModalHtmlBuilder(modalInfo) {

			this.modal = String()
					+ '<div class="modal fade custom-modal" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">'
					+ '<div class="modal-dialog" role="document">'
					+ '<div class="modal-content">'
					+ '<div class="modal-header">'
					+ '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
					+ '<h4 class="modal-title" id="myModalLabel">' + modalInfo.title + '</h4>'
					+ '</div>'
					+ '<div class="modal-body">'
					+ modalInfo.content
					+ '</div>'
					+ '<div class="modal-footer">'
					+ '<button type="submit" class="btn select-btn btn-primary">Select</button>'
					+ '<button type="reset" class="btn reset-btn btn-default">Reset</button>'
					+ '</div></div></div></div>';

			this.initModal = function () {
				$('#body-content').append(this.modal);
			};

			this.show = function () {
				$('#myModal').modal('show');
			};

			this.preventEventPropagation = function () {
				$(".modal").click(function (e) {
					e.stopPropagation();
					e.preventDefault();
				});
			}

			this.afterModalLoad = function (process) {
				$('#myModal').on('shown.bs.modal', function (e) {
					process();
				})
			}

			this.destroyListener = function () {
				$('#myModal').on('hidden.bs.modal', function (e) {
					$('body').find('.custom-modal').remove();
				})
			}
		}


		// Module variables
		var subFilter = {
			alias: null,
			refresh: false,
			isOwnerOrRequester: null,
			destroySubFilter: null,
			status: null,
			SearchByID: false
		};

		// Private & helpers
		function removeInputKendoStyles(targetInput) {
			$(targetInput).removeClass('k-input').parent().removeClass("k-widget k-autocomplete k-header form-control");
		}

		function groupByCreatorName(results) {
			var namesList = [];
			objNameList = [];
			if (Array.isArray(results.data)) {
				results.data.forEach(function (campaign) {

					if ($.inArray(campaign.CreatedByName, namesList) == -1) {

						namesList.push(campaign.CreatedByName); // intersections array
						campgnObj = {};
						campgnObj.name = campaign.CreatedByName;
						campgnObj.alias = campaign.CreatedBy;
						objNameList.push(campgnObj); // consumable object array

					}
				})
			} else {
				console.error('see ribbon.js | function:: groupByCreator')
			}
			objNameList.pop();
			namesList.pop(); // always the last is null;
			return objNameList;
		}

		function refreshModal(selectElm, option, inputTarget) {
			subFilter.alias = option;
			subFilter.refresh = true;
			if (inputTarget.indexOf('campaign') > -1) {
				campaignModal.initCampaignAutoComplete(inputTarget); // refresh kendo autocomplete;
			} else {
				projectModal.initProjectAutoComplete(inputTarget);
			}
			removeInputKendoStyles(inputTarget);
		}

		function exportSelectedToPopover(target, option, callback) {

			if ($.isEmptyObject(option)) {
				alert('Please make a selection')
				return
			}

			// find which modal (campaign or project : may grow later)
			var $modalName = $('.custom-modal form').data('modalname');

			if (typeof callback == 'function') {
				callback($modalName);
			}

			// attach values
			$('[data-modal-target=' + $modalName + ']')
					.html(option.name)
					.attr('filterId', option.val);

			$('#myModal').modal('hide')
		}

		// public methods
		var campaignModal = function () {

			function runCampaignModal() {
				var campaignInfo = {};

				campaignInfo.content = String()
						+ '<div>'
						+ '<form class="form-horizontal" data-modalName="campaign">'
						+ '<div class="form-group">'
						+ '<label for="campaignFilter">Campaign name: </label>'
						+ '<input type="text" class="form-control" id="campaignFilter" placeholder="Campaign">'
						+ '<div id="hidenDropdown" style="display: none"></div>'
						+ '</div>'
						+ '<p>And</p>'
						+ '<div class="form-group">'
						+ '<label for="campaignCreator">Campaign Creator: </label>'
						+ '<select  id="campaignCreator" class="form-control" placeholder="Campaign">'
						+ addCreatorOptions(campaignCreatorNames)
						+ '</select>'
						+ '</div>'
						+ '<p></p>'
						+ '<select class="campFilterResults form-control" size="12" style="width:490px;"></select>'
						+ '</form></div>';
				campaignInfo.title = 'Search Campaign';

				var buildModal = new ModalHtmlBuilder(campaignInfo);

				buildModal.initModal();
				buildModal.show();
				buildModal.preventEventPropagation();
				buildModal.afterModalLoad(function () {
					var selectedOption = {}
					// campaign select dropdown
					$('.campFilterResults').change(function (e) {
						selectedOption = {
							val: e.target.selectedOptions[0].value,
							name: e.target.selectedOptions[0].text
						}
					});

					// bind select btn event
					$('.custom-modal .select-btn').click(function () {

						// checks if ribbon exist
						if ($('.sq-top-ribbon')) {
							var callback = ribbonWidgets.moreFiltersPopover.onModalInputchange;
							exportSelectedToPopover(this, selectedOption, callback);
						} else {
							exportSelectedToPopover(this, selectedOption);
						}

					});

					// bind reset btn event
					$('.custom-modal .reset-btn').click(function () {
						$('#campaignCreator').val('All');
						$('#campaignFilter').val('');
						$('.campFilterResults').html(''); // make sure all options are new
						subFilter.key = '';
						return
						// clear previous searches
					});
					// clear previous option
					$('#campaignFilter').on('focus', function () {
						subFilter.key = '';
					});

					// add selected attr
					$('#campaignCreator').on('change', function (e) {
						var selectElm = e.target;
						var option = $(selectElm).find('option:selected').val(); // get selected value which is Alias
						refreshModal(selectElm, option, '#campaignFilter');
					});
				});
				buildModal.destroyListener();

				initCampaignAutoComplete('#campaignFilter');
				// remove kendo styles
				removeInputKendoStyles("#campaignFilter");
			};

			var campaignCreatorNames = function () {
				$.ajax({
					url: endPoints.campaigns,
					dataType: 'json',
					success: function (data) {
					},
					error: function (error) {
						console.error(error);
					}
				}).done(function (data) {
					campaignCreatorNames = groupByCreatorName(data);
				});

			}();

			function initCampaignAutoComplete(id) {

				var campaignDataSource = new kendo.data.DataSource({
					serverFiltering: true,
					transport: {
						read: function (options) {
							if (typeof options.data.filter != 'undefined') {
								subFilter.key = options.data.filter.filters[0].value;
								$.ajax({
									url: endPoints.campaigns + "?key=" + options.data.filter.filters[0].value,
									dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
									success: function (result) {
										// notify the data source that the request succeeded
										options.success(result.data);
										resultsData = result.data; //need to pull additional data: email
									},
									error: function (result) {
										// notify the data source that the request failed
										options.error(result);
									}
								});
							}
							else {
								options.success([]);
							}
						}
					},
					change: function (e) {
						$('.campFilterResults').html('');
						var view = campaignDataSource.view();
						if (subFilter.alias !== null && subFilter.alias !== "All") { // if creator has been selected
							var resultsTally = [];
							view.forEach(function (results) {
								if (results.CreatedBy == subFilter.alias) {
									$('.campFilterResults').append('<option value="' + results.ID + '">' + results.Name + '</option>');
									resultsTally.push(results.Name);
								}
								;
							});
							if (resultsTally.length === 0) {
								$('.campFilterResults').append('<option>0 Camapigns found!</option>');
							} else {
								resultsTally = [];
							}
						} else {
							for (var i = 0; i < view.length; i++) {
								$('.campFilterResults').append('<option value="' + view[i].ID + '">' + view[i].Name + '</option>');
							}
						}
					}
				});

				$(id).kendoAutoComplete({
					dataSource: campaignDataSource,
					filter: "contains",
					dataTextField: "Name",
					minLength: 3,
					popup: {
						appendTo: $("#hidenDropdown")
					},
					animation: false
				});
				var autocomplete = $(id).data("kendoAutoComplete");

				if (subFilter.refresh === true) {
					autocomplete.search(subFilter.key); // kendo .search() method is the only way to dynamically trigget change event!
				}
			}

			function addCreatorOptions(nameList) {
				var names = '<option>All</option>';
				if (Array.isArray(nameList)) {
					nameList.forEach(function (creator) {
						currntName = String()
								+ '<option value="' + creator.alias + '">'
								+ creator.name
								+ '</option>';
						names = names + currntName;
					})
				}
				return names;
			}

			return {
				runCampaignModal: runCampaignModal,
				initCampaignAutoComplete: initCampaignAutoComplete
			}
		}();

		var projectModal = function () {

			// Project Modal
			function runProjectModal() {
				var projectInfo = {}, projFiltersPreData = {}, ownerOrRequester = 'clean';

				// Internal methods
				function splitDataByFilter(data) {
					var requestors = ['All Requestors'], owners = ['All Owners'], ids = [], dataArray = data.data;

					if (Array.isArray(dataArray)) {
						dataArray.forEach(function (projInfo) {
							var requestor, id, owner;

							// Handle Null properties
							requestor = (projInfo.RequestedByName == null) ? 'No Requestor' : projInfo.RequestedByName;
							id = (projInfo.ID == null) ? 'No ID' : projInfo.ID;
							owner = (projInfo.OwnedByName == null) ? 'No Owner' : projInfo.OwnedByName;


							// create requestor array
							if ($.inArray(requestor, requestors) == -1) {
								requestors.push(requestor); // intersections array
							}

							// create IDs array
							if ($.inArray(id, ids) == -1) {
								ids.push(id); // intersections array
							}

							// create Owners array
							if ($.inArray(owner, owners) == -1) {

								owners.push(owner); // intersections array
							}
						})
					}
					projFiltersPreData = {
						requestors: requestors,
						IDs: ids,
						owners: owners
					}

				}

				(function getProjectData() {
					$.ajax({
						url: endPoints.projects,
						dataType: 'json',
						success: function (data) {
							splitDataByFilter(data);
						},
						error: function (error) {
							console.error(error);
						}
					});

				}());

				function initOwnerReqAutoComp(selected) {

					subFilter.isOwnerOrRequester = selected;
					var dataSource = (selected == 'ProjOwner') ? projFiltersPreData.owners : projFiltersPreData.requestors

					$('#ownerOrRequester').kendoAutoComplete({
						filter: "contains",
						dataSource: {
							data: dataSource
						},
						minLength: 3,
						select: function (e) {
							var item = e.item;
							var text = item.text();
							var selectElm = e.item;
							var option = item.text(); // get selected value which is Alias
							refreshModal(selectElm, option, '#nameOrID');
						}
					});

					// owner and request dataSource
					var OandRDataSource = $('#ownerOrRequester').data("kendoAutoComplete");

					if (subFilter.refresh) {
						OandRDataSource.refresh();
						initProjectAutoComplete('#nameOrID');
					}
					removeInputKendoStyles('#ownerOrRequester');
				}

				var InputByIdStyles = "display:none; position: absolute; left:0; top: 0;";
				projectInfo.content = String()
						+ '<div>'
						+ '<form class="form-horizontal" data-modalName="project">'
						+ '<div class="form-inline firstProjFilter mb-10" >'
						+ '<select class="form-control" id="projectSelectFirst">'
						+ '<option value="ProjName">Project Name</option>'
						+ '<option value="ProjId">Project ID</option>'
						+ '</select>'
						+ '<div style="position: relative; display: inline-block">'
						+ '<input type="text" class="form-control resetable" id="nameOrID">'
						+ '<input type="text" class="form-control resetable" id="searchById" style="' + InputByIdStyles + '">'
						+ '</div>'
						+ '<div id="hidenDropdown" style="display: none"></div>'
						+ '</div>'
						+ '<div class="form-inline secondProjFilter mb-10">'
						+ '<select class="form-control" id="projectSelectSecond">'
						+ '<option value="ProjOwner">Project Owner</option>'
						+ '<option value="ProjRequester">Project Requester</option>'
						+ '</select>'
						+ '<input type="text" class="form-control resetable" id="ownerOrRequester">'
						+ '</div>'
						+ '<div class="form-inline thirdProjFilter mb-20">'
						+ '<select class="form-control resetable" id="projectSelectThird" style="width:490px;">'
						+ '<option value="">Select Project Status...</option>'
						+ '<option value="Idea">Idea</option>'
						+ '<option value="Backlog">Backlog</option>'
						+ '<option value="Started">Started</option>'
						+ '<option value="Done">Done</option>'
						+ '<option value="Council">Council</option>'
						+ '<option value="Cancelled">Cancelled</option>'
						+ '</select>'
						+ '</div>'
						+ '<div class="modal-results" style="position:relative">'
						+ '<select class="projectFilterResults form-control" size="12" style="width:490px;"></select>'
						+ '<span class="k-icon k-loading" style="display: none"></span>'
						+ '</div>'
						+ '</form></div>';
				projectInfo.title = 'Search project';

				var buildModal = new ModalHtmlBuilder(projectInfo);

				buildModal.initModal();
				buildModal.show();
				buildModal.preventEventPropagation();
				buildModal.afterModalLoad(function () {

					// when serching by ID
					$('#projectSelectFirst').on('change', function (e) {
						if ($(this).val() == 'ProjId') {
							$.when(
									$('#searchById').css('display', 'inline-block')
							).then(
									$('.secondProjFilter, .thirdProjFilter').hide('slow')
							);
							resetProjModal();
							initSearchById('#searchById');
						} else {
							$('#searchById').css('display', 'none');
							$('.secondProjFilter, .thirdProjFilter').show('slow');
							resetProjModal();
							initProjectAutoComplete('#nameOrID');
						}
					})

					// trigger autocomplete when change of owner / requester
					$('#projectSelectSecond').on('change', function () {
						initOwnerReqAutoComp($(this).val());
					});

					// trigger autocomplete when focus on owner/requester input
					$('#ownerOrRequester').on('focus', function () {

						if (ownerOrRequester == 'clean') { // prevent being trigger multiple times
							initOwnerReqAutoComp($('#projectSelectSecond').val());
							ownerOrRequester = 'durty';
						}
					});

					// when owner or requested field is cleared we need to show all
					// trigger autocomplete when focus on owner/requester input
					$('#ownerOrRequester').on('blur', function () {

						if ($('#ownerOrRequester').val() == '') { //  chech if name has been clear
							subFilter.alias = null;  // clear name from reference obj
							initOwnerReqAutoComp($('#projectSelectSecond').val()); // initialize process
							ownerOrRequester = 'durty';
						}

					});

					// when status is selected
					$('#projectSelectThird').on('change', function () {

						subFilter.status = $(this).val() == '' ? null : $(this).val();
						subFilter.refresh = true;
						initProjectAutoComplete('#nameOrID');
						;
					});

					// reset
					$('.reset-btn').on('click', function () {
						resetProjModal();
					});

					// when clicked select button
					$('.select-btn').on('click', function () {
						var exportSelected = {};
						exportSelected.name = $('.projectFilterResults').find('option:selected').data('name');
						exportSelected.val = $('.projectFilterResults').find('option:selected').val();

						// checks if ribbon exist
						if ($('.sq-top-ribbon')) {
							var callback = ribbonWidgets.moreFiltersPopover.onModalInputchange;
							exportSelectedToPopover(null, exportSelected, callback);
						} else {
							exportSelectedToPopover(null, exportSelected);
						}

					});


				});
				buildModal.destroyListener();

				initProjectAutoComplete('#nameOrID');
			}

			// Kendo Data processing
			function initProjectAutoComplete(projectFilter) {

				// search by Title
				var projectDataSource = new kendo.data.DataSource({
					serverFiltering: true,
					transport: {
						read: function (options) {
							if (typeof options.data.filter != 'undefined') {
								subFilter.key = options.data.filter.filters[0].value;
								$.ajax({
									url: endPoints.projects + "?name=" + options.data.filter.filters[0].value,
									dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
									beforeSend: function (xhr) {
										$('.projectFilterResults').html(''); // clear results
										$('.modal-results span').toggleClass('custom-loading');
									},
									success: function (result) {
										// notify the data source that the request succeeded
										options.success(result.data);
										resultsData = result.data; //need to pull additional object properties (campagin owner, status etc)
									},
									error: function (result) {
										// notify the data source that the request failed
										options.error(result);
									}
								});
							}
							else {
								options.success([]);
							}
						}
					},
					change: function (e) {
						var filtered = [], resultsTally = [];
						var view = projectDataSource.view();

						// no subfilter modified
						if ((subFilter.alias == null || subFilter.alias.indexOf('All') != -1) && subFilter.status == null) {
							for (var i = 0; i < view.length; i++) {
								appendToResults('.projectFilterResults', view[i]);
							}
							return;
						}

						// filter owner / Requester
						if (subFilter.alias !== null && subFilter.alias.indexOf('All') == -1) { // if creator has been selected

							view.forEach(function (result) {

								//what are they using for filtering owner or requeter
								var name = (subFilter.isOwnerOrRequester == 'ProjOwner') ? result.OwnedByName : result.RequestedByName;

								if (name == subFilter.alias) {

									if (subFilter.status !== null) { // if status has also been selected
										filtered.push(result);
									} else {
										appendToResults('.projectFilterResults', result);
										resultsTally.push(result.Name);
									}
								}
							});

						}
						;

						// filter status
						if (subFilter.status !== null) {
							if (filtered.length > 0) {
								filtered.forEach(function (result) {
									if (subFilter.status == result.Status) {
										appendToResults('.projectFilterResults', result);
										resultsTally.push(result.Name);
									}
								})
							} else {
								view.forEach(function (result) {
									if (subFilter.status == result.Status) {
										appendToResults('.projectFilterResults', result);
										resultsTally.push(result.Name);
									}
								});
							}// end of filtering if owner or requester + status

						}
						;

						if (resultsTally.length === 0) {
							appendToResults('.projectFilterResults', 0);
						} else {
							resultsTally = [];
						}//

					}
				});

				$(projectFilter).kendoAutoComplete({
					filter: "contains",
					dataSource: projectDataSource,
					dataTextField: "Name",
					minLength: 3,
					popup: {
						appendTo: $("#hidenDropdown")
					}
				});

				removeInputKendoStyles(projectFilter);

				// After dom interactions
				var projAutocomplete = $(projectFilter).data("kendoAutoComplete");

				if (subFilter.refresh === true) {
					projAutocomplete.search(subFilter.key); // kendo .search() method is the only way to dynamically trigget change event!
				}
				;
			}

			function initSearchById(projectFilterbyId) {

				// seach by ID
				var projectDataSourceById = new kendo.data.DataSource({
					serverFiltering: true,
					transport: {
						read: function (options) {
							if (typeof options.data.filter != 'undefined') {
								subFilter.key = options.data.filter.filters[0].value;
								$.ajax({
									url: endPoints.projects + "?id=" + options.data.filter.filters[0].value,
									dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
									beforeSend: function (xhr) {
										$('.projectFilterResults').html(''); // clear results
										$('.modal-results span').toggleClass('custom-loading');
									},
									success: function (result) {
										// notify the data source that the request succeeded
										options.success(result.data);
										resultsData = result.data; //need to pull additional object properties (campagin owner, status etc)
									},
									error: function (result) {
										// notify the data source that the request failed
										options.error(result);
									}
								});
							}
							else {
								options.success([]);
							}
						}
					},
					change: function (e) {
						$('.projectFilterResults').html(''); // clear results
						var view = projectDataSourceById.view();
						if (view.length > 0) {
							for (var i = 0; i < view.length; i++) {
								appendToResults('.projectFilterResults', view[i]);
							}
						} else {
							appendToResults('.projectFilterResults', 0);
						}
					}
				});
				if (typeof projectFilterbyId != 'undefined') {
					$(projectFilterbyId).kendoAutoComplete({
						filter: "contains",
						dataSource: projectDataSourceById,
						dataTextField: "Name",
						minLength: 2,
						popup: {
							appendTo: $("#hidenDropdown")
						}
					});

					removeInputKendoStyles(projectFilterbyId);
				}
			}

			// Reset
			function resetProjModal() {
				subFilter = {
					alias: null,
					refresh: false,
					isOwnerOrRequester: null,
					destroySubFilter: null,
					status: null,
					SearchByID: false
				};
				$('.custom-modal .resetable').each(function () {
					$(this).val('');
				});
				$('.projectFilterResults').html('');
			}

			// set results
			function appendToResults(target, result) {
				if (result == 0) {
					$(target).append('<option>0 Projects found!</option>');
				} else {

					var spanTmpl = '<span style="font-weight: bold;">';
					var optionTmpl = String()
							+ '<option value="' + result.ID + '" data-name="' + result.Name
							+ '">' + spanTmpl + 'ID:</span> ' + result.ID
							+ ' | ' + spanTmpl + 'Name:</span>' + result.Name
							+ ' | ' + spanTmpl + 'Status:</span> ' + result.Status
							+ '</option>';

					$(target).append(optionTmpl);
				}
				$('.modal-results span').removeClass('custom-loading');
			}


			return {
				runProjectModal: runProjectModal,
				initProjectAutoComplete: initProjectAutoComplete
			}
		}();

		function init() {

			// Events

			$('[data-custom-modal=campaign]').on('click', function (e) {
				campaignModal.runCampaignModal();
			});

			$('[data-custom-modal=project]').on('click', function (e) {
				projectModal.runProjectModal();
			});


		}

		return {
			init: init
		}
	}();

	return {
		customModals: customModals
	}
}();

$(function () {
	globalModules.customModals.init();
})