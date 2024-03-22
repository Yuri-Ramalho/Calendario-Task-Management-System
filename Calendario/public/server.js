const express = require('express');
const path = require('path');
const Parse = require('parse/node');
//const cors = require('cors');

const app = express();
const PORT = 4000;
//app.use(cors());

Parse.initialize('yArd5jI5uzEul4ob6EsljpN9okK0pzy4ttt994Ky', '7hmaVfjipCJYzGFijg6SqXxpgepy4KfBjmzWkX09');
Parse.serverURL = 'https://parseapi.back4app.com/';

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'calendar.html'));
});

app.get('/login-page.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login-page.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
