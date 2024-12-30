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

// Middleware to Verify JWT Token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer Token
  if (!token) return res.status(401).json({ error: 'Access denied, no token provided.' });

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified; // Add user info from token to req object
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Password Validation Function
const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
};

// Signup Endpoint
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  // Validate password strength
  if (!isStrongPassword(password)) {
    return res.status(400).json({
      error:
        'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.',
    });
  }

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

// Login Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.rows[0].id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit Profile Endpoint (Bio and Profile Picture)
app.post('/profile/edit', verifyToken, upload.single('profilePicture'), async (req, res) => {
  const { bio } = req.body;
  const profilePicture = req.file?.path; // Uploaded image path
  const userId = req.user.id;

  try {
    await pool.query(
      'UPDATE users SET bio = $1, profile_picture = $2 WHERE id = $3',
      [bio, profilePicture, userId]
    );
    res.json({ message: 'Profile updated successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// Follow a User
app.post('/users/:id/follow', verifyToken, async (req, res) => {
  const { id } = req.params; // User ID to follow
  const userId = req.user.id; // Logged-in user ID

  if (id == userId) {
    return res.status(400).json({ error: 'You cannot follow yourself.' });
  }

  try {
    await pool.query('INSERT INTO follows (follower_id, followee_id) VALUES ($1, $2)', [userId, id]);
    res.json({ message: 'Followed successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to follow user.' });
  }
});

// Unfollow a User
app.delete('/users/:id/unfollow', verifyToken, async (req, res) => {
  const { id } = req.params; // User ID to unfollow
  const userId = req.user.id; // Logged-in user ID

  try {
    await pool.query('DELETE FROM follows WHERE follower_id = $1 AND followee_id = $2', [userId, id]);
    res.json({ message: 'Unfollowed successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unfollow user.' });
  }
});

// List All Users
app.get('/users', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, bio, profile_picture FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
