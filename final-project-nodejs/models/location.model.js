var mongoose = require('mongoose');

var maxCityLength = [25, '{VALUE} exceeds the maximum length permitted ({MAXLENGTH}) for city names.'];
var maxCityCodeLength = [3, '{VALUE} exceeds the maxmimum length permitted ({MAXLENGTH}) for city codes.'];
var minCityCodeLength = [3, '{VALUE} is less than the minimum length permitted ({MINLENGTH}) for city codes.'];

var locationSchema = mongoose.Schema({

    city : {
                type : String,
                required : [ true, 'City name is required.'],
                maxlength : maxCityLength,
                validate : {
                    validator : function (city) {
                        return /^[a-zA-Z0-9-]+(\s[a-zA-Z0-9-]+)*$/.test(city);
                    },
                    message : '{VALUE} is not a valid city name!'
                }
            },

    cityCode : {
                    type : String,
                    required : [ true, 'City Code is required.'],
                    maxlength: maxCityCodeLength,
                    minlength : minCityCodeLength,
                    validate : {
                                    validator: function (cityCode) {
                                                    var validCityCodes = ['FSM', 'JLN', 'JP6', 'LCL', 'OKC', 'PLK', 'SGF', 'TUL' ];
                                                    var results = validCityCodes.indexOf(cityCode);

                                                    if (results === -1) {
                                                        return false;
                                                    } else {
                                                        return true;
                                                    }
                                                },
                                                message : '{VALUE} is not a valid city code. Expected 3 letter code.'
                                }
                },
    active : {
                type: Boolean,
                required : [ true, 'Active property is required.'],
                default: false
            }
});

module.exports = mongoose.model('Location', locationSchema);
