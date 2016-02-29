var util = require("util");
var events = require("events");

module.exports = function(mongoose) {

	var Translator = function(defaultLanguage, availableLanguages) {


		this.defaultLanguage = defaultLanguage;
		this.availableLanguages = availableLanguages;
		this.translations = {}
		var schemaConfig = {
			key: {
				type: String,
				index: {
					unique: true
				}
			}
		}
		for (var lg in this.availableLanguages) schemaConfig[this.availableLanguages[lg]] = String;

		var TranslationSchema = new mongoose.Schema(schemaConfig);
		this.model = mongoose.model('Translation', TranslationSchema);
		events.EventEmitter.call(this);

		this.loadTranslations();
	}
	util.inherits(Translator, events.EventEmitter);

	Translator.prototype.translate = function(str, lang, vars) {

		var key = this.getKey(str),
			re;
		if (this.translations[key]) {
			if (this.translations[key][lang]) str = this.translations[key][lang];
		} else this.addTranslation(key, str);
		for (var k in vars) {
			re = new RegExp('\{' + k + '\}');
			str = str.replace(re, vars[k]);
		}
		return str;
	}
	Translator.prototype.addTranslation = function(key, str) {
		var conf = {
			key: key
		}
		for (var lg in this.availableLanguages) {
			if (this.availableLanguages[lg] == this.defaultLanguage) conf[this.availableLanguages[lg]] = str;
			else conf[this.availableLanguages[lg]] = '';
		}
		var translation = new this.model(conf);
		translation.save();
	}
	Translator.prototype.getKey = function(str) {
		// returns a search friendly string from a given string
		// (all lowercase with special chars replaced with a dash)
		return str.replace(/[^a-zA-Z0-9_-]/gi, '-');
	}
	Translator.prototype.loadTranslations = function(str) {

		var translator = this;
		this.model.find({})
			.sort({
			_id: 'asc'
			}).exec(function(err, translations) {

				console.log(err);

				for (var t in translations) {
					translator.translations[translations[t].key] = translations[t];
				}
				console.log('++++++++++++++');
				translator.emit('translationsLoaded');
			})
	}

	return Translator
}
