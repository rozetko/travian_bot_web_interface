String.prototype.format = function() {
	var args = arguments;
	return this.replace(/{(\d+)}/g, function(match, number) { 
		return typeof args[number] != 'undefined'
		  	? args[number]
		    : match
		;
	});
};

function showSaveButton() {
	$('#config_changed').show(1000);
};

function addRow() {
	var i;

	var lastRow = $('#buildings tr:last');
	if (lastRow.attr('class') == 'building') {
		i = parseInt(lastRow.attr('id').match(/\d+/)[0]) + 1;
	}
	else {
		i = 1;
	}

	$('#add_row_button').hide();
	$('#adding_row').show();
	
	ajaxRenderRow(i);
};

function removeRow(i) {
	$('#row_{0}'.format(i)).remove();
};

$(function() {

	localStorage.setItem('status', null);
	localStorage.setItem('log_hash', null);

	$('.resources').each(function() {
		var i = $(this).attr('name').match(/\d+/)[0];
		if (this.checked) {
			$('div#res_{0}'.format(i)).show();
			$('.field_id[name="field_id[{0}]"]'.format(i)).prop('disabled', true);
		}
		else {
			$('div#res_{0}'.format(i)).hide();
		}
	});

	if ($('input[name="build"]').is(':checked')) {
		$('#build').show();
	}
	else {
		$('#build').hide();
	}

	$(document).on('change', '.resources', function() {
		var i = $(this).attr('name').match(/\d+/)[0];
		var textField = $('.field_id[name="field_id[{0}]"]'.format(i));

		if (this.checked) {
			textField.prop('disabled', true);
			textField.val('0');
			$('#res_{0}'.format(i)).show();
		}
		else {
			textField.prop('disabled', false);
			textField.val('1');
			$('#res_{0}'.format(i)).hide();
		}
	});

	$(document).on('change', 'input[name="build"]', function() {
		if (this.checked) {
			$('#build').show();
		}
		else {
			$('#build').hide();
		}
	});

	$(document).on('change', '#config_container input', showSaveButton);
	$(document).on('click', '.save', showSaveButton);

	ajaxUpdate();
});