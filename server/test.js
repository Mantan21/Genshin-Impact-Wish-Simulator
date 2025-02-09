const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: '1234', // Replace with your MySQL password
  database: 'simdb', // Replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Route for Signup
app.post('/', (req,res) => {
  const { ign, group } = req.body;
  const query = 'INSERT INTO player (ign,`group`) VALUES (?,?)';
  db.query (query, [ign, group], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error inserting data');
      return;
    }
    res.json({ message: 'Data inserted successfully' });
  })
});

// Example API: Fetch data from MySQL
// app.get('/', (req, res) => {
//   const query = 'SELECT * FROM player'; // Replace with your table name
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching data:', err);
//       res.status(500).send('Error fetching data');
//       return;
//     }
//     res.json(results);
//   });
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});