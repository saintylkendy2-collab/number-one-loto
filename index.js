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
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Vendeur</title>

<style>
*{
box-sizing:border-box;
}

html, body{
margin:0;
padding:0;
width:100%;
height:100%;
font-family:Arial, sans-serif;
background:#efeff4;
overflow:hidden;
}

body{
display:flex;
flex-direction:column;
}

/* TOPBAR */
.topbar{
height:60px;
min-height:60px;
background:#2f4ea2;
color:#fff;
display:flex;
align-items:center;
justify-content:space-between;
padding:0 16px;
font-size:20px;
}

.topbar .title{
flex:1;
text-align:center;
font-size:24px;
font-weight:600;
}

.topbar .side{
width:60px;
display:flex;
align-items:center;
justify-content:center;
}

/* MAIN */
.main{
flex:1;
display:flex;
flex-direction:column;
min-height:0;
}

/* TICKETS ZONE */
.tickets{
flex:1;
min-height:120px;
background:#efeff4;
overflow:auto;
display:flex;
flex-direction:column;
}

.empty-zone{
flex:1;
display:flex;
align-items:center;
justify-content:center;
color:#aaa;
font-size:22px;
}

.ticket{
display:grid;
grid-template-columns:1fr 1.4fr .8fr;
gap:8px;
align-items:center;
background:#fff;
border-bottom:1px solid #ddd;
padding:8px 12px;
font-size:22px;
font-weight:600;
}

/* SUMMARY */
.summary{
height:42px;
min-height:42px;
background:#dfe3ff;
display:flex;
align-items:center;
justify-content:space-between;
padding:0 16px;
font-size:18px;
font-weight:700;
}

/* FIELDS */
.fields{
height:56px;
min-height:56px;
display:grid;
grid-template-columns:1fr 1fr 1fr;
background:#f7f7f7;
border-top:1px solid #ccc;
}

.field{
display:flex;
align-items:flex-end;
justify-content:center;
padding:0 6px 10px 6px;
font-size:18px;
color:#888;
border-bottom:3px solid #6b78ff;
cursor:pointer;
user-select:none;
overflow:hidden;
white-space:nowrap;
text-overflow:ellipsis;
}

.field.active{
color:#111;
font-weight:700;
}

/* KEYPAD */
.keypad{
display:grid;
grid-template-columns:repeat(4, 1fr);
grid-template-rows:repeat(4, minmax(64px, 11vh));
background:#ddd;
border-top:1px solid #cfcfcf;
}

.key{
background:#f7f7f7;
border:1px solid #c8c8c8;
display:flex;
align-items:center;
justify-content:center;
font-size:clamp(22px, 3vw, 34px);
color:#000;
}

.enter{
background:#2e7d1a;
color:#fff;
font-size:clamp(18px, 2.4vw, 28px);
font-weight:700;
}

/* BOTTOM NAV */
.nav{
height:58px;
min-height:58px;
background:#f3f1ff;
border-top:1px solid #d3d3d3;
display:grid;
grid-template-columns:repeat(5, 1fr);
align-items:center;
text-align:center;
font-size:14px;
}

.nav .active{
color:#7c6cf2;
font-weight:700;
}

/* LOTERIE MODAL */
.loterie-modal{
position:fixed;
inset:0;
background:rgba(0,0,0,.35);
display:none;
align-items:center;
justify-content:center;
z-index:1000;
}

.loterie-box{
width:min(420px, 92vw);
max-height:70vh;
overflow:auto;
background:#fff;
border-radius:10px;
padding:12px;
}

.loterie-item{
padding:14px 12px;
border-bottom:1px solid #eee;
font-size:18px;
}

.loterie-actions{
display:flex;
justify-content:flex-end;
gap:10px;
padding-top:10px;
}

.action-btn{
padding:10px 14px;
border:none;
border-radius:8px;
font-size:16px;
}

/* MENU */
.menu{
position:fixed;
top:0;
left:-260px;
width:260px;
height:100%;
background:#fff;
transition:.25s;
z-index:1100;
padding-top:70px;
box-shadow:2px 0 10px rgba(0,0,0,.15);
}

.menu.active{
left:0;
}

.option{
padding:16px 18px;
border-bottom:1px solid #eee;
font-size:20px;
}

.popup{
position:fixed;
left:0;
right:0;
bottom:-260px;
background:#fff;
transition:.25s;
z-index:1200;
box-shadow:0 -2px 10px rgba(0,0,0,.15);
}

.popup.active{
bottom:0;
}

/* LAPTOP / LARGE SCREEN */
@media (min-width: 900px){
body{
max-width:500px;
margin:0 auto;
border-left:1px solid #ddd;
border-right:1px solid #ddd;
background:#efeff4;
}

.keypad{
grid-template-rows:repeat(4, 90px);
}
}
</style>
</head>

<body>

<div class="topbar">
<div class="side" onclick="toggleMenu()">☰</div>
<div class="title">Vendeur</div>
<div class="side" onclick="openOptions()">⋮</div>
</div>

<div class="main">
<div id="tickets" class="tickets">
<div class="empty-zone">Pas de jeux</div>
</div>

<div class="summary">
<div id="count">0</div>
<div id="total">0.00</div>
</div>

<div class="fields">
<div id="numeroLine" class="field active" onclick="setField('numero')">Numero</div>
<div id="loterieLine" class="field" onclick="setField('loterie')">Loterie</div>
<div id="montantLine" class="field" onclick="setField('montant')">Montant</div>
</div>

<div class="keypad">
<div class="key" onclick="press('+')">+</div>
<div class="key" onclick="press('1')">1</div>
<div class="key" onclick="press('2')">2</div>
<div class="key" onclick="press('3')">3</div>

<div class="key" onclick="press('-')">-</div>
<div class="key" onclick="press('4')">4</div>
<div class="key" onclick="press('5')">5</div>
<div class="key" onclick="press('6')">6</div>

<div class="key" onclick="press('/')">/</div>
<div class="key" onclick="press('7')">7</div>
<div class="key" onclick="press('8')">8</div>
<div class="key" onclick="press('9')">9</div>

<div class="key" onclick="press('.')">.</div>
<div class="key" onclick="back()">⌫</div>
<div class="key" onclick="press('0')">0</div>
<div class="key enter" onclick="enter()">ENTER</div>
</div>

<div class="nav">
<div class="active">Billets</div>
<div>Copier</div>
<div>Payer</div>
<div>Rapports</div>
<div>Menu</div>
</div>
</div>

<div id="menu" class="menu">
<div class="option">Tirages</div>
<div class="option">Balance</div>
<div class="option">Paramètres</div>
<div class="option">Imprimante</div>
<div class="option">Update</div>
<div class="option">Sortir</div>
</div>

<div id="options" class="popup">
<div class="option" onclick="deleteAll()">Supprimer</div>
<div class="option">Traiter le jeu</div>
<div class="option">Processus local</div>
<div class="option">Processus en ligne</div>
</div>

<div id="loterieModal" class="loterie-modal">
<div class="loterie-box">
<div class="loterie-item" onclick="chooseLoterie('Florida')">Florida</div>
<div class="loterie-item" onclick="chooseLoterie('New York Evening')">New York Evening</div>
<div class="loterie-item" onclick="chooseLoterie('Georgia Midday')">Georgia Midday</div>
<div class="loterie-item" onclick="chooseLoterie('Georgia Evening')">Georgia Evening</div>
<div class="loterie-item" onclick="chooseLoterie('Anguilla 10:00 AM')">Anguilla 10:00 AM</div>
<div class="loterie-item" onclick="chooseLoterie('Anguilla 01:00 PM')">Anguilla 01:00 PM</div>

<div class="loterie-actions">
<button class="action-btn" onclick="closeLoterieModal()">Fermer</button>
</div>
</div>
</div>

</body>


<script>
let numero="";
let loterie="Florida";
let montant="";
let active="numero";
let jeux=[];

function press(v){
if(active==="numero") numero+=v;
if(active==="montant") montant+=v;
update();
}

function back(){
if(active==="numero") numero=numero.slice(0,-1);
if(active==="montant") montant=montant.slice(0,-1);
update();
}

function enter(){
if(numero && montant){
jeux.push({numero,loterie,montant});
numero="";
montant="";
active="numero";
render();
}
}

function update(){
document.getElementById("numeroLine").textContent=numero||"Numero";
document.getElementById("loterieLine").textContent=loterie;
document.getElementById("montantLine").textContent=montant||"Montant";

document.querySelectorAll(".field").forEach(e=>e.classList.remove("active"));
document.getElementById(active+"Line").classList.add("active");
}

function render(){
let div=document.getElementById("tickets");
let total=0;

if(jeux.length===0){
div.innerHTML="Pas de jeux";
document.getElementById("count").textContent="0";
document.getElementById("total").textContent="0.00";
return;
}

div.innerHTML="";

jeux.forEach((j,i)=>{
let el=document.createElement("div");
el.innerHTML=j.numero+" - "+j.loterie+" - "+j.montant;

el.onclick=()=>{
if(confirm("Supprimer ?")){
jeux.splice(i,1);
render();
}
};

total+=parseFloat(j.montant)||0;
div.appendChild(el);
});

document.getElementById("count").textContent=jeux.length;
document.getElementById("total").textContent=total.toFixed(2);
}
function setField(field){
active = field;

if(field === "loterie"){
openLoterieModal();
}

update();
}

function openLoterieModal(){
document.getElementById("loterieModal").style.display = "flex";
}

function closeLoterieModal(){
document.getElementById("loterieModal").style.display = "none";
}

function chooseLoterie(name){
loterie = name;
active = "montant";
closeLoterieModal();
update();
}

function update(){
document.getElementById("numeroLine").textContent = numero || "Numero";
document.getElementById("loterieLine").textContent = loterie || "Loterie";
document.getElementById("montantLine").textContent = montant || "Montant";

document.getElementById("numeroLine").classList.remove("active");
document.getElementById("loterieLine").classList.remove("active");
document.getElementById("montantLine").classList.remove("active");

document.getElementById(active + "Line").classList.add("active");
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