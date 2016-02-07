var escape_html = function(str) {
  if (str) return str.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

//googleMAPS APIKEY
API_KEY = 'AIzaSyCm5WDRR3X90XXfkMHES7bqki77LG2a1Kg';

// générer un tipi-id au format suivant : LLL-CCC
// information: (L)ettre / (C)hiffre
// @n : le nombre de caractères pour chaque élément (n*L-n*C)
var generateTipiId = function(n) {
  var n = n || 3
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers = '1234567890',
    a = '',
    b = '';
  for (var i = 0; i < n; i++) {
    a += chars.charAt(Math.floor(Math.random() * chars.length));
    b += numbers.charAt(Math.floor(Math.random() * numbers.length));
  };
  return a + "-" + b
}

module.exports = function(mongoose, request, translator) {

  var EstateSchema = new mongoose.Schema({
    mode: {
      type: String,
      'enum': ['sale', 'rent'],
      index: true
    },
    zip: {
      type: Number,
      min: 1000,
      max: 9999,
      'default': '',
      index: true
    },
    city: String,
    city_fr: String,
    city_nl: String,
    city_en: String,
    address: String,
    partial_address: {
      type: Boolean,
      'default': false
    },
    category: {
      type: String,
      'enum': ['house', 'appartment', 'business', 'garage', 'terrain', 'land'],
      index: true,
      'default': 'house'
    },
    type: {
      type: String,
      index: true,
      'default': 'house'
    },

    new: {
      type: Boolean,
      'default': true
    },

    price: {
      type: Number,
      index: true
    },
    old_price: Number,
    nb_rooms: {
      type: Number,
      'default': 0,
      index: true
    },
    surface_area: Number,
    nb_bathrooms: {
      type: Number,
      'default': 0
    },
    land_surface: Number,
    construction_year: {
      type: String
    },
    nb_faces: Number,
    tags: [String],
    filters: [String],
    pictures: {
      type: [],
      'default': []
    },
    agency_id: String,
    owner_id: String,
    date_lastEdit: {
      type: Date,
      'default': Date.now
    },
    date_created: {
      type: Date,
      'default': Date.now,
      index: true
    },
    date_published: {
      type: Date,
      'default': Date.now
    },
    date_deleted: {
      type: Date,
      'default': null
    },
    date_last_import: {
      type: Date,
      'default': null
    },
    date_sold: {
      type: Date,
      'default': null
    },
    date_price_changed: {
      type: Date,
      'default': null
    },
    to_update: {
      type: Boolean,
      default: false
    },
    to_delete: {
      type: Boolean,
      default: false
    },
    provider: String,
    provider_ref: String,
    provider_oref: String, //other ref for some websites (such as ibp)
    provider_url: String,
    provider_url_fr: String,
    provider_url_nl: String,
    provider_url_en: String,
    sort_value: {
      type: Number,
      'default': 999999999,
      index: true
    },
    random_id: {
      type: Number,
      'default': Math.random()
    },
    tipi_id: {
      type: String,
      index: {
        unique: true
      }
    },
    lat: Number,
    lng: Number,
    loc: {
      index: '2dsphere',
      type: {}
    },

    validation_status: {
      type: Number,
      min: 0,
      max: 20,
      'default': 7,
      index: true
    },
    // 0 = not validated yet, 1 = validated, 2 = missing info, 3 = to check, 4 = invalid, 5 = on hold
    // 7 ejected when imports
    tipi_comment: String,
    province: {
      type: String,
      index: true
    },

    // highlightInfos will contain all information about the current highlight

    highlight: {
      type: Boolean,
      default: false
    },
    highlightBegin: {
      type: Date,
      default: Date.now
    },
    highlightEnd: {
      type: Date,
      default: Date.now
    },
    highlightInfos: {
      type: {}
    },
    highlightIcons: {
      type: [String]
    }
  })

  EstateSchema.index({
    _id: 1,
    zip: 1,
    mode: 1,
    category: 1,
    price: 1,
    nb_rooms: 1,
    date_deleted: 1,
    loc: 1,
    lat: 1,
    sort_value: 1,
    date_created: -1
  })
  EstateSchema.index({
    _id: 1,
    zip: 1,
    mode: 1,
    category: 1,
    price: 1,
    nb_rooms: 1,
    date_deleted: 1,
    province: 1,
    sort_value: 1,
    date_created: -1
  })

  EstateSchema.pre('validate', function(next) {
    //console.log('pre validate')
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
    if (!this.category) this.category = 'house'

    next()
  })

  EstateSchema.path('zip').validate(function(val) {
  	console.log('valZip:'  + val);
    var ziputils = require('./ziputils')
    return ziputils.isZip(val)
  }, 'InvalidZip');

  EstateSchema.post('validate', function(estate) {
    if (estate.validation_status == 0) {
      if (!estate.zip || !estate.category || !estate.pictures.length) {
        estate.validation_status = 2
      } else {
        estate.validation_status = 3
      }
    }
  })
  EstateSchema.post('init', function() {
    // this._original = this.toObject();
  });
  EstateSchema.pre('save', function(next) {
    if (this._original && this.price && this._original.price != this.price) {
      this.old_price = this._original.price
      this.date_price_changed = Date.now()
    }
    next()
  })
  EstateSchema.pre('save', function(next) {
    if (this.price) this.sort_value = this.price
    next()
  })
  EstateSchema.pre('save', function(next) {
    // managing tipi_id
    if (!this.tipi_id) this.tipi_id = generateTipiId()
    next()
  })
  EstateSchema.pre('save', function(next) {
    //console.log('pre save')
    this.date_lastEdit = Date.now();

    //check if there is something
    if (this._original) {
      if (this.pictures && this.pictures.length) {
        var pics = JSON.stringify(this.pictures);
        pics = JSON.parse(pics);
      } else var pics = []

      if (JSON.stringify(this._original.pictures) != JSON.stringify(pics)) {
        console.log('Damn pictures are differents !!!');
        if (!this.provider) this.validation_status = 6;
      }

      if(this.address){
      	if (this._original.address && this._original.address.trim() != this.address.trim()) {
	        console.log(this._original.address)
	        console.log(this.address)
	        console.log('Damn address is different!!!');
        if (!this.provider) this.validation_status = 6;
      	}
      }
    }


    // geocode the address
    var that = this
    var geoCode = true

    if (!this.address) geoCode = false
    else if (this.lat && this.lng || this.loc) geoCode = false
      // else if (this.lat && this.lng || (!this.loc && this.loc.length > 0)) geoCode = false
    if (this._original && this._original.address && this._original.address.trim() != this.address.trim()) geoCode = true
    if (this._original && this._original.zip != this.zip) geocode = true

    if (geoCode) {
      console.log(this.loc);
      console.log('resolving address:' + this.address)
      console.log('::::======================')
      var _address = this.address;
      var _zip = this.zip;

      request.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + this.address + "&components=country:BE|postal_code:" + this.zip + "&sensor=false&key=" + API_KEY, function(e, resp, body) {
        if (e) {
          console.log('error on model');
          console.log(e);
          console.log(body);
          console.log(resp);
        } else {

          var data = JSON.parse(body)

          console.log(_address + "&components=country:BE|postal_code:" + _zip + ' geocoded.')
          console.log(data.results)
          if (data.results[0]) {
            if (data.results[0].partial_match) that.partial_address = true
            that.lat = data.results[0].geometry.location.lat
            that.lng = data.results[0].geometry.location.lng
            that.loc = [that.lng, that.lat]
          }
          next()
        }
      })
    } else {
      //console.log('address already resolved')
      next()
    }

  })

  EstateSchema.methods.getTitle = function(lang) {
    if (!this.nb_rooms || this.category == 'terrain') return translator.translate('{type} à {city}', lang, {
      type: this.type,
      city: this.city
    });
    if (this.nb_rooms == 1) return translator.translate('{type} {nb} chambre à {city}', lang, {
      type: this.type,
      nb: this.nb_rooms,
      city: this.city
    });
    return translator.translate('{type} {nb} chambres à {city}', lang, {
      type: this.type,
      nb: this.nb_rooms,
      city: this.city
    });
  }

  EstateSchema.methods.getCity = function(lang) {
    return this['city_' + lang]
  }

  EstateSchema.methods.tipiIdExists = function(tipiId, callback) {
    // return true if founded
    this.model('Estate').count({
        tipi_id: tipiId
      },
      function(err, count) {
        (count == 0) ? callback(false) : callback(true);
      });
  }

  EstateSchema.methods.generateTipiId = function(callback) {
    callback(generateTipiId());
  }

  EstateSchema.methods.isHighlighted = function() {
    return this.highlight;
  }

  EstateSchema.methods.setHighlight = function(state) {
    if (typeof state === 'boolean') {
      this.highlight = state;
    }
  }

  EstateSchema.statics.random = function(args, cb) {
    var customSearch = args.criteria || {};
    var customLimit = args.limit || 1;

    this.count(customSearch, function(e, count) {
      if (e) return cb(e);
      var rand = Math.floor(Math.random() * (count - customLimit));
      // skip isn't working with negative numbers
      if (rand < 0) {
        rand = 0;
      }
      this.find(customSearch).skip(rand).limit(customLimit).exec(cb);
    }.bind(this));
  };

  EstateSchema.methods.unhighlight = function(validate) {
    if (validate) {
      this.highlight = false;
      this.highlightIcons = [];
      this.highlightInfos = {};
    }
  }
  EstateSchema.methods.highlightadmin = function(validate) {
    if (validate) {
      this.highlight = true;
      this.highlightIcons = ['Éco-construction', 'Nouveau Prix', 'Nouvelle Construction'];
      this.highlightInfos = {
        name: "Mettre en avant + page principale + vignettes : 5€ + 1€ / vignette",
        type: "landingHighlight",
        klass: "icons-landing-highlight"
      };
    }
  }

  EstateSchema.methods.setInfo = function(selectedType, selectedOptions) {
    if (selectedOptions) {
      this.highlightIcons = selectedOptions.split(', ');
    }

    var name = selectedType;

    switch (selectedType) {
      case "simpleHighlight":
        var type = "simpleHighlight";
        var klass = "simple-highlight"
      break;
      case "landingHighlight":
        var type = "landingHighlight";
        var klass = "landing-highlight"
      break;
      case "icons":
        var type = "icons";
        var klass = "icon-highlight"
      break;
      case "simpleHighlightIcons":
        var type = "simpleHighlightIcons";
        var klass = "simple-icon-highlight"
      break;
      case "landingHighlight":
        var type = "landingHighlight";
        var klass = "icons-landing-highlight"
      break;
      default: break;
    }

    this.highlightInfos = {
      name: name,
      type: type,
      klass: klass
    };
  }

  var Estate = mongoose.model('Estate', EstateSchema);

  return Estate
}
