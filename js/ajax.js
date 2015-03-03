function ajaxUpdate() {
    $.ajax({
        url: 'ajax.php?bot=1&update=1',
        complete: function(response) {
            update(response.responseText);
            setTimeout(ajaxUpdate, 1000);
        }
    });
};

function ajaxUpdateConfig() {
    $.ajax('ajax.php?bot=1&config=1').done(
        function(responseText) {
            $('#config_container').html(responseText);
        }
    );

    $('#config_changed').hide();
};

function update(responseText) {
    var response = JSON.parse(responseText);

    if (localStorage.getItem('status') != response['status']) {
        localStorage.setItem('status', response['status']);

        $('#status').show();
        $('#controls').show().css('display', 'inline');

        switch (response['status']) {
            case "1":
                $('#status').css('backgroundColor', '#00FF00');
                $('#status_text').html('Online');

                $('#unpause').hide();
                $('#pause').show();

                $('#online_controls').show().css('display', 'inline');
                $('#offline_controls').hide();
                break;

            case "0":
                $('#status').css('backgroundColor', '#FF3030');
                $('#status_text').html('Offline');

                $('#offline_controls').show();
                $('#online_controls').hide();
                break;

            case "-1":
                $('#status').css('backgroundColor', '#FFFF33');
                $('#status_text').html('Paused');

                $('#unpause').show();
                $('#pause').hide();

                $('#online_controls').show().css('display', 'inline');
                $('#offline_controls').hide();

                break;
        }
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
        url: 'ajax.php?bot=1&save_config=1', 
        data: $('#config_container').serialize()
    }).done( 
        function() {
            $('#config_saved').show(2000).css('display', 'inline').fadeOut(1000);
            $('#config_changed').hide();
        }
    );
};

function ajaxRenderRow(i) {
    $.ajax('ajax.php?bot=1&row={0}'.format(i)).done(function(responseText) {
        $('#buildings tr:last').after(responseText);

        $('#add_row_button').show();
        $('#adding_row').hide();
    });
}

function ajaxStartBot() {
    $.ajax("ajax.php?bot=1&start=1");
};

function ajaxPauseBot() {
    $.ajax("ajax.php?bot=1&pause=1");
};

function ajaxUnpauseBot() {
    $.ajax("ajax.php?bot=1&pause=0");
};

function ajaxStopBot() {
    $.ajax("ajax.php?bot=1&stop=1");
};
