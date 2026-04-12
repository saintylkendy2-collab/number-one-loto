const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
res.send(`
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Login Vendeur</title>

<style>
body {
margin: 0;
font-family: Arial, sans-serif;
background: #f2f2f2;
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
}

.container {
width: 90%;
max-width: 380px;
background: white;
padding: 25px;
border-radius: 12px;
box-shadow: 0 4px 10px rgba(0,0,0,0.1);
text-align: center;
}

h1 {
margin-bottom: 25px;
font-size: 24px;
}

input {
width: 100%;
padding: 15px;
margin-bottom: 15px;
font-size: 18px;
border-radius: 8px;
border: 1px solid #ccc;
}

button {
width: 100%;
padding: 16px;
font-size: 20px;
border: none;
border-radius: 8px;
background: #1e73ff;
color: white;
}

button:active {
background: #155cd1;
}

.error {
color: red;
margin-bottom: 10px;
}
</style>
</head>

<body>

<div class="container">
<h1>Connexion Vendeur</h1>

<form method="POST" action="/login">
<input type="text" name="id" placeholder="ID vendeur" required>
<input type="password" name="password" placeholder="Mot de passe" required>

<button type="submit">CONNEXION</button>
</form>
</div>

</body>
</html>
`);
});
app.post("/login", (req, res) => {
const id = req.body.id;
const password = req.body.password;

if (id === "NOC100" && password === "1234") {
res.redirect("/dashboard");
} else {
res.send("Identifiant ou mot de passe incorrect ❌");
}
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
font-size: 12px;
margin: 0;
padding: 4px;
width: 58mm;
}

pre {
margin: 0;
white-space: pre-wrap;
word-break: break-word;
}

button {
display: none;
}
</style>
</head>
<body>
<pre>
NUMBER ONE LOTO
Dat: ${dateStr} Le: ${timeStr}

${formattedLines.join("\n")}

----------------------
TOTAL: ${total} G

Bon chans
</pre>
</body>
</html>
`);
});
app.get("/dashboard", (req, res) => {
res.send(`
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Vendeur</title>
<style>
* {
box-sizing: border-box;
}

body {
margin: 0;
font-family: Arial, sans-serif;
background: #efeff4;
}

.topbar {
height: 64px;
background: #2f55e7;
color: white;
display: flex;
align-items: center;
justify-content: space-between;
padding: 0 16px;
font-size: 18px;
font-weight: 600;
}

.topbar .left,
.topbar .right {
width: 40px;
text-align: center;
font-size: 26px;
}

.topbar .title {
flex: 1;
text-align: left;
padding-left: 10px;
}

.content {
height: calc(100vh - 64px);
display: flex;
flex-direction: column;
}

.empty-zone {
flex: 1;
min-height: 320px;
display: flex;
align-items: center;
justify-content: center;
color: #9b9b9b;
font-size: 22px;
font-weight: 600;
}

.summary-bar {
height: 38px;
background: #dfe1fa;
display: grid;
grid-template-columns: 1fr 1fr 1fr;
align-items: center;
font-size: 22px;
font-weight: 700;
color: #222;
}

.summary-bar div:nth-child(1) {
text-align: left;
}

.summary-bar div:nth-child(2) {
text-align: center;
}

.summary-bar div:nth-child(3) {
text-align: right;
padding-right: 14px;
}
.display-bar {
background: #f2f2f2;
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-rows: 28px 44px;
border-bottom: 1px solid #d9d9d9;
}

.display-loterie {
grid-column: 1 / 4;
grid-row: 1;
padding: 6px 10px;
font-size: 14px;
}

.display-numero {
grid-column: 1;
grid-row: 2;
font-size: 26px;
font-weight: bold;
padding-left: 10px;
}

.display-montant {
grid-column: 3;
grid-row: 2;
text-align: right;
padding-right: 10px;
}




.tabs {
height: 52px;
background: #f3f3f3;
display: grid;
grid-template-columns: 1fr 1fr 1fr;
align-items: end;
text-align: center;
font-size: 18px;
color: #777;
border-top: 1px solid #ddd;
border-bottom: 1px solid #ddd;
}

.tab {
padding-bottom: 10px;
border-bottom: 3px solid transparent;
}

.tab.active {
color: #222;
border-bottom: 3px solid #3f5be8;
}

.keypad {
background: white;
display: grid;
grid-template-columns: repeat(4, 1fr);
grid-template-rows: repeat(4, 68px);
border-top: 1px solid #cfcfcf;
}

.key {
border: 1px solid #cfcfcf;
display: flex;
align-items: center;
justify-content: center;
font-size: 28px;
background: linear-gradient(#f7f7f7, #e7e7e7);
}

.key.ok {
background: linear-gradient(#dfe8ef, #c8d2dc);
}

.bottom-nav {
height: 74px;
background: #f5f5f8;
border-top: 1px solid #d7d7d7;
display: grid;
grid-template-columns: repeat(5, 1fr);
align-items: center;
text-align: center;
font-size: 14px;
color: #9a9a9a;
}

.bottom-item {
display: flex;
flex-direction: column;
align-items: center;
gap: 4px;
}

.bottom-item .icon {
font-size: 22px;
}

.bottom-item.active {
color: #7d73e6;
font-weight: 600;
}
</style>
</head>
<body>
<div class="topbar">
<div class="left">☰</div>
<div class="title">Vendeur</div>
<div class="right">⋮</div>
</div>

<div class="content">
<div class="empty-zone">Pas de jeux</div>

<div class="summary-bar">
<div></div>
<div id="ticketCount">0</div>
<div id="ticketTotal">0.00</div>
</div>

<div class="display-bar">
<div id="loterieDisplay" class="display-loterie"></div>
<div id="numeroDisplay" class="display-numero"></div>
<div class="display-middle"></div>
<div id="montantDisplay" class="display-montant"></div>
</div>

<div class="tabs">
<div class="tab active" id="tabNumero" onclick="setField('numero')">Numero</div>
<div class="tab" id="tabLoterie" onclick="setField('loterie')">Loterie</div>
<div class="tab" id="tabMontant" onclick="setField('montant')">Montant</div>
</div>
<div class="keypad">

<div class="key" onclick="pressKey('+')">+</div>
<div class="key" onclick="pressKey('1')">1</div>
<div class="key" onclick="pressKey('2')">2</div>
<div class="key" onclick="pressKey('3')">3</div>

<div class="key" onclick="pressKey('-')">-</div>
<div class="key" onclick="pressKey('4')">4</div>
<div class="key" onclick="pressKey('5')">5</div>
<div class="key" onclick="pressKey('6')">6</div>

<div class="key" onclick="pressKey('/')">/</div>
<div class="key" onclick="pressKey('7')">7</div>
<div class="key" onclick="pressKey('8')">8</div>
<div class="key" onclick="pressKey('9')">9</div>

<div class="key" onclick="pressKey('.')">.</div>
<div class="key" onclick="backspace()">⌫</div>
<div class="key" onclick="pressKey('0')">0</div>
<div class="key" onclick="validate()">✅</div>

</div>


<div class="bottom-nav">
<div class="bottom-item active">
<div class="icon">🎟️</div>
<div>Billets</div>
</div>
<div class="bottom-item">
<div class="icon">📄</div>
<div>Copier</div>
</div>
<div class="bottom-item">
<div class="icon">💵</div>
<div>Payer</div>
</div>
<div class="bottom-item">
<div class="icon">🖨️</div>
<div>Rapports</div>
</div>
<div class="bottom-item">
<div class="icon">☷</div>
<div>Menu</div>
</div>
</div>
</div>
<script>

let activeField = "numero";

let numero = "";
let loterie = "";
let montant = "";

function setField(field) {
activeField = field;

document.getElementById("tabNumero").classList.remove("active");
document.getElementById("tabLoterie").classList.remove("active");
document.getElementById("tabMontant").classList.remove("active");

if (field === "numero") {
document.getElementById("tabNumero").classList.add("active");
} else if (field === "loterie") {
document.getElementById("tabLoterie").classList.add("active");
} else if (field === "montant") {
document.getElementById("tabMontant").classList.add("active");
}
}

function pressKey(val) {
if (activeField === "numero") {
numero += val;
document.getElementById("numeroDisplay").textContent = numero;
} else if (activeField === "loterie") {
loterie += val;
document.getElementById("loterieDisplay").textContent = loterie;
} else if (activeField === "montant") {
montant += val;
document.getElementById("montantDisplay").textContent = montant;
}
}

function backspace() {
if (activeField === "numero") {
numero = numero.slice(0, -1);
document.getElementById("numeroDisplay").textContent = numero;
} else if (activeField === "loterie") {
loterie = loterie.slice(0, -1);
document.getElementById("loterieDisplay").textContent = loterie;
} else if (activeField === "montant") {
montant = montant.slice(0, -1);
document.getElementById("montantDisplay").textContent = montant;
}
}

function validate() {
if (activeField === "numero") {
setField("loterie");
} else if (activeField === "loterie") {
setField("montant");
} else if (activeField === "montant") {
alert("Ajouté: " + numero + " / " + loterie + " / " + montant);

numero = "";
loterie = "";
montant = "";

document.getElementById("numeroDisplay").textContent = "";
document.getElementById("loterieDisplay").textContent = "";
document.getElementById("montantDisplay").textContent = "";

setField("numero");
}
}

setField("numero");
</script>
</body>
</html>
`);
});
app.listen(3000, () => {
console.log("Server ap mache sou http://localhost:3000");
});