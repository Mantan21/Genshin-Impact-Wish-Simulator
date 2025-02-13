const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = 3001;
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// Middleware
app.use(cors({ credentials: true, origin: "http://localhost:5173" })); // Update if using Vite
app.use(express.json());
app.use(cookieParser());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "simdb",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// 🔹 SIGNUP & AUTO LOGIN
app.post("/signup", (req, res) => {
  const { ign, group } = req.body;
  const query = "INSERT INTO player (ign, `group`) VALUES (?, ?)";

  db.query(query, [ign, group], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).send("Error inserting data");
    }

    // Generate JWT token
    const token = jwt.sign({ id: result.insertId, ign }, SECRET_KEY, { expiresIn: "1h" });

    // Set secure HTTP-only cookie
    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "Strict" });
    res.json({ message: "Signup successful, auto-logged in", token });
  });
});

// 🔹 PROTECTED DASHBOARD ROUTE
app.get("/", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    res.json({ message: "Welcome to the dashboard!", user: decoded });
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
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

