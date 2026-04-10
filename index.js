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
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body {
font-family: monospace;
background: #f2f2f2;
text-align: center;
padding: 15px;
}

.ticket {
width: 320px;
margin: auto;
background: white;
border: 2px dashed black;
padding: 15px;
color: black;
}

.title {
font-size: 22px;
font-weight: bold;
margin-bottom: 10px;
}

.meta {
font-size: 14px;
margin-bottom: 10px;
}

pre {
text-align: left;
font-size: 20px;
line-height: 1.5;
white-space: pre-wrap;
margin: 0;
}

.total {
margin-top: 12px;
font-size: 20px;
font-weight: bold;
border-top: 1px dashed black;
padding-top: 10px;
}

.footer {
margin-top: 12px;
font-size: 16px;
}

button {
width: 320px;
max-width: 100%;
padding: 14px;
font-size: 18px;
margin-top: 12px;
border: none;
border-radius: 8px;
background: #1e73ff;
color: white;
}

.back-btn {
background: #666;
}
</style>
</head>
<body>
<div class="ticket">
<div class="title">NUMBER ONE LOTO</div>
<div class="meta">Dat: ${dateStr} | Lè: ${timeStr}</div>
<pre>${formattedLines.join("\n")}</pre>
<div class="total">TOTAL: ${total} G</div>
<div class="footer">Bon chans 🍀</div>
</div>

<button onclick="window.print()">PRINT</button>
<button class="back-btn" onclick="window.location.href='/'">BACK</button>
</body>
</html>
`);
});

app.listen(3000, () => {
console.log("Server ap mache sou http://localhost:3000");
});