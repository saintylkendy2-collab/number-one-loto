const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
res.send(`
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body {
font-size: 22px;
padding: 20px;
text-align: center;
}

input, button, textarea {
width: 100%;
padding: 16px;
font-size: 20px;
margin-top: 10px;
}
</style>
</head>
<body>
<h2>NUMBER ONE LOTO</h2>

<form method="POST" action="/print">
<textarea name="data" rows="10" placeholder="Egzanp:
BOR 58 250
BOR 85 100
MAR 25*36 15"></textarea>
<button type="submit">GENERATE</button>
</form>
</body>
</html>
`);
});

app.post("/print", (req, res) => {
const raw = req.body.data || "";

const lines = raw
.split("\n")
.map(line => line.trim())
.filter(line => line.length > 0);

let total = 0;

const formattedLines = lines.map(line => {
const parts = line.split(/\s+/);

if (parts.length >= 3) {
const type = parts[0].toUpperCase();
const number = parts[1];
const amount = parseInt(parts[2], 10) || 0;
total += amount;
return `${type.padEnd(4, " ")} ${number.padEnd(8, " ")} ${amount} G`;
}

if (parts.length === 2) {
const number = parts[0];
const amount = parseInt(parts[1], 10) || 0;
total += amount;
return `BOR ${number.padEnd(8, " ")} ${amount} G`;
}

return line;
});

const now = new Date();
const dateStr = now.toLocaleDateString("fr-FR");
const timeStr = now.toLocaleTimeString("fr-FR", {
hour: "2-digit",
minute: "2-digit"
});

res.send(`
<html>
<head>
<meta charset="UTF-8">
<style>
body {
font-family: monospace;
width: 58mm;
margin: 0;
padding: 5px;
font-size: 12px;
}

.title {
text-align: center;
font-weight: bold;
font-size: 14px;
}

.meta {
text-align: center;
font-size: 10px;
margin-bottom: 5px;
}

.line {
display: flex;
justify-content: space-between;
}

.total {
border-top: 1px dashed black;
margin-top: 5px;
padding-top: 5px;
text-align: center;
font-weight: bold;
}
</style>
</head>

<body>

<div class="title">NUMBER ONE LOTO</div>
<div class="meta">${dateStr} ${timeStr}</div>

${formattedLines.map(l => {
const p = l.split(" ");
return `<div class="line">
<span>${p[0]} ${p[1]}</span>
<span>${p[2]} ${p[3]}</span>
</div>`;
}).join("")}

<div class="total">TOTAL: ${total} G</div>

<div style="text-align:center;">Bon chans 🍀</div>

</body>
</html>
`);
});

app.listen(3000, () => {
console.log("Server ap mache sou http://localhost:3000");
});