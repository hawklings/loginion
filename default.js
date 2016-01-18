var gui = require('nw.gui');
var win = gui.Window.get();

var request = require('request');
var querystring = require('querystring');

var historyArea = {
    addLine: function(line) {
        $('.history').append('<div>' + line + '</div>');
    },
    executedCommand: function(command) {
        $('.history').append('<div class="sameline"><div class="fa fa-angle-right"></div><div class="command">' + command + '</div></div>');
    },
    addResult: function(result) {
        $('.history').append('<div>' + result + '</div>');
        $('.history').append('<br> ');
    }
};

var terminal = {
    intialize: function() {
        $('.appVersion').html(gui.App.manifest.version);
    },
    blink: function() {
        var text = $('.command>input').val();
        if (!terminal.removeUnderscore()) {
            terminal.addUnderscore();
        }
        $('#container').scrollTop(1000000);
    },
    disable: function() {
        $('.line').css('opacity', '0');
    },
    enable: function() {
        $('.command>input').val('');
        $('.line').css('opacity', '1');
    },
    addUnderscore: function() {
        var text = $('.command>input').val();
        if (text[text.length - 1] !== '_') {
            $('.command>input').val(text + '_');
            return true;
        }
        return false;
    },
    removeUnderscore: function() {
        var text = $('.command>input').val();
        if (text[text.length - 1] === '_') {
            $('.command>input').val(text.substr(0, text.length - 1));
            return true;
        }
        return false;
    },
    executeCommand: function(command) {
        if (command !== '') {
            $('.command>input').val('');
            historyArea.executedCommand(command);
            terminal.disable();
            terminal.parseCommand(command, function(result) {
                if (result !== '') {
                    historyArea.addResult(result);
                }
                terminal.enable();
            });
        }
    },
    parseCommand: function(line, callback) {
        var result = '';
        var command = line.split(' ');
        if (command[0] === 'login') {
            internet.login(command[1], command[2], function(data) {
                callback(data);
            });
        } else if (command[0] === 'help') {
            callback(helpText);
        } else if (command[0] === 'syncresources') {
            internet.syncResources(command[1], function(data) {
                callback(data);
            });
        } else if (command[0] === 'nukeresources') {
            internet.nukeResources();
            callback('Nuked');
        } else if (command[0] === 'logout') {
            internet.logout(function() {
                callback("Logged out");
            });
        } else if (command[0] === 'exit') {
            win.close();
        } else {
            result = command[0] + ": command not found";
            callback(result);
        }
    }
};

var internet = {
    url: 'http://172.16.16.16',
    endpoint: {
        check: '/24online/webpages/client.jsp?fromlogout=true',
        login: '/24online/servlet/E24onlineHTTPClient',
        logout: '/24online/servlet/E24onlineHTTPClient',
        liverequest: '/24online/webpages/liverequest.jsp?username=null&isfirsttime=1'
    },
    connected: false,
    connected_account: undefined,
    list: [],
    makeRequest: function(url, formdata, callback) {
        request.post({
                url: url,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: querystring.stringify(formdata)
            },
            function(error, response, data) {
                callback(data);
            });
    },
    checkConnection: function(callback) {
        internet.makeRequest(internet.url + internet.endpoint.check, {}, function(data) {
            if (data.split("name='logout'").length > 1) {
                internet.connected = true;
                username = data.split("document.forms[0].username.value=\"")[1].split("\"")[0];
                internet.connected_account = {
                    username: username,
                    password: 'UNKNOWN FOR NOW',
                };
                console.log("logged in user: ", internet.connected_account);
            }
            callback();
        });
    },
    login: function(username, password, callback) {
        //send the login request to ION
        function send_login_request(username, password, callback) {
            var formdata = {
                username: username,
                password: password,
                mode: 191
            };
            historyArea.addLine('Trying ' + username);
            internet.makeRequest(internet.url + internet.endpoint.login, formdata, callback);

        };

        if (username === undefined && password === undefined) {
            if (internet.list !== undefined && internet.list.length > 0) {
                var select = Math.floor(Math.random() * internet.list.length);
                var account = internet.list[select];

                send_login_request(account.username, account.password, function(data) {
                    if (data.split("name='logout'").length > 1) {
                        internet.connected = true;
                        connected_account = account;
                        callback('You has internet.');
                    } else {
                        internet.login(username, password, callback);
                    }
                });
            } else {
                callback('No accounts saved.');
            }
        } else if (password === undefined) {
            callback('Account not saved.');
        } else {
            send_login_request(username, password, function(data) {
                if (data.split("name='logout'").length > 1) {
                    internet.connected = true;
                    connected_account = account;
                    callback('You has internet.');
                } else {
                    callback("Unable to connect with given credentials. EXTRACT REASON FROM DATA");
                }
            });
        }
    },
    logout: function(callback) {
        var formdata = {
            username: internet.connected_account.username,
            password: '',
            mode: '193',
            checkClose: '1'
        };
        internet.makeRequest(internet.url + internet.endpoint.logout, formdata, function(data) {
            callback(data);
        })
    },
    loadResources: function() {
        if (localStorage.list !== undefined) {
            internet.list = JSON.parse(localStorage.list);
            console.log(internet.list.length);
        }
    },
    syncResources: function(user, callback) {
        if (!internet.connected) {
            callback('Not connected to the internet.');
        } else if (user !== undefined) {
            internet.makeRequest('https://iecsemanipal.com/hawklings/loginion/resources/?user=' + user, {}, function(data) {
                if (data.length > 0) {
                    localStorage.list = data;
                    callback('Downloaded the list.');
                    internet.loadResources();
                } else {
                    callback('Failed to load the list.');
                }
            });
        } else {
            callback('Failed to sync resources.');
        }
    },
    nukeResources: function() {
        localStorage.list = [];
    }
};

$(document).ready(function() {
    setInterval(terminal.blink, 600);
    terminal.intialize();
    terminal.disable();
    internet.checkConnection(function() {
        if (internet.connected) {
            historyArea.addLine('Connected to the internet.');
        } else {
            historyArea.addLine('Not connected to the internet.');
        }
        historyArea.addLine('<br>');
        terminal.enable();
    });
    internet.loadResources();
});

$(document).on('keydown', function(e) {
    terminal.removeUnderscore();
    $('.command>input').focus();
});

$(document).on('keyup', function(e) {
    if (e.which === 13) {
        terminal.removeUnderscore();
        terminal.executeCommand($('.command>input').val());
    } else {
        terminal.addUnderscore();
    }
});

var helpText = "<br>Help: <br>" +
    "<div style='border-top: 1px dotted #fff; width: 100%'></div><br>" +
    "help<br>Provides help information for Loginion commands<br><br>" +
    "login [username] [password]<br>Logs into random account unless username and password are provided<br><br>" +
    "syncresources<br> Syncs resources<br><br>" +
    "nukeresources<br> Nukes resources";
