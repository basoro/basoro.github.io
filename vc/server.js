var express = require('express');

var app = express();

app.use('/', express.static(__dirname));

app.listen(process.env.PORT || 9292, function() { 
	console.log('listening'); 
});
