const User = require('../models/user');
const config = require('../config');
const secretKey = config.secretKey;
const jwt = require('jsonwebtoken');

function createToken(user){
	const token  = jwt.sign({
		_id: user._id,
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
		user.save( (err) => {
			if (err) {
				res.send(err);
				return;
			}
			res.json({ message:'User has been created.'});
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
		}).select('password').exec( (err, user) => {
			if (err) throw err;

			if (!user) {
				return res.send({ message: 'User dosent exist.' });
			} else if (user) {
				const validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.send({ message: 'Invalid Password' });
				} else {
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
				console.log(decoded);
				if (err) {
					res.status(403).send({
						success: false,
						message: 'Failed to autheticate user.'
					});
				} else {
					// Bujhi nai :(
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

	api.get('/', (req, res) => {
		res.json('Hallo World');
	});

	return api;
}
