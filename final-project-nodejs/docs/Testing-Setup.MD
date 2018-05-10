# Seeding & Testing Setup

Most of the unit tests are stand-alone, as expected. However, for small tests that
evaluate basic CRUD operations to MongoDB, some setup is required. Use these instructions
to ensure tests behave as expected.

NOTE:  To test the texting portion of the tests, I created 3 databases:

       - jodi-only -- has all of the alphatest drivers but I am the only 'available' driver
       - special-test -- has all of the alphatest drivers but only myself and two others
                       are 'avaialble' (these are friends of mine that are tech-savvy)
       - alphatest -- has work colleagues, friends and me - 11 available drivers, plus a few REAL drivers 
                      that MUST ALWAYS BE SET TO 'UNAVAILABLE!!'              


NOTE:  ONLY use the 'seed' database for driver services tests!
       ONLY Use the 'seed-alphatest' db for trip services test

## Seeding the Database - DRIVER TESTS ONLY!!!
 - Script and data files are in the /seed folder
 - Run ```node seed-script.js```

## Mongoose Schema Tests
- These are 100% isolated tests. Run as normal.

## Driver Services Tests
1. Seed the database. For best results, start with freshly seeded database to avoid duplicates.

2. Run ```node index.js```

3. Use Postman or curl to perform a GET request to endpoint ```localhost:3000/drivers```

4. Setup the following tests with this specific data (if a test isn't mentioned, doesn't require special setup). 
   Copy and paste from the GET request results set in Step 3 as necessary:

    - *driverServices tests: 
        -- fetchDriverById test*
           -- From the results set, copy the *ObjectId* for Jim Westphal (1st in the list in the GET request results) in the following 
              lines of test code:
              -- return driverServices.fetchDriverByID('* Paste Object ID here *');
              -- expect(driverData._id.toString()).to.equal('* Paste Object ID here *');

    - *driverServices tests: -- fetchDriverBymobilePhone test*
    
        -- This already has Jim Westphal's mobile phone number in the test. He is 1st in the list in the GET request results. If you 
           change the number, you must change all the data expected to return.

    - *driverServices tests: -- updateOneDriverById test*
        -- From the results set, copy the *ObjectId* for Tom Nolan (2nd in the list in the GET request results) in the following lines              of test code:



## Route Index Tests - Driver
Route tests assume, when appropriate, that a tool such as Postman or curl will be used
for POST, PUT, and DELETE requests.

NOTE: DELETE requests may not be available in the initial release.

1. If you haven't done so already, perform a GET request (```localhost:3000/drivers);```

2. Setup the data for the following tests as described. If a test isn't indicated, there are no special data requirements.
   - *routeIndex tests: -- PUT /drivers (updateOneDriverById test)*
   
      -- Copy the *ObjectId* from Bob Olson (6th in the GET results set) in the following line of code:
      -- "_id": "* Paste ObjectId here *",
      -- Also, change the following data to:
      
         -- "text" : false,
         -- "available" : false,
         -- ScheduleNote : [{ "Bob's 1st Test Note "}]  

   - *routeIndex GET - /driver/id/:id (fetchDriverByID test)*
   
      -- Copy the *ObjectId* from Gary Holtgrewe (last in the GET results set) in the following line of code:
      
          -- .get('/driver/id/* Paste ObjectId here*');




## Location Services Tests
- TBD

## Trip Services Tests  
-- USE SEED-ALPHATEST! DO NOT CHANGE AVAILABLITY OF DRIVERS!
