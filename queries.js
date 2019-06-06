const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();
// console.log(`...... ENV -> Database_URL:${process.env.DATABASE_URL},  USER:${process.env.DB_USER}, PASS:${process.env.DB_PASS}`)

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Create the table if not exists.
const queryText =
`
CREATE TABLE IF NOT EXISTS
  reflections(
    id UUID PRIMARY KEY,
    success TEXT NOT NULL,
    low_point TEXT NOT NULL,
    take_away TEXT NOT NULL,
    created_date TIMESTAMP,
    modified_date TIMESTAMP
  )
`;
const createTable =  () => {
  (async () => {
    const res = await pool.query(queryText)
    console.log('Table Created.')
  })().catch(err => setImmediate(() => { throw err })); 
}
createTable();

// GET route request on the /info URL, and return all table information.
const getInfo = (req, res) => {
    (async () => {
      const { rows } = await pool.query('SELECT * FROM macbook');
      console.log('Select * query return:', rows);
      res.send(JSON.stringify(rows));
    })().catch(err => setImmediate(() => { throw err }));  
}

// GET route request on the /info/:id/:name URL, and return the price by custom id & name. 
const getInfoByID = (req, res) => {
    const id = req.params.id;
    const name = req.params.name;
    (async () => {
      const { rows } = await pool.query('SELECT * FROM macbook WHERE id = $1 AND name = $2', [id, name])
      console.log(`Select query return: ${JSON.stringify(rows)}`);
      res.send(JSON.stringify(rows[0]));
    })().catch(err => setImmediate(() => { throw err }));  
}

// POST route request to add a new item with price
// CLI TYPE: curl --data "name=Plant&price=18.99" http://localhost:3000/info
const createItem = (req, res) => {
    // const name = req.body.name;
    // const price = req.body.price;
    const {name, price} = req.body;
    (async () => {
      const { content } = await pool.query('INSERT INTO macbook (name, price) VALUES ($1, $2)', [name, price]);
      console.log(`Insert query return: ${JSON.stringify(content)}`)
      res.send(`Info added with ID`)
    })().catch(err => setImmediate(() => { throw err }));  
}

// PUT route request to Update the user with id 
// CLI TYPE: curl -X PUT -d "name=Plant" -d "price=69.99" http://localhost:3000/info/34
const updateItem = (req, res) => {
    const id = parseInt(req.params.id);
    const {name, price} = req.body;
    (async ()=> {
      const {row} = await pool.query('UPDATE macbook SET name = $1, price = $2 WHERE id = $3', [name, price, id]);
      console.log(`Update query return: ${row}`)
      res.send(`Info modified with ID: ${id}\n`)
    })().catch(err=> setImmediate(()=>{ throw err }));
}

// DELETE route request to delete a specific user by id. 
// CLI TYPE: curl -X "DELETE" http://localhost:3000/info/35
const deleteItem = (req, res) => {
    const id = parseInt(req.params.id);
    (async ()=> {
      const {row}= await pool.query('DELETE FROM macbook WHERE id = $1', [id]);
      console.log(`Delete query return: ${row}`)
      res.send(`Info deleted with ID: ${id}\n`)
    })().catch(err=> setImmediate(()=>{ throw err }));
}

module.exports = {
    createTable,
    getInfo,
    getInfoByID,
    createItem,
    updateItem,
    deleteItem
}