# Robo-SMS API Documentation

Robo-SMS uses Node.js as the web server and Twilio APIs for actually sending and
receiving text messages. Only the Node.js APIs are documented here; see the [Twilio](www.twillio.com) documentation for information on the Twilio APIs.

GET '/drivers'
- fetches driver information from mongodb via mongoose
- loads Drivers' Tab as the home page:
   - First name
   - Last name
   - Phone number
   - Availability (checked = is available for the current trip)
   - Schedule Notes
   - Text (checked = is capable of receiving text messages)
   - Drivers are ordered by Seniority Rank (1 = highest)


POST '/drivers/update1'
- No update to driver first name, last name, phone number, or seniority rank
- Updates to Driver Availability/Unavailability
- Updates to driver Schedule Notes
- Updates to driver Text capability
- Format: expects an array of driver objects, since it checks the front end.

NOTE: 'POST' is used because the data is coming from a form, which only performs
      'GET' and 'POST' requests.

To update driver availability, send requests in the application/json format:

[
    {
        "_id" : ObjectId("58f910bc1693d1240f16ce10"),
        "__v" : 0,
        "firstName" : "Jodi",
        "lastName" : "De Grave",
        "mobilePhone" : "479-715-7785",
        "deleted" : false,
        "text" : true,
        "firstToText" : true,
        "scheduleNote" : [ ],
        "seniorityRank" : 17,
        "available" : true
    }, etc.
]

GET '/trips'
- Retrieves locations from mongodb
- Generates trips UI:  // not implemented as of 04/29/2017
   - HTML template engines create dropdown of Locations, number widget, date picker and time picker   

POST '/trips'
- Must include the following:
   - city
   - Number of drivers needed
   - date
   - time
- Creates the trip object. Available drivers will be culled from the last save to the
  database.  // UI not implemeneted as of 04/29/2017


// The following is not implemented as of 04/29/2017:  
- Redirects to '/trips/:tripId' to ensure page is saved in browser history.
- Re-renders the trips page and adds the trip dashboard
- Socket.io pushes trip status to trip dashboard
