module.exports = function(mongoose) {

    var AdvertSchema = new mongoose.Schema({

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
        category: {
            type: String,
            enum: ['house', 'appartment', 'house_or_appartment', 'business', 'garage', 'terrain'],
            default: null
        }
    })

    var Advert = mongoose.model('Advert', AdvertSchema)

    return Advert;
}
