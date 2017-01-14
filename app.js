const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');
const mongoose = require('mongoose');
const app = express();

mongoose.connect(config.database, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log('Connected to the database.');
	}
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

var api = require('./routes/api')(app, express);
app.use('/api', api);

app.get('*', (req, res) => {
	res.sendFile(__dirname + '/public/app/views/index.html');
});

app.listen(config.port, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log('Listening on Port', 3000);
	}
});
