var mongoose = require('mongoose')

var TagSchema = new mongoose.Schema({
	name: String,
	fr: String,
	nl: String,
	en: String,
	order_id: Number
})

var Tag = mongoose.model('Tag', TagSchema)

module.exports = Tag