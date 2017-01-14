const User = require('../models/user');
const Story = require('../models/story');
const config = require('../config');
const secretKey = config.secretKey;
const jwt = require('jsonwebtoken');

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
					console.log(user);
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

	api.get('/me', (req, res) => {
		res.json(req.decoded);
	});

	return api;
}
