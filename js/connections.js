jQuery(function($) {
    var socket = io.connect(),
    $messageForm = $('#send-message'),
    $messageBox = $('#message'),
    $chat = $('#chat'),
    $nickForm = $('#setNick'),
    $buttonSend = $('#send'),
    $nickBox = $('#nickname'),
    $users = $('#users'),
    $closeAlert = $('#closeAlert');

    $nickForm.click(function(e) {
        e.preventDefault();
        socket.emit('new user', $nickBox.val(), function(data) {
            if(data) {
                $('#nickWrap').hide();
                $('#contentWrap').show();
                $("#login-error").hide();
                $("#some-space").hide();
            } else {
                $("#login-error").show();
            }
        });
        $nickBox.val('');
    });

    $closeAlert.click(function(e) {
        $("#login-error").hide();
    });

    $messageForm.submit(function(e) {
        e.preventDefault();
        if($messageBox.val()!='') {
            socket.emit('send message', $messageBox.val());
        }
        $messageBox.val('');
    });

    socket.on('new message', function(data) {
        $chat.append('<b>' + data.nick + ":</b> " + data.msg + "<br/>");
    });

    socket.on('usernames', function(data) {
        var users = '';
        for (var username in data) {
            users += username + '<br/>';
        }
        $users.html(users);
    });

});
