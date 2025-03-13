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
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "simdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


// Test Database Connection
(async () => {
  try {
    const connection = await db.promise().getConnection(); // Use .promise() for async/await
    console.log("Connected to MySQL database");
    connection.release(); // Properly release the connection
  } catch (err) {
    console.error("Error connecting to MySQL:", err);
    process.exit(1);
  }
})();

app.post("/api/signup", async (req, res) => {
  const { ign, group } = req.body;

  // Validate input
  if (!ign || !group || typeof ign !== "string" || typeof group !== "string") {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const query = "INSERT INTO player (ign, `group`) VALUES (?, ?)";
    const [result] = await db.promise().execute(query, [ign, group]);

    const token = jwt.sign({ id: result.insertId, ign, group }, SECRET_KEY, {
      expiresIn: "3h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "strict",
      maxAge: 3 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "Signup successful", id: result.insertId });
  } catch (err) {
    console.error("Error signing up:", err);
    res.status(500).json({ error: "Signup failed", details: err.message });
  }
});

app.post("/api/logout", async (req, res) => {
  //Retrieve token
  const token = req.cookies.token;
  if(!token){
    return res.status(401).json({error: "No session found"});
  }
  const decoded = jwt.verify(token, SECRET_KEY);
  const { id } = decoded;
  const banner_data = JSON.parse(req.body.banner_data);

  try {
    const query = "UPDATE player SET banner_data =  ? WHERE id = ?";
    await db.promise().execute(query, [JSON.stringify(banner_data), id]);
    
    res.cookie("token", "", { expires: new Date(0) }); // Expire cookie
    res.json({ message: "Logged out successfully" });
    
  } catch (err) {
    console.error("Error signing up:", err);
    res.status(500).json({ error: "Signup failed", details: err.message });
  }
});


// Session Route
app.get("/api/session", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("No session found");
    return res.status(401).json({ error: "No session found" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log("Invalid session:", err.message);
      return res.status(403).json({ error: "Invalid session" });
    }

    console.log("Session Active:", user); // Log the active session details
    res.json(user);
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});