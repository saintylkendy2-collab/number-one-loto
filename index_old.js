const express = require('express');
const app = express();

// NON POINT DE VENTE A RETE LA NÈT
const POINT_DE_VENTE = 'MAMA';

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
res.send(`
<html>
<head>
<meta charset="UTF-8">
<title>Number One Loto</title>
</head>
<body style="font-family: monospace; text-align:center;">
<h2>NUMBER ONE LOTO</h2>

<form method="POST" action="/print">
<textarea name="data" rows="10" cols="24" placeholder="Egzanp:
BOR 58 250
BOR 85 100
MAR 25*36 15"></textarea><br><br>

<button type="submit">GENERATE</button>
<button type="reset">CLEAR</button>
</form>
</body>
</html>
`);
});

app.post('/print', (req, res) => {
const lines = (req.body.data || '').split('\n');

let total = 0;
let output = '';

lines.forEach(line => {
const clean = line.trim();
if (!clean) return;

const parts = clean.split(/\s+/);

if (parts.length >= 3) {
const type = parts[0];
const num = parts[1];
const amount = parseInt(parts[2], 10);

if (!isNaN(amount)) {
total += amount;
output += type + ' ' + num + ' => ' + amount + ' G<br>';
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
<div style="width:180px; margin:auto; text-align:left; font-size:13px; 
line-height:1.4;">
<div><strong>NUMBER ONE LOTO</strong></div>
<div><strong>VANDÈ: ${POINT_DE_VENTE}</strong></div>
<br>
<div>Ticket: ${ticket}</div>
<div>Date: ${date}</div>
<br>
<div>------------------------</div>
<div>${output}</div>
<div>------------------------</div>
<div><strong>TOTAL =====> ${total} G</strong></div>
<br>
<div>Fich sa ap peye pa moun ki potel la avan 90 jou.</div>
<div>Mèsi paske chwazi Number One Loto.</div>
</div>

<br>
<button onclick="window.print(); setTimeout(() => { 
window.location.href='/' }, 500)">PRINT</button>
<button onclick="window.location.href='/'">RETOUNEN</button>
</body>
</html>
`);
});

app.listen(3000, () => {
console.log('Server ap mache sou http://localhost:3000');
});
