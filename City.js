module.exports = function (mongoose) {

    var CitySchema = new mongoose.Schema({
        zip: {type: Number, index: true},
        name_fr: String,
        name_nl: String,
        name_en: String,
        search_string_fr: {type: String, index: true},
        search_string_nl: {type: String, index: true},
        search_string_en: {type: String, index: true},
        borders: Array,
        center: {
            index: '2dsphere',
            type: {}
        },
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
