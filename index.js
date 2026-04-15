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
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>POS</title>

<style>
body{
margin:0;
font-family:Arial;
background:#f2f4f8;
}

/* TOPBAR */
.topbar{
background:#0b3c8c;
color:white;
display:flex;
justify-content:space-between;
padding:10px;
}

.icon{cursor:pointer;margin-left:10px}

/* DISPLAY */
.display{
background:white;
padding:15px;
}

.line{
font-size:22px;
margin:8px 0;
}

.active{
color:red;
}

/* LIST */
.tickets{
padding:10px;
}

.ticket{
background:white;
padding:10px;
margin-bottom:5px;
display:flex;
justify-content:space-between;
}

/* KEYPAD */
.keypad{
position:fixed;
bottom:0;
width:100%;
display:grid;
grid-template-columns:repeat(3,1fr);
gap:5px;
padding:10px;
}

.key{
background:white;
padding:20px;
text-align:center;
font-size:22px;
border-radius:5px;
}

.enter{
background:green;
color:white;
}

/* MENU */
.menu{
position:fixed;
left:-250px;
top:0;
width:250px;
height:100%;
background:white;
transition:0.3s;
padding:10px;
}

.menu.active{
left:0;
}

/* POPUP */
.popup{
position:fixed;
bottom:-100%;
width:100%;
background:white;
padding:15px;
transition:0.3s;
}

.popup.active{
bottom:0;
}

.option{
padding:15px;
border-bottom:1px solid #ddd;
}
</style>
</head>

<body>

<div class="topbar">
<div onclick="toggleMenu()">☰</div>
<div>Vendeur</div>
<div>
<span class="icon" onclick="openPrint()">🖨️</span>
<span class="icon" onclick="openOptions()">⋮</span>
</div>
</div>

<div class="display">
<div id="numeroLine" class="line active">Numero</div>
<div id="loterieLine" class="line">Loterie</div>
<div id="montantLine" class="line">Montant</div>
</div>

<div class="tickets" id="tickets"></div>

<div class="keypad">
<div class="key" onclick="press(1)">1</div>
<div class="key" onclick="press(2)">2</div>
<div class="key" onclick="press(3)">3</div>

<div class="key" onclick="press(4)">4</div>
<div class="key" onclick="press(5)">5</div>
<div class="key" onclick="press(6)">6</div>

<div class="key" onclick="press(7)">7</div>
<div class="key" onclick="press(8)">8</div>
<div class="key" onclick="press(9)">9</div>

<div class="key" onclick="back()">⌫</div>
<div class="key" onclick="press(0)">0</div>
<div class="key enter" onclick="enter()">ENTER</div>
</div>

<div id="menu" class="menu">
<div class="option">Tirages</div>
<div class="option">Balance</div>
<div class="option">Paramètres</div>
<div class="option">Imprimante</div>
<div class="option">Rapports</div>
<div class="option">Copier</div>
</div>

<div id="options" class="popup">
<div class="option" onclick="deleteAll()">Supprimer tout</div>
<div class="option">Traiter le jeu</div>
<div class="option">Processus: Local</div>
</div>

<script>
let active="numero";
let numero="";
let loterie="Florida";
let montant="";
let jeux=[];

function update(){
document.getElementById("numeroLine").textContent=numero||"Numero";
document.getElementById("loterieLine").textContent=loterie||"Loterie";
document.getElementById("montantLine").textContent=montant||"Montant";

document.getElementById("numeroLine").classList.remove("active");
document.getElementById("loterieLine").classList.remove("active");
document.getElementById("montantLine").classList.remove("active");

document.getElementById(active+"Line").classList.add("active");
}

function press(n){
if(active==="numero"){numero+=n}
if(active==="montant"){montant+=n}
update();
}

function back(){
if(active==="numero"){numero=numero.slice(0,-1)}
if(active==="montant"){montant=montant.slice(0,-1)}
update();
}

function enter(){
if(active==="numero"){
if(!numero)return;
active="montant";
update();
return;
}

if(active==="montant"){
if(!numero||!montant)return;

jeux.push({numero,loterie,montant});
render();

numero="";
active="numero";
update();
return;
}
}

function render(){
let div=document.getElementById("tickets");
div.innerHTML="";

jeux.forEach((j,i)=>{
let el=document.createElement("div");
el.className="ticket";
el.innerHTML=j.numero+" - "+j.montant;

el.onclick=()=>{
if(confirm("Supprimer ?")){
jeux.splice(i,1);
render();
}
};

div.appendChild(el);
});
}

function toggleMenu(){
document.getElementById("menu").classList.toggle("active");
}

function openOptions(){
document.getElementById("options").classList.toggle("active");
}

function deleteAll(){
jeux=[];
render();
}

function openPrint(){
window.print();
}

update();
</script>

</body>
</html>
`);
});
app.listen(3000, "0.0.0.0", () => {
console.log("Server ap mache sou rezo a");
});