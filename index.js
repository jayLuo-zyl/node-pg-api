const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const db = require('./queries')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// Root route for home page with some json info.
app.get('/', (req, res) => {
  res.json({ info: 'Node.js, Express, and Postgres API' })
})

// GET route request on the /info URL, and return all table information.
app.get('/info', db.getInfo)

// GET route request on the /info/:id/:name URL, and return the price by custom id & name. 
app.get('/info/:id/:name', db.getInfoByID)

// POST route request to add a new item with price
app.post('/info', db.createItem)

// PUT route request to Update the user with id 
app.put('/info/:id', db.updateItem)

// DELETE route request to delete a specific user by id. 
app.delete('/info/:id', db.deleteItem)


// Now set the app to listen on the port you set.
app.listen(port, () => {
   console.log(`App running on port ${port}.`)
})