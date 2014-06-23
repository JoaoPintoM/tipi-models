var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	sanitizer = require('./sanitizer')
	
var Estate = require('./Estate')

var EstateDescriptionSchema = new mongoose.Schema({
	fr: String,
	nl: String,
	en: String,
	estate_id: {type: Schema.Types.ObjectId, ref: 'Estate'}
})

EstateDescriptionSchema.pre('save', function (next) {
  	if (this.fr) this.fr = sanitizer.sanitize(this.fr)
	if (this.en) this.en = sanitizer.sanitize(this.en)
	if (this.nl) this.nl = sanitizer.sanitize(this.nl)
	next()
})

var EstateDescription = mongoose.model('EstateDescription', EstateDescriptionSchema)

module.exports = EstateDescription