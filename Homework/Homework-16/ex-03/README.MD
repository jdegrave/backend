## Exercise 3

- Create a new project directory and setup ESLint from scratch using a pre-defined style guide.
- Run the linter on your project
- Setup EditorConfig as well


### Solution
- This uses the Menagerie exercise (code is in this directory):

    - Create an Express API for the animals of your choice
      It should contain:

        - At least 3 types of animals
        - GET, POST, PUT, DELETE requests for each animal
        - The animals should be stored in their own individual modules
        - We should be able to sort the animals returned from the API by their ID and one other parameter of your choosing

     - Bonus:

        - Increment the ID automatically when inserting a new animal
        - Update only the properties that change when making an update request
        - Add error handling

- ESLint CLI setup:
   - Navigate to node_modules/eslint/bin
   - Run  node eslint --init
   - Select 'Use a popular style guide'
   - Select 'Airbnb'
   - Answer 'No' to 'Do you use React?'
   - Select 'json'

   NOTE:  Had errors so copied the following from in-class exercise to
          node_modules/eslint/bin/.eslintrc.json file:

          "extends": "airbnb-base",
          "env": {
            "node": true,
            "mocha": true
          },
          "plugins": [
              "import",
              "mocha"
          ],
          "rules": {
            "no-var":0
          }
