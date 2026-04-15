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
*{
box-sizing:border-box;
}

body{
margin:0;
font-family:Arial, sans-serif;
background:#efeff4;
}

.topbar{
height:64px;
background:#1f4aa8;
color:#fff;
display:flex;
align-items:center;
justify-content:space-between;
padding:0 14px;
}

.topbar .left,
.topbar .right{
width:70px;
display:flex;
align-items:center;
gap:12px;
font-size:24px;
}

.topbar .title{
flex:1;
text-align:center;
font-size:24px;
font-weight:600;
}

.display{
padding:18px 16px 10px 16px;
background:#efeff4;
}

.line{
font-size:28px;
margin:14px 0;
color:#111;
}

.active{
color:red;
}

.tickets{
background:#f3f4f8;
min-height:280px;
margin:6px 16px 0 16px;
border-radius:2px;
overflow:auto;
}

.empty-zone{
height:280px;
display:flex;
align-items:center;
justify-content:center;
color:#999;
font-size:26px;
font-weight:600;
}

.ticket{
background:#fff;
border-bottom:1px solid #ddd;
padding:10px 14px;
display:flex;
justify-content:space-between;
font-size:24px;
}

.keypad{
position:fixed;
left:0;
right:0;
bottom:0;
background:#efeff4;
padding:8px 8px 12px 8px;
display:grid;
grid-template-columns:repeat(3, 1fr);
gap:8px;
}

.key{
background:#fff;
border-radius:6px;
min-height:92px;
display:flex;
align-items:center;
justify-content:center;
font-size:30px;
border:1px solid #e3e3e3;
}

.enter{
background:green;
color:#fff;
font-size:26px;
font-weight:600;
}

.menu{
position:fixed;
top:0;
left:-260px;
width:260px;
height:100%;
background:#fff;
transition:.25s;
z-index:50;
padding-top:70px;
box-shadow:2px 0 10px rgba(0,0,0,.15);
}

.menu.active{
left:0;
}

.option{
padding:16px 18px;
border-bottom:1px solid #eee;
font-size:22px;
}

.popup{
position:fixed;
left:0;
right:0;
bottom:-260px;
background:#fff;
transition:.25s;
z-index:60;
box-shadow:0 -2px 10px rgba(0,0,0,.15);
}

.popup.active{
bottom:0;
}
</style>
</head>

<body>

<div class="topbar">
<div class="left">
<span onclick="toggleMenu()">☰</span>
</div>
<div class="title">Vendeur</div>
<div class="right">
<span onclick="openPrint()">🖨️</span>
<span onclick="openOptions()">⋮</span>
</div>
</div>

<div class="display">
<div id="numeroLine" class="line active">Numero</div>
<div id="loterieLine" class="line">Loterie</div>
<div id="montantLine" class="line">Montant</div>
</div>

<div class="tickets" id="tickets">
<div class="empty-zone" id="emptyZone">Pas de jeux</div>
</div>


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
let div = document.getElementById("tickets");
div.innerHTML = "";

if(jeux.length === 0){
div.innerHTML = '<div class="empty-zone" id="emptyZone">Pas de jeux</div>';
return;
}

jeux.forEach(function(j, i){
let el = document.createElement("div");
el.className = "ticket";

el.innerHTML =
"<span>" + j.numero + "</span>" +
"<span>" + j.loterie + "</span>" +
"<span>" + j.montant + "</span>";

el.onclick = function(){
if(confirm("Supprimer ?")){
jeux.splice(i, 1);
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