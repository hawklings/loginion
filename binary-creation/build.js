var NwBuilder = require('nw-builder');

var filesToInclude = [
	'../fonts/*',
	'../node_modules/font-awesome/**',
	'../node_modules/jquery/**',
	'../node_modules/querystring/**',
	'../node_modules/request/**',
	'../*'
];

var nw = new NwBuilder({
    files: filesToInclude, // use the glob format
    //platforms: ['osx32', 'osx64', 'win32', 'win64', 'linux32', 'linux64'],
    platforms: ['win64', 'osx64'],
    version: '0.12.3'
});

//Log stuff you want

nw.on('log', console.log);

// Build returns a promise
nw.build().then(function() {
    console.log('all done!');
}).catch(function(error) {
    console.error(error);
});
