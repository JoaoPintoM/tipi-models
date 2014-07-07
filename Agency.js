module.exports = function(mongoose) {

	var AgencySchema = new mongoose.Schema({
		name: String,
		subsidiary_name: String,
		zip: {type: Number, min: 1000, max: 9999, 'default':''},
		city: String,
		address: String,
		phone: String,
		fax: String,
		email: String,
		website: String,
		logo: String,
		lat: Number,
		lng: Number
	})
	
	var Agency = mongoose.model('Agency', AgencySchema);

	return Agency
}