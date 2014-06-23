var mongoose = require('mongoose')
var User = require('./User')
var BugSchema = new mongoose.Schema({
    bug_id: Number,
	title: String,
	reporter: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	date_created: {type: Date, default: Date.now},
	date_modified: {type: Date, default: Date.now},
	component: {type: String, default: 'ui-general'},
	priority: {type: Number, default: 3},
	severity: {type: String, default: 'normal'},
	status: {type: String, default: 'created'},
	resolution: {type: String, default: 'open'},
	assignee: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	description: String
})

var Bug = mongoose.model('Bug', BugSchema);

module.exports = Bug