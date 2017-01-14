const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorySchema = new Schema({
	creator: { type: Schema.Types.ObjectId, ref: 'User' }, // Ref with user id
	content: String,
	created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Story', StorySchema);