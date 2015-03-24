'use strict';

module.exports = function (mongoose) {

	var statsContactSchema = new mongoose.Schema({
		user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    recipientUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    recipientAgency: {
      type: mongoose.Schema.ObjectId,
      ref: 'Agency'
    },
    recipientType: {
      type: String,
      enum: [ 'user', 'agency' ]
    },
    sendTo: {
      type: String
    },
    message: {
      type: String,
    },
    estate: {
      type: mongoose.Schema.ObjectId,
      ref: 'Estate'
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

	var StatsContact = mongoose.model('StatsContact', statsContactSchema);

	return StatsContact;
}

