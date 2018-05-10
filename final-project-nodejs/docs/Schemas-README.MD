# Schemas
Mongoose uses the following schemas for Robo-SMS:

## Driver
    {
        id : ObjectId
        stringObjectId: String,      
        firstName : String,
        lastName : String,
        mobilePhone : String,
        available : Boolean,
        seniorityRank : Number,
        scheduleNote : [{ note : String, createDate : Date }],    
        firstToText : Boolean,
        text : Boolean,
        deleted : false
    },

    etc...

## Location

    {
        id : ObjectId,
        city : String,
        cityCode : String
    },

    etc...



## Trip
    {
        id : ObjectId
        cityCode : ObjectId, ref:Locations
        driverQuota : Number,
        tripStart : Date,
        availableDrivers : [[ObjectId], ref: Drivers],
        responses : {
                        yesAccepted : [[ObjectId], ref: Drivers],
                        yesRejected : [[ObjectId], ref: Drivers],
                        declined : [[ObjectId], ref: Drivers],
                        noResponse : [[ObjectId], ref: Drivers]
                    },
        responseDeadline : Date,
        messages: {
                        driverRequest : String,
                        confirmationAccepted : String,
                        confirmationRejected : String
                    },
        status: String            

    },

    etc...

## Users
    {
        id : ObjectId,
        username : String,      
        uFirstName : String,
        uLastName : String,
        email : String,
        password : String (stored as hash),
        admin : Boolean
    },

    etc...    
