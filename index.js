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
padding-bottom: 0;
}

.selected-loteries-line {
color: #000 !important;
font-weight: 700 !important;
font-size: 19px !important;
}

.selected-loteries-line div,
.selected-loteries-line span {
color: #000 !important;
font-weight: 700 !important;
font-size: 19px !important;
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
grid-template-rows: 0px 42px;
border-bottom: 1px solid #d9d9d9;
}

.display-loterie {
display: none;
}

.display-numero {
grid-column: 1;
grid-row: 2;
align-self: center;
padding-left: 10px;
color: #000;
}

#numeroLabel {
font-size: 24px;
font-weight: bold;
}

.display-middle {
grid-column: 2;
grid-row: 2;
}

.display-montant {
grid-column: 3;
grid-row: 2;
align-self: center;
text-align: right;
padding-right: 10px;
color: #111;
}

#montantLabel {
font-size: 24px;
font-weight: bold;
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
/* MODAL BACKGROUND */
.loterie-modal {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0,0,0,0.5);
display: none;
justify-content: center;
align-items: center;
z-index: 999;
}

/* BOX */
.loterie-box {
background: white;
width: 90%;
max-height: 80%;
border-radius: 12px;
overflow: hidden;
display: flex;
flex-direction: column;
}

/* LIST */
.loterie-list {
overflow-y: auto;
flex: 1;
}

/* ITEM */
.loterie-item {
display: flex;
align-items: center;
justify-content: space-between;
padding: 12px 15px;
border-bottom: 1px solid #eee;
font-size: 16px;
}

/* SELECTED */
.loterie-item.active {
background: #f2f1ff;
color: #7d73e6;
font-weight: 600;
}

/* CHECK ICON */
.loterie-item .check {
color: #7d73e6;
font-size: 18px;
}

/* ACTION BUTTONS */
.loterie-actions {
display: flex;
justify-content: space-around;
padding: 10px;
border-top: 1px solid #eee;
}

/* BUTTON BASE */
.action-btn {
border: none;
border-radius: 50%;
width: 45px;
height: 45px;
font-size: 18px;
}

/* COLORS */
.cancel-btn {
background: #ccc;
}

.confirm-btn {
background: #7d73e6;
color: white;
}

.close-btn {
background: #e53935;
color: white;
}
.loterie-item {
padding: 15px;
font-size: 18px;
border-bottom: 1px solid #eee;
display: flex;
justify-content: space-between;
align-items: center;
}

.loterie-item.active {
background: #e6e6ff;
font-weight: bold;
color: #4a4aff;
}

.checkmark {
font-size: 18px;
color: #4a4aff;
}
.loterie-list {
max-height: 300px;
overflow-y: auto;
}
.selected-loteries-line {
min-height: 38px;
padding: 6px 10px;
box-sizing: border-box;
font-size: 15px;
line-height: 1.2;
color: #222;
background: #f0f0f0;
word-break: break-word;
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
</div></div>
<div id="ticketCount">0</div>
<div id="ticketTotal">0.00</div>
</div>
</div>

<div id="selectedLoteriesLine" class="selected-loteries-line"></div>
<div class="tabs">
<div class="tab active" id="tabNumero" onclick="setField('numero')">
<span id="numeroLabel">Numero</span>
</div>
<div class="tab" id="tabLoterie" onclick="setField('loterie')">
<span id="loterieLabel">Loterie</span>
</div>
<div class="tab" id="tabMontant" onclick="setField('montant')">
<span id="montantLabel">Montant</span>
</div>
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
openLoterieModal();

} else if (field === "montant") {
document.getElementById("tabMontant").classList.add("active");
}
}



function confirmLoterie() {
if (selectedLoteries.length === 0) return;

loterie = selectedLoteries.join(", ");
document.getElementById("selectedLoteriesLine").textContent = loterie;

document.getElementById("loterieModal").style.display = "none";
setField("montant");
}





function pressKey(val) {
if (activeField === "numero") {
numero += val;
document.getElementById("numeroLabel").textContent = numero || "Numero";
} else if (activeField === "loterie") {
return;
} else if (activeField === "montant") {
montant += val;
document.getElementById("montantLabel").textContent = montant || "Montant";
}
}

function backspace() {
if (activeField === "numero") {
numero = numero.slice(0, -1);
document.getElementById("numeroLabel").textContent = numero || "Numero";

} else if (activeField === "loterie") {
return;

} else if (activeField === "montant") {
montant = montant.slice(0, -1);
document.getElementById("montantLabel").textContent = montant || "Montant";
}
}

function validate() {
if (activeField === "numero") {
if (!loterie || loterie.trim() === "") {
activeField = "loterie";
setField("loterie");
} else {
activeField = "montant";
setField("montant");
}
numero = "";
loterie = "";
montant = "";

document.getElementById("numeroLabel").textContent = "Numero";
document.querySelector(".empty-zone").textContent = loterie || "Pas de jeux";
document.getElementById("montantLabel").textContent = "Montant";

setField("numero");
}
}
const loterieOptions = [
{ name: "TENNESSE MORNING", time: "10:00 AM" },
{ name: "TEXAS MORNING", time: "11:00 AM" },
{ name: "TEXAS EVENING", time: "6:00 PM" },
{ name: "GEORGIA MIDDAY", time: "12:30 PM" },
{ name: "FLORIDA MIDDAY", time: "1:00 PM" },
{ name: "NEW YORK MIDDAY", time: "2:30 PM" },
{ name: "GEORGIA EVENING", time: "6:50 PM" },
{ name: "TENNESSE EVENING", time: "7:00 PM" },
{ name: "FLORIDA EVENING", time: "9:30 PM" },
{ name: "NEW YORK EVENING", time: "10:25 PM" },
{ name: "GEORGIA NIGHT", time: "11:15 PM" }
];

let selectedLoteries = [];


function renderLoterieList() {
const list = document.getElementById("loterieList");
list.innerHTML = "";

loterieOptions.forEach(item => {
const div = document.createElement("div");
div.className = "loterie-item";

if (selectedLoteries.includes(item.name)) {
div.classList.add("active");
}

const span1 = document.createElement("span");
span1.textContent = item.name;

const spanTime = document.createElement("span");
spanTime.textContent = item.time;
spanTime.style.fontSize = "14px";
spanTime.style.color = "gray";

const check = document.createElement("span");
if (selectedLoteries.includes(item.name)) {
check.textContent = "✔";
check.className = "checkmark";
} else {
check.textContent = "";
}

const rightBox = document.createElement("div");
rightBox.style.display = "flex";
rightBox.style.alignItems = "center";
rightBox.style.gap = "10px";
rightBox.appendChild(spanTime);
rightBox.appendChild(check);

div.appendChild(span1);
div.appendChild(rightBox);

div.onclick = () => {
if (selectedLoteries.includes(item.name)) {
selectedLoteries = selectedLoteries.filter(l => l !== item.name);
} else {
selectedLoteries.push(item.name);
}
renderLoterieList();
};

list.appendChild(div);
});
}





function openLoterieModal() {
renderLoterieList();
document.getElementById("loterieModal").style.display = "flex";
}

function closeLoterieModal() {
document.getElementById("loterieModal").style.display = "none";
activeField = "numero";
setField("numero");
}



</script>
<div id="loterieModal" class="loterie-modal">
<div class="loterie-box">
<div class="loterie-list" id="loterieList"></div>

<div class="loterie-actions">
<button class="action-btn cancel-btn" onclick="cancelLoterie()">🚫</button>
<button class="action-btn confirm-btn" onclick="confirmLoterie()">✅</button>
<button class="action-btn close-btn" onclick="closeLoterieModal()">✖️</button>
</div>
</div>
</div>
</body>
</html>
`);
});
app.listen(3000, () => {
console.log("Server ap mache sou http://localhost:3000");
});