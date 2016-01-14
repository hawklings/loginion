var request = require('request');
var win = nw.Window.get();

var historyArea = {
	addLine: function(line) {
		$('.history').append('<div>'+line+'</div>');
	},
	executedCommand: function(command) {
		$('.history').append('<div class="sameline"><div class="fa fa-angle-right"></div><div class="command">'+command+'</div></div>');
	},
	addResult: function(result) {
		$('.history').append('<div>'+result+'</div>');
		$('.history').append('<br> ');
	}
}

var terminal = {
	blink: function() {
		var text = $('.command>input').val();
		if(text[text.length-1]!='_') {
			$('.command>input').val(text+'_');
		}
		else {
			$('.command>input').val(text.substr(0,text.length-1));
		}
	},
	disable: function() {
		$('.line').hide();
	},
	enable: function() {
		$('.command>input').val('');
		$('.line').show();
	},
	executeCommand: function(command) {
		if(command!='') {
			$('.command>input').val('');
			historyArea.executedCommand(command);
			terminal.disable();
			terminal.parseCommand(command, function(result) {
				if(result!='') {
					historyArea.addResult(result);
				}
				terminal.enable();
			});
		}
	},
	parseCommand: function(line, callback) {
		var result = '';
		var command = line.split(' ');
		if(command[0]=='login') {
			internet.login(command[1],command[2], function(data) {
				callback && callback(data);
			});
		}
		else if(command[0]=='help') {
			callback && callback(helpText);
		}
		else if(command[0]=='exit') {
			win.close();
		}
		else {
			result = command+": not found";
			callback && callback(result);
		}
	}
}

var internet = {
	url: 'http://172.16.16.16',
	endpoint: {
		check: '/24online/webpages/client.jsp?fromlogout=true',
		login: '/24online/servlet/E24onlineHTTPClient'
	},
	connected: false,
	checkConnection: function(callback) {
		request(internet.url+internet.endpoint.check, function(error, response, data) {
			if(data.split("name='logout'").length>1) {
				terminal.connected=true;
			}
			callback && callback();
		});
	},
	login: function(username, password, callback) {
		if(!terminal.connected) {                                                                                   // CHANGE THIS
			if(username===undefined && password===undefined) {
				var select= Math.floor(Math.random()*list.length);
				var account= list[select];
				var formdata = {
					username: account.username,
					password: account.password,
					mode: 191
				};
				historyArea.addLine('Trying '+account.username);
				request.post({
					url: internet.url+internet.endpoint.login,
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
   						'Content-Type': 'application/x-www-form-urlencoded' 
					},
					body: require('querystring').stringify(formdata)
				},
				function(error, response, data) {
					if(!error) {
						if(data.split("name='logout'").length>1) {
							terminal.connected=true;
							callback && callback('You is has internet.');
						}
						else {
							internet.login(username, password, callback);
						}
					}
				});
			}
			else if(password===undefined) {

			}
			else {

			}
		}
		else {
			callback && callback('Already connected to the internet.');
		}
	}
}

$(document).ready(function()	{	
	setInterval(terminal.blink, 600);
	terminal.disable();
	internet.checkConnection(function() {
		if(terminal.connected) {
			historyArea.addLine('Connected to the internet.');
		}
		else {
			historyArea.addLine('Not connected to the internet.');
		}
		historyArea.addLine('<br>');
		terminal.enable();
	});
});

$(document).on('keydown', function(e) {
	var text = $('.command>input').val();
	if(text[text.length-1]=='_') {
		$('.command>input').val(text.substr(0,text.length-1));
	}
	$('.command>input').focus();
});

$(document).on('keyup', function(e) {
	var text = $('.command>input').val();
	if(e.which==13) {
		if(text[text.length-1]=='_') {
			$('.command>input').val(text.substr(0,text.length-1));
		}	
		terminal.executeCommand($('.command>input').val());
	}
	else if(text[text.length-1]!='_') {
		$('.command>input').val(text+'_');
	}
});

var helpText =  "<br>Help: <br>"+
				"<div style='border-top: 1px dotted #fff; width: 100%'></div><br>"+
				"help<br>Provides help information for Loginion commands<br><br>"+
				"login [username] [password]<br>Logs into random account unless username and password are provided<br><br>"+
				"";