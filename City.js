module.exports = function(mongoose) {

	var CitySchema = new mongoose.Schema({
        zip: String,
        name_fr: String,
        name_nl: String,
        name_en: String,
        search_string_fr: String,
        search_string_nl: String,
        search_string_en: String,
        borders: Array,
        center: Array,
        parent_zip: String,
        order_id: Number,
        website_fr: String,
        website_nl: String,
        website_en: String,
        wikipedia_fr: String,
        wikipedia_nl: String,
        wikipedia_en: String,
        province_fr: String,
        province_nl: String,
        province_en: String
	})

	var City = mongoose.model('City', CitySchema);

	return City
}
