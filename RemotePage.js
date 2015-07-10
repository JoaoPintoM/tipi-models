module.exports = function(mongoose) {

    var Estate = mongoose.model('Estate')

    var RemotePageSchema = new mongoose.Schema({
        url: String,
        url_fr: String,
        url_nl: String,
        url_en: String,
        date_imported: Date,
        date_downloaded: Date,
        date_updated: Date,
        provider: String,
        provider_ref: String,
        content_fr: String,
        content_nl: String,
        mode: String,
        is_sold: {
            type: Boolean,
            'default': 0
        },
        to_update: {
            type: Boolean,
            'default': false
        },
        to_download: {
            type: Boolean,
            'default': false
        },
        to_delete: {
            type: Boolean,
            'default': false
        },
        estate_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Estate'
        },
        office: String
    })

    var RemotePage = mongoose.model('RemotePage', RemotePageSchema)

    return RemotePage
}
