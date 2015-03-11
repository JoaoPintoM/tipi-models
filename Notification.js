'use strict';
module.exports = function(mongoose) {
	
	
	var notifSchema = new mongoose.Schema({
		user: {
			type: Schema.ObjectId,
			ref: 'User'
		}
	});
	
	var Notification = mongoose.model('Notification', notifSchema);
	
	return Notification;
}
	