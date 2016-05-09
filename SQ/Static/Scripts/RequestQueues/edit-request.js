$(function() {
	//Initialize multiple select
	$('body').find('select').each(function() {
		if ($(this).attr('multiple') == 'multiple') {
			var title = $(this).data('title'),
				elem = $(this);
			$(this).multipleSelect({
				placeholder: title,
				minimumCountSelected: 0,
				countSelected: $(this).attr('id') == 'comments-status-changes-dd' ? $(this).next().find('li.selected').text() : title + '&nbsp;(#)',
				selectAllText: $(this).data('select-all-text'),
				allSelected: title,
				onClick: function(view) {
					var selectedOptions = elem.multipleSelect('getSelects');

					$('.group-alert').addClass('hidden');
					currentG.collapse('show');

					if (elem.attr('id') == 'filter-by-group-dd') {
						if (selectedOptions.length != 0) {
							$('.task-group').each(function() {
								var isSelected = false;
								var that = this;
								$.each(selectedOptions, function(key, value) {
									if ($(that).find('> a').attr('href') != undefined && $(that).find('> a').attr('href').indexOf(value) > 0) {
										isSelected = true;
										return false;
									}
								});
								if (isSelected) {
									$(this).show();
								}
								else {
									$(this).hide();
								}
							});
						}
						else {
							$('.task-group').hide();
							$('.group-alert').removeClass('hidden');
						}
					}
					else {
						$('.task-group').find('.box-alert').hide();

						if ($('#filter-by-group-dd').multipleSelect('getSelects') == 0) {
							$('.group-alert').removeClass('hidden').show();
							return false;
						}

						if (selectedOptions.length != 0) {
							//unckeck all selected and onUnchekall not triggering workaround
							if (selectedOptions.length == 2) {
								return false;
							}
							$('.comment-box > div').each(function() {
								var that = this;
								var hasComment = false;
								$.each(selectedOptions, function(key, value) {

									if (value == "1") {
										if ($(that).hasClass('comment')) {
											$(that).show();
										}
										else {
											$(that).hide();
										}
									}
									else {
										if ($(that).hasClass('comment')) {
											$(that).hide();
										}
										else {
											$(that).show();
										}
									}
								});
							});
							if ($('#filter-by-group-dd').multipleSelect('getSelects') == 0) {
								$('.group-alert').removeClass('hidden');
							}
						}
						else {
							$('.comment-box > div').hide();
							findEmptyBoxes('');
							return false;
						}
						findEmptyBoxes(selectedOptions.toString());
					}
				},
				onCheckAll: function() {
					if (elem.attr('id') == 'filter-by-group-dd') {
						$('.task-group').show();
						$('.group-alert').addClass('hidden');
					}
					else {
						$('.comment-box > div').show();
						findEmptyBoxes('1,2');
					}
				},
				onUncheckAll: function() {
					if (elem.attr('id') == 'filter-by-group-dd') {
						$('.task-group').hide();
						$('.group-alert').removeClass('hidden');
					}
					else {
						$('.comment-box > div').hide();
						showMessage($('.task-group .comment-box'), 'no records');
						if ($('#filter-by-group-dd').multipleSelect('getSelects') == 0) {
							$('.group-alert').removeClass('hidden').show();
						}
					}
				},
				onOpen: function(elem) {
					var nextElem = $(elem).next(), ul = nextElem.find('ul');

					/*width/height fix imported from DSG*/
					if (ul.outerHeight() < ul.prop('scrollHeight') && !ul.data('width-fixed')) {
						ul.css('width', ul.outerWidth() + $.position.scrollbarWidth());
						ul.data('width-fixed', true);
					}

					//Check if dropdown needs to be reversed.
					nextElem.css('right', 'auto');

					if (nextElem.offset().left + nextElem.find('ul').outerWidth(true) > $('body').width()) {
						nextElem.css('right', 0);
					}
					else {
						nextElem.css('right', 'auto');
					}

					/*check if dropdown needs to be on top*/
					/*reset*/
					nextElem.css({'top': ' 100%', 'box-shadow': '0 4px 5px rgba(0,0,0,0.15)'});

					if ($('.table-responsive').length > 0) { // added if statement to prevent 'top' undefined error when .table-responsive is not being used
						var dropdownHeight = nextElem.outerHeight(true);
						if (nextElem.offset().top + dropdownHeight > $(document).scrollTop() + $('body').height()) {
							nextElem.css({'top': -1 * dropdownHeight, 'box-shadow': '0 -4px 5px rgba(0,0,0,0.15)'});
						}
					}
				}
			});
		}
	});

	//on page load
	$('#filter-by-group-dd').multipleSelect('checkAll');
	$('#comments-status-changes-dd').multipleSelect('setSelects', [1]);
	$('.comment-box > div').each(function() {
		if (!$(this).hasClass('comment')) {
			$(this).hide();
		}
	});


	/*set current group*/
	var currentGNumber = $('#groups .task-group:first-child > a').attr('href').replace(/[^0-9]/g, ''),
		currentG = $('.task-group').find('#group' + currentGNumber);
	currentG.collapse('show');

	/*empty comment box*/
	function findEmptyBoxes(selectedOptions) {
		$('.task-group').find('.box-alert').hide();

		$('.task-group').find('.comment-box').each(function() {
			if ($(this).find('> div').length > 0) {
				if (selectedOptions == '1') {
					if ($(this).find('> div.comment:visible').length == 0) {
						showMessage($(this), 'no comments');
					}
				}
				else if (selectedOptions == '2') {
					if ($(this).find('> div.status:visible').length == 0) {
						showMessage($(this), 'no status changes');
					}
				}
				else {
					if ($(this).find('> div.status:visible').length == 0 && $(this).find('> div.comment:visible').length == 0) {
						showMessage($(this), 'no records');
					}
					else {
						$('.task-group').find('.box-alert').hide();
					}
				}
			}
			else {
				showMessage($(this), 'no records');
			}
		});
		currentG.collapse('show');
	}

	$('#groups .task-group > div:last-child').on('shown.bs.collapse', function() {
		var box = $(this).find('.comment-box'),
			selectedOptions = $('#comments-status-changes-dd').multipleSelect('getSelects').toString();
		if (box.data('processed') == undefined) {
			if (box.find('> div').length > 0) {
				if (selectedOptions == '1') {
					if ($(this).find('.comment-box > div.comment:visible').length == 0) {
						showMessage(box, 'no comments');
					}
				}
				else if (selectedOptions == '2') {
					if ($(this).find('.comment-box > div.status:visible').length == 0) {
						showMessage(box, 'no status changes');
					}
				}
				else {
					if ($(this).find('.comment-box > div.status:visible').length == 0 && $(this).find('.comment-box > div.comment:visible').length == 0) {
						showMessage(box, 'no records');
					}
					else {
						$('.task-group').find('.box-alert').hide();
					}
				}

			}
			else {
				showMessage(box, 'no records');
			}
			box.data('processed', true);
		}
		if (box.data('processed') == true) {
			if (selectedOptions == '1' && box.find('> div.comment').length != 0) {
				box.find('.box-alert').hide();
			}
			else if (selectedOptions == '2' && box.find('> div.status').length != 0) {
				box.find('.box-alert').hide();
			}
			else {
				if (selectedOptions == '1,2' && box.find('> div.status').length != 0 && box.find('> div.comment').length != 0) {
					box.find('.box-alert').hide();
				}
			}
		}
	});


	function showMessage(box, message) {
		if (message == 'no comments') {
			box.find('.box-alert h4').text('There are no comments.');
			box.find('.box-alert').removeClass('hidden').show();
		}
		else if (message == 'no status changes') {
			box.find('.box-alert h4').text('There are no status changes.');
			box.find('.box-alert').removeClass('hidden').show();
		}
		else {
			box.find('.box-alert h4').text('There are no status changes or comments.');
			box.find('.box-alert').removeClass('hidden').show();
		}
	}

	/*popover*/
	$('.toggle-popover').popover({
		html: true,
		trigger: "manual",
		content: function() {
			return $(".popover-content", this).html();
		}
	}).on("mouseenter", function() {
		var _this = this;
		$(this).popover("show");
		$(this).siblings(".popover").on("mouseleave", function() {
			$(_this).popover('hide');
		});
	}).on("mouseleave", function() {
		var _this = this;
		setTimeout(function() {
			if (!$(".popover:hover").length) {
				$(_this).popover("hide")
			}
		}, 100);
	});

	/*collapsibles*/
	/*keep border bottom only when they are collapsed*/
	$('.panel-group-collapsible').each(function() {
		if ($(this).find('.panel-title > a').hasClass('collapsed')) {
			$(this).css('border-bottom', '1px solid #aaa');
		}
	});
	$('.table-responsive').on('hidden.bs.collapse', function(e) {
		/*prevent toggling border by Notified collapsibles in comments */
		if (!$(e.target).attr('id').match('^Notified')) {
			$(this).parent().parent().css('border-bottom', '1px solid #aaa');
		}
	}).on('shown.bs.collapse', function(e) {
		/*prevent toggling border by Notified collapsibles in comments */
		if (!$(e.target).attr('id').match('^Notified')) {
			$(this).parent().parent().attr('style', '');
		}
	});
});