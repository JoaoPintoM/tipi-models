
module.exports = function(mongoose, request) {

	var EstateSchema = new mongoose.Schema({
		mode: {type: String, 'enum':['sale', 'rent']},
		zip: {type: Number, min: 1000, max: 9999, 'default':''},
		city: String,
		address: String,
		partial_address: {type:Boolean, 'default':false},
		category: String,
		type: String,
		price: Number,
		old_price: Number,
		nb_rooms: {type:Number, 'default':0},
		surface_area: Number,
		nb_bathrooms: {type:Number, 'default':0},
		land_surface: {type:Number, 'default':null},
		construction_year: String,
		nb_faces: Number,
		tags: [String],
		pictures: {type:[], 'default':[]},
		agency_id: String,
		owner_id: String,
		date_created: {type: Date, 'default': Date.now},
		date_deleted: {type: Date, 'default': null},
		date_last_import: {type: Date, 'default': null},
		date_sold: {type: Date, 'default': null},
		date_price_changed: {type: Date, 'default': null},
		provider: String,
		provider_ref: String,
		provider_url: String,
		sort_value: {type: Number, 'default': 999999999},
		random_id: {type: Number, 'default': Math.random()},
		lat: Number,
		lng: Number,
		loc: {
			index: '2dsphere',
			type: {}
		  },
		validation_status: {type: Number, min: 0, max: 4, 'default': 0} // 0 = not validated yet, 1 = validated, 2 = missing info, 3 = to check, 4 = invalid
	})
	EstateSchema.post('validate', function (estate) {
		if (estate.validation_status == 0){
			if (!estate.zip || !estate.category || !estate.pictures.length){
				estate.validation_status = 2
			}
			else {
				estate.validation_status = 3
			}
		}
	})
	EstateSchema.post('init', function() {
		this._original = this.toObject();
	});
	EstateSchema.pre('save', function (next) {
		if (this._original && this.price && this._original.price != this.price) {
			this.old_price = this._original.price
			this.date_price_changed = Date.now()
		}
		next()
	})
	EstateSchema.pre('save', function (next) {
		if (this.price) this.sort_value = this.price
		next()
	})
	EstateSchema.pre('save', function (next) {
		// geocode the address
		var that = this
		var geoCode = true
		if (!this.address) geoCode = false
		else if (this.lat && this.lng){
			if (this._original && this._original.lat == this.lat && this._original.lng == this.lng) geoCode = false
		}
		
		if (geoCode){
			console.log('resolving address:' + this.address)
			request.get("http://maps.googleapis.com/maps/api/geocode/json?address="+this.address+"&components=country:BE|postal_code:"+this.zip+"&sensor=false", function(e, resp, body){
				var data = JSON.parse(body)
				console.log(data)
				if (data.results[0]){
					if (data.results[0].partial_match) that.partial_address = true
					that.lat = data.results[0].geometry.location.lat
					that.lng = data.results[0].geometry.location.lng
					that.loc = [that.lat, that.lng]
				}
				next()
			})	
		}
		else {
			console.log('address already resolved')
			next()	
		}
		
	})
	var Estate = mongoose.model('Estate', EstateSchema);

	return Estate
}

