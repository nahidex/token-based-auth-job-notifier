const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
	name: String, // No-condition
	username: { type: String, requried: false, index: { unique: true }}, // Has condition
	password: { type: String, required: true, select: false} // We wont query on this field
});

UserSchema.pre('save', function(next) {
	var user = this;
	if (!user.isModified('password')) return next();

	bcrypt.hash(user.password, null, null, (err, hash) => {
		if (err) return next(err);
		user.password = hash;
		next();
	});
});

UserSchema.methods.comparePassword = function(password) {

	const user = this;

	return bcrypt.compareSync(password, user.password);
}

module.exports = mongoose.model('User', UserSchema);
