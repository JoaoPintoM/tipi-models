module.exports = function(mongoose) {

	var AdvertSchema = new mongoose.Schema({
		key: {
			type: String,
			trim: true
		},
		fr: {
			type: String,
			trim: true
		},
		en: {
			type: String,
			trim: true
		},
		nl: {
			type: String,
			trim: true
		}
	})

	var Translation = mongoose.model('Translation', AdvertSchema)

	return Translation;
}
