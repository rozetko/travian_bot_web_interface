function ajaxUpdate() {
    $.ajax({
        url: 'ajax.php?update=1',
        complete: function(response) {
            update(response.responseText);
            setTimeout(ajaxUpdate, 1000);
        }
    });
};

function ajaxUpdateConfig() {
    $.ajax('ajax.php?config=1').done(
        function(responseText) {
            $('#config_container').html(responseText);
        }
    );

    $('#save').attr('class', 'menu inactive');
    $('#undo').attr('class', 'menu inactive');
};

function update(responseText) {
    var response = JSON.parse(responseText);

    if (localStorage.getItem('status') != response['status']) {
        localStorage.setItem('status', response['status']);

        setStatus(response['status']);
    }

    if (localStorage.getItem('log_hash') != response['log_hash']) {
        localStorage.setItem('log_hash', response['log_hash']);
        $('#log').html(response['log']);
    }

    if (localStorage.getItem('config_hash') != response['config_hash']) {
        localStorage.setItem('config_hash', response['config_hash']);

        ajaxUpdateConfig();
    }
};

function ajaxSaveConfig() {
    $.ajax({
        type: 'POST',
        url: 'ajax.php?save_config=1', 
        data: $('#config_container').serialize()
    }).done( 
        function() {
            $('#pop_up').show().fadeOut(2000);
            $('#save').attr('class', 'menu inactive');
            $('#undo').attr('class', 'menu inactive');
        }
    );
};

function ajaxRenderRow(i) { 
    $.ajax('ajax.php?row={0}'.format(i)).done(function(responseText) {
        $('#buildings tr:last').after(responseText);

        $('#add_row_button').show();
        $('#adding_row').hide();
    });
};

function Bot() {
    setStatus("undefined");

    this.start = function() {
        $.ajax("ajax.php?start=1");
    };
    this.stop = function() {
        $.ajax("ajax.php?stop=1");
    };
    this.pause = function() {
        $.ajax("ajax.php?pause=1");
    };
    this.unpause = function() {
        $.ajax("ajax.php?pause=0");
    };
};
