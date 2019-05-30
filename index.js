const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();
// console.log(`...... ENV -> Database_URL:${process.env.DATABASE_URL},  USER:${process.env.DB_USER}, PASS:${process.env.DB_PASS}`)

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('-----> connected to the db \n');
});

// Root route for home page with some json info.
app.get('/', (req, res) => {
  res.json({ info: 'Node.js, Express, and Postgres API' })
})

// GET route request on the /info URL, and return all table information.
app.get('/info', (req, res) => {
  (async () => {
    const { rows } = await pool.query('SELECT * FROM macbook');
    console.log(rows);
    res.send(JSON.stringify(rows));
  })().catch(err => setImmediate(() => { throw err }));  
})

// GET route request on the /info/:id/:name URL, and return the info by custom id & name. 
app.get('/info/:id/:name', (req, res) => {
  const id = req.params.id;
  const name = req.params.name;
  (async () => {
    // console.log(id, name);
    const { rows } = await pool.query('SELECT * FROM macbook WHERE id = $1 AND name = $2', [id, name])
    console.log(`Select query return: ${JSON.stringify(rows)}`);
    res.send(JSON.stringify(rows[0]));
  })().catch(err => setImmediate(() => { throw err }));  
})

// POST route request to add a new item with price
app.post('/info', (req, res) => {
  // const name = req.body.name;
  // const price = req.body.price;
  const {name, price} = req.body;
  (async () => {
    // console.log(`name: ${name}, price: ${price}`)
    const { content } = await pool.query('INSERT INTO macbook (name, price) VALUES ($1, $2)', [name, price]);
    console.log(`Insert query return: ${JSON.stringify(content)}`)
    res.send(content)
  })().catch(err => setImmediate(() => { throw err }));  
  
})

// PUT route request to Update the user with id 
app.put('/info/:id', (req, res) =>{
  const id = parseInt(req.params.id);
  const {name, price} = req.body;
  (async ()=> {
    // console.log(`id: ${id}`)
    const {row} = await pool.query('UPDATE macbook SET name = $1, price = $2 WHERE id = $3', [name, price, id]);
    console.log(`Update query return: ${row}`)
    res.send(row)
  })().catch(err=> setImmediate(()=>{ throw err }));
})



// Now set the app to listen on the port you set.
app.listen(port, () => {
   console.log(`App running on port ${port}.`)
})