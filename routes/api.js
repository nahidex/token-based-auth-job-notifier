const User = require('../models/user');
const Story = require('../models/story');
const Job = require('../models/job');
const config = require('../config');
const secretKey = config.secretKey;
const request = require('request');
const requestPromise = require('request-promise');
const jwt = require('jsonwebtoken');
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');

function createToken(user){
	const token  = jwt.sign({
		id: user._id,
		name: user.name,
		username: user.username
	}, config.secretKey, {
		expiresIn  : 60 * 60 * 24
	});

	return token;
}

function scrap(url, parentTagName = null, childTagName = null, grantChildTagName = null, cb) {
	requestPromise(url).then((html) => {
		var arr = [];
		var p = Promise.resolve();

		var $ = cheerio.load(html);
		var data = $(parentTagName);
		table = data.find(childTagName);
		table.each(function(i, item){
			var thiz = $(this);
			p = p.then(function(){
				data = thiz.find(grantChildTagName).text();
				arr.push(data);

			});
		});

		p.then(function(){
			cb(arr);
		});

	});
}

module.exports = (app, express) => {

	const api = express.Router();

	api.post('/signup', (req, res) => {
		const user = new User({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password
		});
		const token = createToken(user);
		user.save( (err) => {
			if (err) {
				res.send(err);
				return;
			}
			res.json({
				success: true,
				message:'User has been created.',
				token: token
			});
		});
	});

	api.get('/users', (req, res) => {

		User.find({}, (err, users) => {
			if (err) {
				res.send(err);
				return;
			}
			res.json(users);
		})
	});

	api.post('/login', (req, res) => {
		User.findOne({
			username: req.body.username,
		}, 'username name password', (err, user) => {
			if (err) throw err;

			if (!user) {
				return res.send({ message: 'User dosent exist.' });
			} else if (user) {
				const validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.send({ message: 'Invalid Password' });
				} else {
					////console.log(user);
					const token = createToken(user);
					res.status(200).json({
						success: true,
						message: 'Successfully login!',
						token: token
					});
				}
			}
		});
	});

	api.use((req, res, next) => {
		var token = req.body.token || req.params.token || req.header('x-access-token');

		// check if token exisits
		if (token) {
			jwt.verify(token, config.secretKey, (err, decoded) => {
				if (err) {
					res.status(403).send({
						success: false,
						message: 'Failed to autheticate user.'
					});
				} else {
					req.decoded = decoded;
					next();
				}
			})
		} else {
			res.status(403).send({
				success: false,
				message: 'No token provided.'
			});
		}
	});

	// Destination B // Provide a legitimate token

	// api.get('/', (req, res) => {
	// 	res.json('Hallo World');
	// });

	api.route('/')
		.post((req, res) => {
			const story = new Story({
				creator: req.decoded.id,
				content: req.body.content
			});

			story.save((err) => {
				if (err) {
					res.send(err);
					return;
				}
				res.json({ message: 'New Story Created.' });
			});
		})
		.get((req, res) => {

			Story.find({ creator: req.decoded.id }).sort({date: 'desc'}).exec((err, stories) => {
				if (err) {
					res.send(err);
					return;
				}
				res.json(stories);
			});
			//res.json({ message: "You get the home route." });
		});

		api.route('/job')
			.post((req, res) => {
				const job = new Job({
					creator: req.decoded.id,
					name: req.body.name,
					url: req.body.url,
					parentTagName: req.body.parentTagName,
					childTagName: req.body.childTagName,
					grantChildTagName: req.body.grantChildTagName
				});
				job.save((err) => {
					if (err) {
						res.send(err);
						return;
					}
					res.json({ message: 'New Job Schema Created.' });
				});
			})
			.get((req, res) => {
				Job.find({ creator: req.decoded.id }).sort({date: 'desc'}).exec((err, jobs) => {
					if (err) {
						res.send(err);
						return;
					}
					//console.log(jobs);
					res.json(jobs);
				});
			});

		api.route('/job/:id')
			.get((req, res) => {
				Job.findOne({_id: req.params.id }).exec((err, job) => {
					if (err) {
						res.send();
						return;
					}
					console.log(job.grantChildTagName);
					scrap(job.url, job.parentTagName, job.childTagName, job.grantChildTagName, function(scrappedData){
						//console.log(scrappedData);
						res.send(scrappedData);
					});
				});
			})
			.delete((req, res) => {
				Job.findOne({_id: req.params.id }).remove().exec((err, job) => {
					if (err) {
						res.send();
						return;
					}
					res.json({
						'message': 'Item deleted successfully'
					});
				});
			});
	api.get('/me', (req, res) => {
		res.json(req.decoded);
	});

	return api;
}
