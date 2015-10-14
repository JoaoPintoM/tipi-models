module.exports = function(mongoose) {

	var AdvertSchema = new mongoose.Schema({
		name: {
			type: String,
			required: 'Please fill in a name',
			trim: true
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		},
		zips: {
			type: [Number],
			min: 1000,
			max: 9999
		},
		mode: {
			type: String,
			enum: ['rent', 'sale'],
			default: 'sale'
		},
		isActive: {
			type: Boolean,
			default: true
		},
		priceMin: {
			type: Number,
			default: 0
		},
		priceMax: {
			type: Number,
			default: -1
		},
		rooms: {
			type: Number,
			default: 0
		},
		content: {
			type: String,
			trim: true
		},
		category: {
			type: String,
			enum: ['house', 'appartment', 'house_or_appartment', 'business', 'garage', 'terrain'],
			default: null
		},
		type: {
			type: String,
			'default': 'house'
		},
		tags: [String],

		min_bath: {
			type: Number,
			default: 0
		},
		min_surface: {
			type: Number,
			default: 0
		},
		min_landsurface: {
			type: Number,
			default: 0
		},
		min_faces: {
			type: Number,
			default: 0
		},
		disponibility: { //-1 sans preference : 0 tout de suite : 1 mois, 2 mois, etc..
			type: Number,
			default: -1
		}
	})

	var Advert = mongoose.model('Advert', AdvertSchema)

	return Advert;
}
