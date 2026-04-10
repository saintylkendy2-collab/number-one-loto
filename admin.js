const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.urlencoded({ extended: true }));

const USERS_FILE = 'vendeurs.json';

function loadUsers() {
try {
if (!fs.existsSync(USERS_FILE)) {
fs.writeFileSync(USERS_FILE, JSON.stringify({}, null, 2));
}
const raw = fs.readFileSync(USERS_FILE, 'utf8');
return JSON.parse(raw || '{}');
} catch (error) {
return {};
}
}

function saveUsers(users) {
fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.get('/', (req, res) => {
const users = loadUsers();
const editId = req.query.edit || '';
const editUser = editId && users[editId] ? users[editId] : null;

let rows = '';
const ids = Object.keys(users).sort();

ids.forEach(id => {
const u = users[id];
rows += `
<tr>
<td>${id}</td>
<td>${u.nom || ''}</td>
<td>${u.groupe || ''}</td>
<td>${u.password || ''}</td>
<td>
<a href="/?edit=${id}">Modifye</a>
<form method="POST" action="/delete" style="display:inline;">
<input type="hidden" name="id" value="${id}">
<button type="submit">Efase</button>
</form>
</td>
</tr>
`;
});

res.send(`
<html>
<head>
<meta charset="UTF-8">
<title>MASTER PANEL</title>
</head>
<body style="font-family: monospace;">
<h2>MASTER PANEL - VANDÈ YO</h2>

<form method="POST" action="/save">
<input type="hidden" name="oldId" value="${editId}">

<label>ID / Username</label><br>
<input name="id" value="${editId}" placeholder="NOC100" required><br><br>

<label>Non vandè</label><br>
<input name="nom" value="${editUser ? editUser.nom : ''}" placeholder="Non vandè" required><br><br>

<label>Gwoup</label><br>
<input name="groupe" value="${editUser ? (editUser.groupe || '') : ''}" placeholder="Gwoup"><br><br>

<label>Password</label><br>
<input name="password" value="${editUser ? editUser.password : '1234'}" placeholder="1234" required><br><br>

<button type="submit">${editUser ? 'MODIFYE VANDE' : 'AJOUTE VANDE'}</button>
</form>

<br><hr><br>

<table border="1" cellpadding="8" cellspacing="0">
<tr>
<th>ID</th>
<th>NON</th>
<th>GWOUP</th>
<th>PASSWORD</th>
<th>AKSYON</th>
</tr>
${rows}
</table>
</body>
</html>
`);
});

app.post('/save', (req, res) => {
const users = loadUsers();

const oldId = (req.body.oldId || '').trim();
const newId = (req.body.id || '').trim().toUpperCase();
const nom = (req.body.nom || '').trim();
const groupe = (req.body.groupe || '').trim();
const password = (req.body.password || '').trim();

if (!newId || !nom || !password) {
return res.send('Gen chan ki vid');
}

if (oldId && oldId !== newId) {
delete users[oldId];
}

users[newId] = {
nom,
groupe,
password
};

saveUsers(users);
res.redirect('/');
});

app.post('/delete', (req, res) => {
const users = loadUsers();
const id = (req.body.id || '').trim();

if (users[id]) {
delete users[id];
saveUsers(users);
}

res.redirect('/');
});

app.listen(4000, () => {
console.log('Master panel ap mache sou http://localhost:4000');
});
