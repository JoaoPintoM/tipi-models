var zipsByName = require('./zipsbyname')
var zipsByCode = require('./zipsbycode')

exports.resolve = function(zip, city){
	city = city && city.toLowerCase().replace(/[^a-z]/g, '')
	if (zip && city){
		if (zipsByCode[zip]) {
			// 
			zipsByCode[zip].forEach(function(rec){
				if (rec.fr.toLowerCase().replace(/[^a-z]/g, '') == city) return {zip: zip, city: rec}
				if (rec.nl.toLowerCase().replace(/[^a-z]/g, '') == city) return {zip: zip, city: rec}
				if (rec.en.toLowerCase().replace(/[^a-z]/g, '') == city) return {zip: zip, city: rec}
			})
			return {zip: zip, city: zipsByCode[zip][0]}
		}
		else if (zipsByName[city]){
			return exports.resolve(zipsByName[city], city)
		}
		else return new Error('ZipOrCityNotFound')
	}
	else if (zip){
		// zip only -> return first record
		if (! zipsByCode[zip]) return new Error('ZipNotFound')
		return {zip: zip, city: zipsByCode[zip][0]}
	}
	else if (city){
		// city only -> return first record
		if (! zipsByName[city]) return new Error('CityNotFound')
		return exports.resolve(zipsByName[city], city)
	}
	else return new Error('EmptyZipAndCity')
}

exports.isZip = function(zip){
	return !! zipsByCode[zip]
}