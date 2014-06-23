var mongoose = require('mongoose')
var PostalCodeSchema = new mongoose.Schema({
    zip: String,
	fr: String,
	nl: String,
	en: String,
	group:String,
	order_id:Number
})


var PostalCode = mongoose.model('PostalCode', PostalCodeSchema);

module.exports = PostalCode