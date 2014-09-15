var sanitizer = require('./sanitizer')

module.exports = function(mongoose) {
	var Estate = mongoose.model('Estate')
	var EstateDescriptionSchema = new mongoose.Schema({
		fr: String,
		nl: String,
		en: String,
		estate_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Estate'}
	})
	
	EstateDescriptionSchema.pre('save', function (next) {
		if (this.fr) this.fr = sanitizer.sanitize(this.fr)
		if (this.en) this.en = sanitizer.sanitize(this.en)
		if (this.nl) this.nl = sanitizer.sanitize(this.nl)
		next()
	})
	
	var EstateDescription = mongoose.model('EstateDescription', EstateDescriptionSchema)
	//console.log('EstateDescription Schema created')
	return EstateDescription
}