const express = require('express');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

function loadUsers() {
return JSON.parse(fs.readFileSync('vendeurs.json'));
}

// LOGIN PAGE
app.get('/', (req, res) => {
const users = loadUsers();
const user = req.cookies.user;

if (user && users[user]) {
return res.redirect('/play');
}

res.send(`
<html>
<head>
<meta charset="UTF-8">
<title>Number One Loto Login</title>
</head>
<body style="font-family: monospace; text-align:center;">
<h2>NUMBER ONE LOTO - LOGIN</h2>

<form method="POST" action="/login">
<input name="username" placeholder="Username" required><br><br>
<input type="password" name="password" placeholder="Password" required><br><br>
<button type="submit">LOGIN</button>
</form>
</body>
</html>
`);
});

// LOGIN ACTION
app.post('/login', (req, res) => {
const users = loadUsers();
const { username, password } = req.body;

if (users[username] && users[username].password === password) {
res.cookie('user', username, { maxAge: 1000 * 60 * 60 * 24 * 30 }); // 30 jou
return res.redirect('/play');
}

res.send(`
<html>
<head>
<meta charset="UTF-8">
<title>Login pa bon</title>
</head>
<body style="font-family: monospace; text-align:center;">
<h3>Login pa bon</h3>
<a href="/">Retounen</a>
</body>
</html>
`);
});

// PAGE JWE
app.get('/play', (req, res) => {
const users = loadUsers();
const user = req.cookies.user;

if (!user || !users[user]) {
return res.redirect('/');
}

res.send(`
<html>
<head>
<meta charset="UTF-8">
<title>Jwe Ticket</title>
</head>
<body style="font-family: monospace; text-align:center;">
<h3>VANDÈ: ${users[user].nom}</h3>
<h4>ID: ${user}</h4>

<form method="POST" action="/print">
<textarea name="data" rows="10" cols="24" placeholder="Egzanp:
BOR 58 250
BOR 85 100
MAR 25*36 15" required></textarea><br><br>

<button type="submit">GENERATE</button>
</form>

<br>
<form method="POST" action="/logout">
<button type="submit">LOGOUT</button>
</form>
</body>
</html>
`);
});

// PRINT
app.post('/print', (req, res) => {
const users = loadUsers();
const user = req.cookies.user;

if (!user || !users[user]) {
return res.redirect('/');
}

const vendeur = users[user].nom;
const lines = (req.body.data || '').split('\n');

let total = 0;
let output = '';

lines.forEach(line => {
const parts = line.trim().split(/\s+/);

if (parts.length >= 3) {
const type = parts[0];
const num = parts[1];
const amount = parseInt(parts[2], 10);

if (!isNaN(amount)) {
total += amount;
output += `${type} ${num} => ${amount} G<br>`;
}
}
});

const ticket = Math.floor(Math.random() * 1000000000);
const date = new Date().toLocaleString();

res.send(`
<html>
<head>
<meta charset="UTF-8">
<title>Ticket</title>
</head>
<body style="font-family: monospace; text-align:center;">
<div style="width:180px; margin:auto; text-align:left; font-size:13px; line-height:1.4;">
<strong>NUMBER ONE LOTO</strong><br>
<strong>VANDÈ: ${vendeur}</strong><br>
<strong>ID: ${user}</strong><br><br>

Ticket: ${ticket}<br>
Date: ${date}<br><br>

----------------------<br>
${output}
----------------------<br>

<strong>TOTAL =====> ${total} G</strong><br><br>

Fich sa ap peye pa moun ki potel la avan 90 jou.<br>
Mèsi paske chwazi Number One Loto.
</div><br>

<button onclick="window.print()">PRINT</button>
<button onclick="window.location.href='/play'">RETOUNEN</button>
</body>
</html>
`);
});

// LOGOUT
app.post('/logout', (req, res) => {
res.clearCookie('user');
res.redirect('/');
});

app.listen(3000, () => {
console.log('Server ap mache sou http://localhost:3000');
});
