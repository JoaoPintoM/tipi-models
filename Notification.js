'use strict';

module.exports = function (mongoose) {

	var notificationSchema = new mongoose.Schema({
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		},
    zips: {
      type: [Number],
      min: 1000,
      max: 9999
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly'],
      default: 'daily'
    },
    mode: {
      type: String,
      enum: ['rent', 'sale'],
      default: 'sale'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    priceMin: {
      type: Number,
      default: 0
    },
    priceMax: {
      type: Number,
      default: -1
    },
    type: {
      type: String,
      enum: [ 'all', 'house', 'appartment', 'house_or_appartment', 'business', 'garage', 'terrain' ],
      default: 'all'
    },
    rooms: {
      type: Number,
      default: 0
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

  notificationSchema.path('zips').validate(function (zips) {
    if (zips.length <= 0) return false;
    return true;
  }, 'Zip cannot be empty');

	var Notification = mongoose.model('Notification', notificationSchema);

	return Notification;
}

