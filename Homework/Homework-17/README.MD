# Homework

```js
[
  { id: 1, firstName: 'Blake', lastName: 'Johnston', isMember: true },
  { id: 2, firstName: 'Susan', lastName: 'Wright', isMember: false },
  { id: 3, firstName: 'John', lastName: 'Smith', isMember: false },
  { id: 4, firstName: 'Jen', lastName: 'Hawkins', isMember: false },
  { id: 5, firstName: 'Brenna', lastName: 'Blackwell', isMember: true }
]
```

Create a new Express app that matches the below documentation, and use `filter`, `map` and `reduce` where possible:

*GET /*

- Desc: Root
- Response: 200 text/html
- Data: "Welcome to Shamazon - the best site for buying all the things!"

*GET /users*

- Desc: Returns all current users
- Response: 200 application/json
- Data: [{}, {}, {}]

*POST /users*

- Desc: Adds a new user to the system and returns the new user
- Response: 200 application/json
- Data: {}
- Note: `id` needs to be incremented by the API, and provided in the POST request

*GET /members*

- Desc: Returns all current members (i.e. `isMember = true`)
- Response: 200 application/json
- Data: [{}, {}, {}]

*GET /members/:id*

- Desc: Returns a single member represented by his or her `id`
- Response: 200 application/json
- Data: {}

*PUT /members/:id*

- Desc: Updates the provided user's member status and returns the updated user
- Response: 200 application/json
- Data: {}
- Note: No field other than `isMember` should be updated, regardless of the data that's provided. The API should error if a field other than `isMember` is being updated


*Bonus*:

- Add unit tests
- Add middleware to log the time each request takes
