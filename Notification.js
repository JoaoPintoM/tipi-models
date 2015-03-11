'use strict';

module.exports = function (mongoose) {

	var notificationSchema = new mongoose.Schema({
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		},
    zip: {
      type: [Number],
      min: 1000,
      max: 9999
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly'],
      default: 'daily'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
	});

  notificationSchema.path('zip').validate(function (zip) {
    if (zip.length <= 0) return false;
    return true;
  }, 'Zip cannot be empty');

	var Notification = mongoose.model('Notification', notificationSchema);

	return Notification;
}

