var mongoose = require('mongoose');

var maxFirstNameLength = [25, '{VALUE} exceeds the maximum length permitted ({MAXLENGTH}) for first names.'];
var maxLastNameLength = [45, '{VALUE} exceeds the maximum length permitted ({MAXLENGTH}) for last names.'];
var maxMobilePhoneLength = [12, '{VALUE} exceeds the maximum length permitted ({MAXLENGTH}) for phone numbers. Format is: 123-345-6789'];


var driverSchema = mongoose.Schema({

    stringObjectId : String,
    firstName : {
                    type : String,
                    required : [ true, 'First name is required.'],
                    maxlength : maxFirstNameLength,
                    validate : {
                                    validator : function (firstName) {
                                        return /^[-\sA-Za-z]+$/.test(firstName);
                                    },
                                    message : '{VALUE} is not a valid first name!'
                                }
                },
    lastName : {
                    type : String,
                    required : [ true, 'Last name is required.'],
                    maxlength : maxLastNameLength,
                    validate : {
                                validator : function (lastName) {
                                    return /^[-\sA-Za-z]+$/.test(lastName);
                                },
                                message : '{VALUE} is not a valid last name!'
                            }
                },
    mobilePhone : {
                    type : String,
                    required : [ true, 'Mobile phone number is required.' ],
                    maxlength : maxMobilePhoneLength,
                    validate : {
                                    validator : function (mobilePhone) {
                                        return /^\d{3}-\d{3}-\d{4}$/.test(mobilePhone);
                                    },
                                    message : '{VALUE} is not a valid phone number. Expected format is 123-456-6789'
                                }

                  },
    available : {
                    type : Boolean,
                    required: [ true, 'Available property is required.' ],
                    default : true
                },
    seniorityRank : {
                        type : Number,
                        default : 100,
                        min: 1,
                        index : true,
                        required : [ true, 'You must provide a valid whole number (integer) greater than 0' ],
                        validate : {
                                        validator : function (seniorityRank) {
                                                        if (parseInt(seniorityRank) !== seniorityRank) {
                                                            return false;
                                                        }
                                                        return true;
                                                    }
                                  }
                    },
    scheduleNote : [{
                            createDate : {
                                            type : Date,
                                            default : Date.now
                            },
                            note : String
                    }],
    firstToText : {
                        type : Boolean,
                        required: [true, 'firstToText is required.'],
                        default : false
                    },
    text : {
                type : Boolean,
                default : true,
                required : [ true, 'Text capability is required.' ]
            },
    deleted : {
                type : Boolean,
                default : false,
                required : [ true, 'Deleted property is required.' ]
            }
});

module.exports = mongoose.model('Driver', driverSchema);
