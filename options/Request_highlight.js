module.exports = function(mongoose) {

	var ReqHighLightSchema = new mongoose.Schema({
		name: {
			type: String,
			required: 'Please fill in a name',
			trim: true
		},
		value: {
			type: Number,
			default: 0
		},
		fr: {
			type: String,
			trim: true
		},
		nl: {
			type: String,
			trim: true
		},
		en: {
			type: String,
			trim: true
		}
	})

	var ReqHighLight = mongoose.model('ReqHighLight', ReqHighLightSchema)

	return ReqHighLight;
}
