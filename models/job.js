const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
	creator: { type: Schema.Types.ObjectId, ref: 'User' }, // Ref with user id
	name: String, // No-condition
	url: String,
	parentTagName: String,
	childTagName: String
});

module.exports = mongoose.model('Job', JobSchema);