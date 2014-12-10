var escape_html = function(str){
	if (str) return str.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

module.exports = function(mongoose, request, translator) {

	var EstateSchema = new mongoose.Schema({
		mode: {type: String, 'enum':['sale', 'rent'], index:true},
		zip: {type: Number, min: 1000, max: 9999, 'default':'', index:true},
		city: String,
		city_fr: String,
		city_nl: String,
		city_en: String,
		address: String,
		partial_address: {type:Boolean, 'default':false},
		category: {type: String, 'enum':['house', 'appartment', 'business', 'garage', 'terrain', 'land'], index:true},
		type: {type: String, index:true},
		price: {type: Number, index: true},
		old_price: Number,
		nb_rooms: {type:Number, 'default':0, index: true},
		surface_area: Number,
		nb_bathrooms: {type:Number, 'default':0},
		land_surface: Number,
		construction_year: {type: String},
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
		validation_status: {type: Number, min: 0, max: 6, 'default': 0}, // 0 = not validated yet, 1 = validated, 2 = missing info, 3 = to check, 4 = invalid, 5 = on hold
		tipi_comment : String,
        province: {type: String, index:true}
	})
	
	EstateSchema.pre('validate', function (next) {
		// console.log('resolving stuff !!! =================================');
		var ziputils = require('./ziputils')
		var resolved = ziputils.resolve(this.zip, this.city)
		if (resolved.zip) {
			this.zip = resolved.zip
			this.city_fr = resolved.city.fr
			this.city_nl = resolved.city.nl
			this.city_en = resolved.city.en
		}
		// sanitize strings
		this.city = escape_html(this.city)
		this.address = escape_html(this.address)
		this.type = escape_html(this.type)
		this.construction_year = escape_html(this.construction_year)
		// resolve province
        this.province = ziputils.getProvinceIdByZip(this.zip)

		next()
	})
	
	EstateSchema.path('zip').validate(function(val){
		var ziputils = require('./ziputils')
		return ziputils.isZip(val)
	}, 'InvalidZip');
	
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

		var pics = JSON.stringify(this.pictures);
		pics = JSON.parse(pics);

		if(JSON.stringify(this._original.pictures) != JSON.stringify(pics)){
			this.validation_status = 6;
		}

		if (this._original.address != this.address){
			this.validation_status = 6;
		}

		// geocode the address
		var that = this
		var geoCode = true

		if (!this.address) geoCode = false
		else if (this.lat && this.lng || this.loc) geoCode = false
		// else if (this.lat && this.lng || (!this.loc && this.loc.length > 0)) geoCode = false
		if (this._original && this._original.address != this.address) geoCode = true
		if (this._original && this._original.zip != this.zip) geocode = true
		
		if (geoCode){
			// console.log('resolving address:' + this.address)
			// console.log('::::======================')
			request.get("http://maps.googleapis.com/maps/api/geocode/json?address="+this.address+"&components=country:BE|postal_code:"+this.zip+"&sensor=false", function(e, resp, body){
				var data = JSON.parse(body)
				console.log(data)
				if (data.results[0]){
					if (data.results[0].partial_match) that.partial_address = true
					that.lat = data.results[0].geometry.location.lat
					that.lng = data.results[0].geometry.location.lng
					that.loc = [that.lng, that.lat]
				}
				next()
			})	
		}
		else {
			// console.log('address already resolved')
			next()	
		}
		
	})

	 EstateSchema.methods.getTitle = function (lang) {
	 	if (!this.nb_rooms || this.category=='terrain') return translator.translate('{type} à {city}', lang, {type:this.type, city: this.city});
	 	if (this.nb_rooms == 1) return translator.translate('{type} {nb} chambre à {city}', lang, {type:this.type, nb:this.nb_rooms, city: this.city});
	 	return translator.translate('{type} {nb} chambres à {city}', lang, {type:this.type, nb:this.nb_rooms, city: this.city});
	 }

     EstateSchema.methods.getCity = function (lang) {
	 	return this['city_' + lang]
	 }

	var Estate = mongoose.model('Estate', EstateSchema);

	return Estate
}

