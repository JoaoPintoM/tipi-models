var zipsByName = require('./zipsbyname')
var zipsByCode = require('./zipsbycode')
var provinceData = require('./provinces')

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
exports.getProvinceIdByZip = function(zip){
    if (zip < 1300) return 'bxl'    // bruxelles
    if (zip < 1500) return 'bw'     // brabant wallon
    if (zip < 2000) return 'vb'     // brabant flamand
    if (zip < 3000) return 'ant'    // anvers
    if (zip < 3500) return 'vb'     // brabant flamand
    if (zip < 4000) return 'lim'    // limbourg
    if (zip < 5000) return 'lie'    // liège
    if (zip < 6000) return 'nam'    // namur
    if (zip < 6600) return 'hai'    // hainaut
    if (zip < 7000) return 'lux'    // luxembourg
    if (zip < 8000) return 'hai'    // hainaut
    if (zip < 9000) return 'wv'     // flandre occidentale
    return 'ov'                     // flandre orientale
}
