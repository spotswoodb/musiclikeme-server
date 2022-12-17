require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const { Client } = require('pg');

const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB;


const client = new Client({
  host: host,
  port: port,
  user: user,
  password: password,
  database: database
});

client.connect();

const router = express.Router();

app.use('/api', router);

// Read all resources
router.get('/entries', (req, res) => {
    client.query('SELECT * FROM entries', (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve entries' });
      } else {
        res.json(result.rows);
      }
    });
  });

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
