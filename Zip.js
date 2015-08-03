module.exports = function(mongoose) {



    var ZipSchema = new mongoose.Schema({
        name: String,
        zip: {
            type: Number,
            min: 1000,
            max: 9999,
            'default': ''
        }
    })

    var Zip = mongoose.model('Agency', ZipSchema);

    return Zip
}
