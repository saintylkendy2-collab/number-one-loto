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
body{
margin:0;
font-family:Arial;
background:#efeff4;
overflow:hidden;
height:100vh;
}

.topbar{
height:60px;
background:#2f4ea2;
color:white;
display:flex;
align-items:center;
justify-content:space-between;
padding:0 15px;
font-size:20px;
}

.display{
height:calc(100vh - 60px - 58px - 384px);
display:flex;
flex-direction:column;
overflow:hidden;
}

.tickets{
flex:1;
display:flex;
align-items:center;
justify-content:center;
color:#aaa;
font-size:22px;
overflow:hidden;
}

.summary{
height:40px;
background:#dfe3ff;
display:flex;
justify-content:space-between;
padding:0 15px;
align-items:center;
font-size:20px;
font-weight:bold;
}

.fields{
display:flex;
border-top:1px solid #ccc;
background:#f7f7f7;
}

.field{
flex:1;
text-align:center;
padding:10px 6px;
border-bottom:3px solid transparent;
font-size:18px;
color:#888;
}

.field.active{
border-bottom:3px solid #4b5cff;
color:black;
font-weight:bold;
}

.keypad{
position:fixed;
bottom:58px;
left:0;
right:0;
height:384px;
display:grid;
grid-template-columns:repeat(4,1fr);
grid-template-rows:repeat(4,1fr);
background:#ddd;
}

.key{
border:1px solid #c8c8c8;
display:flex;
justify-content:center;
align-items:center;
font-size:26px;
background:#f7f7f7;
}

.enter{
background:linear-gradient(#dfe7ea, #cfd8dc);
color:#111;
font-size:34px;
font-weight:bold;
}

.nav{
position:fixed;
bottom:0;
left:0;
right:0;
height:58px;
background:#f3f1ff;
display:flex;
justify-content:space-around;
align-items:center;
font-size:14px;
border-top:1px solid #d3d3d3;
}
</style>
</head>

<body>

<div class="topbar">
<div>☰</div>
<div>Vendeur</div>
<div>⋮</div>
</div>

<div class="display">
<div id="tickets" class="tickets">Pas de jeux</div>

<div class="summary">
<div id="count">0</div>
<div id="total">0.00</div>
</div>

<div class="fields">
<div id="numeroLine" class="field active">Numero</div>
<div id="loterieLine" class="field">Loterie</div>
<div id="montantLine" class="field">Montant</div>
</div>
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
<div>Billets</div>
<div>Copier</div>
<div>Payer</div>
<div>Rapports</div>
<div>Menu</div>
</div>

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

update();
</script>

</body>
</html>
`);
});
app.listen(3000, "0.0.0.0", () => {
console.log("Server ap mache sou rezo a");
});