# final-project-nodejs
Final project using Node.js, Express 4.x, Handlebarsjs, MongoDB, Twilio, and various npm modules.

## Project Documentation
During the build and test phases of the final project, all non-technical documentation is located in Google Drive:
[Node Final Project](https://drive.google.com/drive/folders/0B0fZ5svI7A9_NnctUWc1WFo0OUU?usp=sharing)

## Project Management & SDLC
The final project will use [Trello] (www.trello.com) as the project management tool. The SDLC will be:
- Agile (KanBan)
- TDD
There are two boards in play:
1) [Robo-SMS Epics & User Stories (Green Board)](https://trello.com/b/wrWUGkdT/robo-sms-epics-user-stories) - Contains higher level functionality and feature sets
2) [Robo-SMS Developer (Blue Board)](https://trello.com/b/zHG9ldKX/robo-sms-developer) Lists of tasks that comprise the User Stories and Epics.

# Installation
This project is completely backend - there is no UI. UI is under development and will be available shortly.

npm Packages Robo-SMS uses:
1) express
2) moment
3) handlebarsjs   NOTE: not ready for production
4) body-parser
5) twilio
6) express-session
7) mongoose
8) bunyan
9) socket.io    NOTE: not implemented yet.
10) dotenv
11) consolidate  NOTE: not ready for production
12) passport   NOTE: not implemented yet

Install MongoDB. Install the rest of the packages. Provide your own text recipients based on the
Schemas-README.MD.

# Other requirements
- You'll need to purchase a phone number from Twilio, and get authentication credentials.



# Background
This app is desinged to solve a business problem at a local branch of an international car rental
agency. This app enables an administrator to do in a few clicks what normally took at least 1 hour
of her time every day.

The problem: Very manual, paper-based process that required an hour at least of an administrator's time on a daily basis. She calls each driver (approximately 20) to see if they are available and
willing to go to regional location at least once per day, manually keeping track of each driver called, and his or her response.

# App Features
## Drivers
- Select the next 'first to text' driver
- Select/deselect driver availability for each trip so unavailable drivers are not texted
- Select/deselect driver text capability (all drivers are retired, but only two don't text)
- Create a schedule note for each driver
- Driver data stored in MongoDB database

## Trips
- Select a regional location
- Select quantity of drivers needed
- Select date and time of trip
  -- Trip can be scheduled in advance as well as same-day
  -- Same day trips need a 40 minute lead time
  -- Drivers can respond no later than 30 minutes before scheduled trip start
- Automatically constructs driver request text based on selected inputs
- Preserves seniority rank privileges of drivers by:
   -- Texting via seniority rank
   -- Texting the exact number of drivers needed to meet the quota
   -- App waits 4 minutes before rounds of texts to allow drivers to respond before
      more drivers are texted
- Only sends texts to drivers that are marked 'Avaialable' and 'Text' capability is marked
  'True' when the trip is created.
- Automatically tracks which drivers were texted and driver response / non-response
- Autmotaically adjusts number of drivers to text based on responses received / not received
  and number of drivers available to text and remaining to text
- Only texts drivers once per trip.
- Automatically constructs confirmation / rejection / trip request finished texts
- Drivers can not change their response once a valid response is submitted
- If trip is active, all 'Yes' responses receive a confirmation response:
   -- If driver quota is not yet met and response deadline has not passed, driver
      receives a 'Yes-Accepted' confirmation message.
   -- If driver quota is met and response deadline has not passed (trip is still active),
      driver receives a 'Yes-Rejected' confirmation message.
- No confirmation texts sent to drivers for 'No' responses unless the trip is finished
- No confirmation text sent for 'garbage responses'
- Auto-response sent for duplicate responses from the same driver.
- Auto-response sent to drivers if they attempt to change their response (must be valid
     response).
- Valid responses: 1 or y or Y = Yes; 2 or n or N = No
- App tracks time until the response deadline, and ends the trip once the deadline is passed
- App tallies "yes" responses against driver quota requested - ends the trip once if quota is
  met
-  

## App Users
- Add users to (not drivers) via the front end
- Set user's access level:
  -- admin
  -- user
- User-level access:
    - Set 1st to text driver
    - Change availability for drivers
    - Change text capability for drivers
    - Add and delete schedule notes for drivers
- Admin-level access:
    - Everything that user-level access can do, plus:
    - Grant access to the app for new users
    - Set new user access-level (admin / user)
