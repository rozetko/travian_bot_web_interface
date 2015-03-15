var undefinedStatus;

String.prototype.format = function() {
	var args = arguments;
	return this.replace(/{(\d+)}/g, function(match, number) { 
		return typeof args[number] != 'undefined'
		  	? args[number]
		    : match
		;
	});
};

function clearStatus() {
	undefinedStatus = setInterval(function() {
		if ($('#status_image').attr('class') == 'undefined') {
			$('#status_image').attr('class', 'paused');
		}
		else {
			$('#status_image').attr('class', 'undefined');
		}
	}, 750);
};

function showConfigChanged() {
	$('#save').attr('class', 'menu');
	$('#undo').attr('class', 'menu');
};

function addRow() {
	var i;

	var lastRow = $('#buildings tbody tr:nth-last-child(2)');
	if (lastRow.length) {
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

function setStatus(status) {
	var statusImage = $('#status > img');

    switch (status) {
        case "1":
        	clearInterval(undefinedStatus);

            $('#status_image').attr('class', 'online');

            $('#start').hide();
            $('#pause').attr('class', 'menu').show();
            $('#unpause').hide();
            $('#stop').attr('class', 'menu');
            break;

        case "0":
        	clearInterval(undefinedStatus);
            $('#status_image').attr('class', 'offline');

            $('#start').attr('class', 'menu').show();
            $('#pause').hide();
            $('#unpause').hide();
            $('#stop').attr('class', 'menu inactive');
            break;

        case "-1":
        	clearInterval(undefinedStatus);
            $('#status_image').attr('class', 'paused');

            $('#start').hide();
            $('#pause').hide();
            $('#unpause').attr('class', 'menu').show();
            $('#stop').attr('class', 'menu');
            break;

        case "undefined":
        	clearStatus();

        	$('#start').attr('class', 'menu inactive');
            $('#pause').attr('class', 'menu inactive');
            $('#unpause').attr('class', 'menu inactive');
            $('#stop').attr('class', 'menu inactive');

        	break;
    }
};

$(function() {
	localStorage.setItem('status', null);
	localStorage.setItem('log_hash', null);

	setStatus("undefined");

	$('#pause').hide();
    $('#unpause').hide();

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

	$(document).on('change', '#config_container input', showConfigChanged);
	$(document).on('click', '.change', showConfigChanged);

	ajaxUpdate();
});