const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

// Environment Config
dotenv.config();
const { DATABASE_URL, SECRET_KEY } = process.env;

// App Initialization
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database Connection
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// File Upload Configuration
const upload = multer({ dest: 'uploads/' });

// User Signup
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Username already exists.' });
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0) return res.status(400).json({ error: 'Invalid username or password' });

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid username or password' });

    const token = jwt.sign({ id: user.rows[0].id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit Profile (Add Bio and Profile Picture)
app.post('/profile/edit', upload.single('profilePicture'), async (req, res) => {
  const { bio } = req.body;
  const profilePicture = req.file?.path;
  const userId = req.user.id; // Assuming JWT middleware handles req.user
  try {
    await pool.query('UPDATE users SET bio = $1, profile_picture = $2 WHERE id = $3', [bio, profilePicture, userId]);
    res.json({ message: 'Profile updated successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Follow a User
app.post('/users/:id/follow', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Assuming JWT middleware handles req.user
  try {
    await pool.query('INSERT INTO follows (follower_id, followee_id) VALUES ($1, $2)', [userId, id]);
    res.json({ message: 'Followed successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

// Start Server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
