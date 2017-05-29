var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var maxLengthUserName = [20, '{VALUE} exceeds the maximum length permitted ({MAXLENGTH}) for usernames.'];
var maxLengthFirstName = [25, '{VALUE} exceeds the maximum length permitted ({MAXLENGTH}) for first names.'];
var maxLengthLastName = [45, '{VALUE} exceeds the maximum length permitted ({MAXLENGTH}) for last names.'];

var Schema =  mongoose.Schema;
var userSchema = new Schema({

    local : {
                admin : {
                            type : Boolean,
                            required : true,
                            default : false
                        },
                username : {
                                type : String,
                                required : [ true, 'Username is required.'],
                                maxlength : maxLengthUserName,
                                validate : {
                                                validator : function (username) {
                                                    return /^[a-zA-Z]+[0-9]*$/.test(username);
                                                },
                                                message : '{VALUE} is not a valid username!'
                                            }
                            },

                uFirstName : {
                                type : String,
                                required : [ true, 'First name is required.'],
                                maxlength : maxLengthFirstName,
                                validate : {
                                                validator : function (firstName) {
                                                    firstName = firstName.trim();
                                                    return /^[a-zA-Z]+([-\sa-zA-z])*$/.test(firstName);
                                                },
                                                message : '{VALUE} is not a valid first name!'
                                            }
                            },

                uLastName : {
                                type : String,
                                required : [ true, 'Last name is required.'],
                                maxlength : maxLengthLastName,
                                validate : {
                                            validator : function (lastName) {
                                                return /^[a-zA-Z]+([-\sa-zA-z])*$/.test(lastName);
                                            },
                                            message : '{VALUE} is not a valid last name!'
                                        }
                            },

                email : {   // NOTE: very little validation is used here.
                            type : String,
                            required : [ true, 'Email is required.'],
                            unique : true,
                            validate : {
                                        validator : function (email) {
                                            return email.trim().toLowerCase();
                                        },
                                        message : '{VALUE} is not a valid email!'
                                    }
                        },

                password : {
                                type: String,
                                validate : {
                                            validator : function (pword) {
                                                return /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#@$%\-_\.\+&\*? "]).*$/.test(pword);
                                            },
                                            message : '{VALUE} is not a valid password!'
                                        }
                            },

                //hash : String,
                createdOn : {
                                type : Date,
                                default : Date.now
                             }
            },
    google : {
                    id : String,
                    token : String,
                    email : String,
                    name : String
            }
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    return hash;
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
