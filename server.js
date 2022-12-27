require('dotenv').config();
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

app.use(cors({ origin: ['http://localhost:3000'] }));

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
app.use( 
  session({ 
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false 
  }) 
);

app.use(passport.initialize()); 
app.use(passport.session());

// passport.use( new SpotifyStrategy({ 
//   clientID: process.env.SPOTIFY_CLIENT_ID, 
//   clientSecret: process.env.SPOTIFY_CLIENT_SECRET, 
//   callbackURL: 'http://localhost:4000/auth/spotify/callback' }, 
//   (accessToken, refreshToken, expires_in, profile, done) => { 
//     code to handle successful authentication goes here } ) );

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

router.post('/entries', (req, res) => {
    const data = req.body;
    const sql = 'INSERT INTO entries (title, body, createdby) VALUES ($1, $2, $3)';
    const values = [data.title, data.body, data.createdby];
    client.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to insert entry' });
        } else {
            res.send({ success: true });
        }
    });
});
  

app.listen(4000, () => {
  console.log('Server listening on port 4000');
});
