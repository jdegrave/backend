var mongoose = require('mongoose');
var moment = require('moment');
var tripSchema = mongoose.Schema({

    cityCode : {
                    type : mongoose.Schema.Types.ObjectId, ref : 'Location',
                    required: [ true, 'City Code is required.']
                },
    driverQuota : {
                    type: Number,
                    min : 1,
                    required : [ true, 'You must select the number of drivers needed.'],
                    validate : {
                                    validator : function (driverQuota) {
                                        if (parseInt(driverQuota, 10) !== driverQuota) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    },
                                    message : '{VALUE} must be a whole number (integer) greater than 0.'
                                }
                    },
    tripStart : {
                    type : Date,
                    required: [ true, 'Trip Start Date and Start Time are required.'],
                    default: Date.now
                },
    availableDrivers : {
                            type: [ mongoose.Schema.Types.ObjectId ], ref : 'Driver',
                            required : [ true, 'At least one driver is required.'],
                            validate : {
                                            validator : function (availableDrivers) {
                                                if (availableDrivers.length === 0) {
                                                    return false;
                                                } else {
                                                    return true;
                                                }
                                            }
                                        }
                        },
    responses : {
                    yesAccepted : [{ type : mongoose.Schema.Types.ObjectId, ref : 'Driver' }],
                    yesRejected : [{ type : mongoose.Schema.Types.ObjectId, ref : 'Driver' }],
                    declined : [{ type : mongoose.Schema.Types.ObjectId, ref : 'Driver' }],
                    noResponse : [{ type : mongoose.Schema.Types.ObjectId, ref : 'Driver' }]
                },
    responseDeadline : {
                            type : Date,
                            required : [ true, 'Response Deadline is required!' ]
                         },
    messages : {
                    driverRequest : {
                                        type : String,
                                        required : [ true, 'Driver request message is required.'],
                                        validate : {
                                                        validator : function (driverRequest) {
                                                            if (/^\s+$/.test(driverRequest)) {
                                                                return false;
                                                            } else {
                                                                return true;
                                                            }
                                                        }
                                                    }
                                    },
                    confirmationAccepted : {
                                                type : String,
                                                required : [ true, 'Confirmation message to drivers who accepted and are assigned to the trip is required.'],
                                                validate : {
                                                                validator : function (confirmationAccepted) {
                                                                    if (/^\s+$/.test(confirmationAccepted)) {
                                                                        return false;
                                                                    } else {
                                                                        return true;
                                                                    }
                                                                }
                                                            }
                                            },
                    confirmationRejected : {
                                                type : String,
                                                required : [ true, 'Confirmation message to drivers who accepted trip but are not assigned to the trip is required.'],
                                                validate : {
                                                                validator : function (confirmationRejected) {
                                                                    if (/^\s+$/.test(confirmationRejected)) {
                                                                        return false;
                                                                    } else {
                                                                        return true;
                                                                    }
                                                                }
                                                            }
                                            }
                },
    status : {
                type: String,
                required: [ true, 'Trip status is required.'],
                validate : {
                                validator:  function (status) {
                                    var validStatuses = ['BLANK', 'PENDING', 'COMPLETE', 'INCOMPLETE'];
                                    if (validStatuses.indexOf((status.toUpperCase())) !== -1) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }
                }
    }
});


module.exports = mongoose.model('Trip', tripSchema);
