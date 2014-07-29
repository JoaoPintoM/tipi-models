module.exports = function(mongoose) {
	
	var UserSchema = new mongoose.Schema({
		email: {type: String, index: {unique: true}},
		password: String,
		dateCreated: {type: Date, 'default': Date.now},
		lastLogin: Date,
		loginCount: {type: Number, 'default': 0},
		roles: [String],
		ads: [String],
		favorites: [String],
		blacklist: [String],
		lang: String,
		notifications: {
			frequency: Number,
			mode: {type: String, 'default': 'rent'},
			category: {type: String, 'default': ''},
			zip: String,
			price_min: {type:Number, 'default':0},
			price_max: {type:Number, 'default':null},
			min_rooms: {type:Number, 'default':0}
		}
	})
	

	UserSchema.path('password').validate(function (pass) {
	   return (pass.length < 4) ? false : true
	}, 'PasswordTooShort')
	
	UserSchema.path('email').validate(function (email) {
	   return email && email.length
	}, 'EmptyEmail')
	
	UserSchema.path('email').validate(function (email) {
	   var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	   return emailRegex.test(email)
	}, 'InvalidEmail')
	
	UserSchema.methods.isAuthenticated = function () {
		return (this.email != 'anonymous')
	}
	UserSchema.methods.hasAnyRole = function (rolesToCheck) {
		for (var r in rolesToCheck){
			//console.log(this.roles)
			//console.log(this.roles.indexOf(rolesToCheck[r]) > -1)
			if (this.roles.indexOf(rolesToCheck[r]) > -1) return true
		}
		return false
	}
	UserSchema.methods.addFavorite = function (id) {
		if (! this.favorites.indexOf(id) > -1){
			this.favorites.push(id.toString())
		}
	}
	UserSchema.methods.removeFavorite = function (id) {
		var index = this.favorites.indexOf(id)
		if (index > -1) this.favorites.splice(index, 1)
	}
	UserSchema.methods.hasFavorite = function (id) {
		if (this.favorites.indexOf(id) > -1) return true
		return false
	}
	UserSchema.methods.hasBlacklisted = function (id) {
		if (this.blacklist.indexOf(id) > -1) return true
		return false
	}
	UserSchema.methods.addToBlacklist = function (id) {
		if (! this.blacklist.indexOf(id) > -1){
			this.blacklist.push(id)
		}
	}
	UserSchema.methods.removeFromBlacklist = function (id) {
		var index = this.blacklist.indexOf(id)
		if (index > -1) this.blacklist.splice(index, 1)
	}
	var User = mongoose.model('User', UserSchema);
	
	return User
}
