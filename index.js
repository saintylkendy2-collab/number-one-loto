const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
res.redirect("/dashboard");
});
app.get("/dashboard", (req, res) => {
res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Vendeur</title>
<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
html,body{
margin:0;
padding:0;
width:100%;
height:100%;
overflow:hidden;
font-family:Arial,sans-serif;
background:#efeff4;
}
body{
display:flex;
flex-direction:column;
color:#111;
}
.topbar{
height:60px;
min-height:60px;
background:#3150a8;
color:#fff;
display:grid;
grid-template-columns:60px 1fr 110px;
align-items:center;
padding:0 8px;
font-size:20px;
}
.top-icon{
text-align:center;
font-size:28px;
cursor:pointer;
user-select:none;
}
.top-title{
text-align:center;
font-size:26px;
font-weight:600;
}
.top-right{
display:flex;
justify-content:flex-end;
align-items:center;
gap:18px;
padding-right:8px;
font-size:28px;
}
.main{
flex:1;
display:flex;
flex-direction:column;
min-height:0;
}
.tickets-area{
flex:1;
min-height:0;
overflow:auto;
background:#efeff4;
}
.empty-zone{
height:100%;
min-height:180px;
display:flex;
align-items:center;
justify-content:center;
color:#a8a8a8;
font-size:24px;
font-weight:600;
}
.group-title{
background:#dfe3fb;
color:#555;
font-weight:700;
font-size:22px;
padding:6px 12px;
border-top:1px solid #d0d0d0;
border-bottom:1px solid #d0d0d0;
}
.ticket-row{
display:grid;
grid-template-columns:1.3fr 1fr 1fr;
align-items:center;
background:#fff;
border-bottom:1px solid #ddd;
min-height:48px;
font-size:20px;
}
.ticket-row div{
padding:8px 12px;
}
.ticket-row div:nth-child(2),
.ticket-row div:nth-child(3){
text-align:right;
}
.summary-bar{
height:40px;
min-height:40px;
background:#dfe3fb;
display:grid;
grid-template-columns:1fr 1fr;
align-items:center;
padding:0 14px;
font-size:20px;
font-weight:700;
}
.summary-bar div:last-child{
text-align:right;
}
.selected-loteries-line{
min-height:42px;
background:#f2f2f2;
color:#444;
display:flex;
align-items:center;
padding:0 12px;
font-size:18px;
border-top:1px solid #ddd;
border-bottom:1px solid #ddd;
overflow:hidden;
white-space:nowrap;
text-overflow:ellipsis;
}
.fields{
height:56px;
min-height:56px;
display:grid;
grid-template-columns:1fr 1fr 1fr;
align-items:end;
background:#f7f7f7;
}
.fields{
height:56px;
min-height:56px;
display:grid;
grid-template-columns:1fr 1fr 1fr;
align-items:end;
background:#f7f7f7;
position:relative;
}

.field{
height:100%;
display:flex;
align-items:flex-end;
justify-content:center;
padding:0 8px 10px 8px;
font-size:18px;
color:#8f8f8f;
overflow:hidden;
white-space:nowrap;
text-overflow:ellipsis;
cursor:pointer;
user-select:none;
font-weight:500;
}

.field.active{
color:#111;
font-weight:700;
}

.active-line{
position:absolute;
bottom:0;
height:3px;
width:31%;
background:#5a6df0;
left:1%;
transition:left .2s ease;
}
.keypad{
height:384px;
min-height:384px;
display:grid;
grid-template-columns:repeat(4,1fr);
grid-template-rows:repeat(4,1fr);
border-top:1px solid #cacaca;
}
.key{
border:1px solid #cacaca;
background:#f7f7f7;
display:flex;
align-items:center;
justify-content:center;
font-size:26px;
color:#000;
user-select:none;
}
.key.enter{
background:#3d8d20;
color:#fff;
font-size:26px;
font-weight:700;
}
.bottom-nav{
height:58px;
min-height:58px;
background:#f3f1ff;
border-top:1px solid #d8d8d8;
display:grid;
grid-template-columns:repeat(5,1fr);
align-items:center;
text-align:center;
font-size:15px;
}
.bottom-nav .active{
color:#7a6bf2;
font-weight:700;
}
.drawer{
position:fixed;
top:0;
left:-280px;
width:280px;
height:100%;
background:#fff;
z-index:3000;
transition:.25s;
box-shadow:2px 0 10px rgba(0,0,0,.15);
padding-top:70px;
}
.drawer.open{left:0;}
.drawer-item{
padding:16px 18px;
border-bottom:1px solid #eee;
font-size:20px;
}
.options-sheet{
position:fixed;
left:0;
right:0;
bottom:-280px;
background:#fff;
z-index:3100;
transition:.25s;
box-shadow:0 -2px 12px rgba(0,0,0,.18);
}
.options-sheet.open{bottom:0;}
.sheet-item{
padding:18px;
border-bottom:1px solid #eee;
font-size:20px;
}
.overlay{
position:fixed;
inset:0;
background:rgba(0,0,0,.25);
z-index:2900;
display:none;
}
.overlay.show{display:block;}
.loterie-modal{
position:fixed;
inset:0;
z-index:4000;
background:rgba(0,0,0,.35);
display:none;
align-items:center;
justify-content:center;
}
.loterie-modal.show{display:flex;}
.loterie-box{
width:92%;
max-width:460px;
max-height:84vh;
overflow:hidden;
background:#fff;
border-radius:10px;
display:flex;
flex-direction:column;
}
.loterie-list{
overflow:auto;
max-height:72vh;
}
.loterie-item{
display:grid;
grid-template-columns:54px 1fr auto;
align-items:center;
gap:10px;
min-height:74px;
padding:10px 12px;
border-bottom:1px solid #ddd;
}
.loterie-check{
width:44px;
height:44px;
border-radius:50%;
background:#d9d9d9;
display:flex;
align-items:center;
justify-content:center;
font-size:26px;
color:#fff;
}
.loterie-item.selected .loterie-check{
background:#315af2;
}
.loterie-name{
font-size:20px;
font-weight:700;
color:#222;
}
.loterie-time{
font-size:16px;
color:#6ec3ff;
font-weight:700;
}
.loterie-sub{
font-size:14px;
color:#555;
margin-top:4px;
}
.modal-actions{
height:72px;
min-height:72px;
display:grid;
grid-template-columns:1fr 1fr 1fr;
align-items:center;
justify-items:center;
background:#f6f6f6;
}
.circle-btn{
width:54px;
height:54px;
border-radius:50%;
display:flex;
align-items:center;
justify-content:center;
font-size:28px;
color:#fff;
user-select:none;
}
.btn-clear{background:#5c638c;}
.btn-ok{background:#23c7db;}
.btn-close{background:#cfcfcf;color:#fff;}
@media (min-width:900px){
body{
max-width:500px;
margin:0 auto;
border-left:1px solid #ddd;
border-right:1px solid #ddd;
}
}
</style>
</head>
<body>

<div id="overlay" class="overlay" onclick="closeDrawer();closeOptions();"></div>

<div class="topbar">
<div class="top-icon" onclick="toggleDrawer()">☰</div>
<div class="top-title">Vendeur</div>
<div class="top-right">
<span onclick="openOptions()">⋮</span>
</div>
</div>

<div class="main">
<div id="ticketsArea" class="tickets-area">
<div class="empty-zone">Pas de jeux</div>
</div>

<div class="summary-bar">
<div id="ticketCount">0</div>
<div id="ticketTotal">0.00</div>
</div>

<div id="selectedLoteriesLine" class="selected-loteries-line"></div>

<div class="fields">
<div id="numeroLine" class="field active" onclick="setField('numero')">Numero</div>
<div id="loterieLine" class="field" onclick="setField('loterie')">Loterie</div>
<div id="montantLine" class="field" onclick="setField('montant')">Montant</div>
<div id="activeLine" class="active-line"></div>
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
<div class="key" onclick="backspaceKey()">⌫</div>
<div class="key" onclick="press('0')">0</div>
<div class="key enter" onclick="handleEnter()">ENTER</div>
</div>

<div class="bottom-nav">
<div class="active">Billets</div>
<div>Copier</div>
<div>Payer</div>
<div>Rapports</div>
<div>Menu</div>
</div>
</div>

<div id="drawer" class="drawer">
<div class="drawer-item">Tirages</div>
<div class="drawer-item">Balance</div>
<div class="drawer-item">Paramètre</div>
<div class="drawer-item">Imprimante</div>
<div class="drawer-item">Update</div>
<div class="drawer-item">Sortir</div>
</div>

<div id="optionsSheet" class="options-sheet">
<div class="sheet-item" onclick="deleteAllGames()">Supprimer</div>
<div class="sheet-item">Traiter le jeu</div>
<div class="sheet-item">Processus local</div>
<div class="sheet-item">Processus en ligne</div>
</div>

<div id="loterieModal" class="loterie-modal">
<div class="loterie-box">
<div id="loterieList" class="loterie-list"></div>
<div class="modal-actions">
<div class="circle-btn btn-clear" onclick="clearLoteries()">🚫</div>
<div class="circle-btn btn-ok" onclick="validateLoteries()">✓</div>
<div class="circle-btn btn-close" onclick="closeLoterieModal()">✕</div>
</div>
</div>
</div>

<script>
var activeField = "numero";
var numero = "";
var montant = "";
var jeux = [];
var selectedLoteries = [];

var loteries = [
{ name: "LA PRIMERA DIA", sub: "20 minutes", time: "11:55 AM" },
{ name: "LOTEDOM", sub: "20 minutes", time: "11:55 AM" },
{ name: "LA SUERTE DIA", sub: "40 minutes", time: "12:15 PM" },
{ name: "GEORGIA MIDDAY", sub: "50 minutes", time: "12:25 PM" },
{ name: "KING LOTTERY DIA", sub: "50 minutes", time: "12:25 PM" },
{ name: "ANGUILLA 01:00 PM", sub: "1 heure 15 minutes", time: "12:50 PM" },
{ name: "REAL", sub: "1 heure 20 minutes", time: "12:55 PM" },
{ name: "FLORIDA MIDDAY", sub: "1 heure 50 minutes", time: "1:25 PM" },
{ name: "NEW YORK MIDDAY", sub: "2 heures 50 minutes", time: "2:25 PM" },
{ name: "GANAMAS", sub: "2 heures 55 minutes", time: "2:30 PM" },
{ name: "LA SUERTE NOCHE", sub: "6 heures 15 minutes", time: "5:50 PM" },
{ name: "ANGUILLA 6:00 PM", sub: "6 heures 15 minutes", time: "5:50 PM" },
{ name: "GEORGIA EVENING", sub: "7 heures 15 minutes", time: "6:50 PM" }
];

function updateFields(){
document.getElementById("numeroLine").textContent = numero || "Numero";
document.getElementById("loterieLine").textContent = "Loterie";
document.getElementById("montantLine").textContent = montant || "Montant";

document.getElementById("numeroLine").classList.remove("active");
document.getElementById("loterieLine").classList.remove("active");
document.getElementById("montantLine").classList.remove("active");

var left = "1%";
if(activeField === "numero"){
document.getElementById("numeroLine").classList.add("active");
left = "1%";
}
if(activeField === "loterie"){
document.getElementById("loterieLine").classList.add("active");
left = "34.5%";
}
if(activeField === "montant"){
document.getElementById("montantLine").classList.add("active");
left = "68%";
}

document.getElementById("activeLine").style.left = left;

document.getElementById("selectedLoteriesLine").textContent = selectedLoteries.length
? selectedLoteries.join(", ")
: "";
}

function setField(field){
activeField = field;
updateFields();
if(field === "loterie"){
openLoterieModal();
}
}

function press(val){
if(activeField === "numero"){
numero += String(val);
}else if(activeField === "montant"){
montant += String(val);
}
updateFields();
}

function backspaceKey(){
if(activeField === "numero"){
numero = numero.slice(0, -1);
}else if(activeField === "montant"){
montant = montant.slice(0, -1);
}
updateFields();
}

function handleEnter(){
if(activeField === "numero"){
if(!numero.trim()) return;

if(selectedLoteries.length > 0){
activeField = "montant";
updateFields();
}else{
activeField = "loterie";
updateFields();
openLoterieModal();
}
return;
}

if(activeField === "montant"){
addGame();
return;
}

if(activeField === "loterie"){
openLoterieModal();
}
}

function openLoterieModal(){
document.getElementById("loterieModal").classList.add("show");
renderLoterieList();
}

function closeLoterieModal(){
document.getElementById("loterieModal").classList.remove("show");
activeField = "numero";
updateFields();
}

function toggleLoterie(name){
var index = selectedLoteries.indexOf(name);
if(index >= 0){
selectedLoteries.splice(index, 1);
}else{
selectedLoteries.push(name);
}
renderLoterieList();
updateFields();
}

function clearLoteries(){
selectedLoteries = [];
renderLoterieList();
updateFields();
}

function validateLoteries(){
closeLoterieModal();
activeField = "numero";
updateFields();
}

function renderLoterieList(){
var list = document.getElementById("loterieList");
list.innerHTML = "";

loteries.forEach(function(item){
var row = document.createElement("div");
row.className = "loterie-item" + (selectedLoteries.indexOf(item.name) >= 0 ? " selected" : "");
row.onclick = function(){
toggleLoterie(item.name);
};

var left = document.createElement("div");
left.className = "loterie-check";
left.textContent = selectedLoteries.indexOf(item.name) >= 0 ? "✓" : "";

var center = document.createElement("div");
center.innerHTML =
'<div class="loterie-name">' + item.name + '</div>' +
'<div class="loterie-sub">' + item.sub + '</div>';

var right = document.createElement("div");
right.className = "loterie-time";
right.textContent = item.time;

row.appendChild(left);
row.appendChild(center);
row.appendChild(right);
list.appendChild(row);
});
}

function addGame(){
if(!numero.trim()) return;
if(!montant.trim()) return;
if(selectedLoteries.length === 0) return;

selectedLoteries.forEach(function(lot){
jeux.push({
type: "Borlette",
numero: numero.trim(),
loterie: lot,
montant: parseFloat(montant) || 0
});
});

numero = "";
activeField = "numero";
renderJeux();
updateFields();
}

function renderJeux(){
var area = document.getElementById("ticketsArea");

if(jeux.length === 0){
area.innerHTML = '<div class="empty-zone">Pas de jeux</div>';
document.getElementById("ticketCount").textContent = "0";
document.getElementById("ticketTotal").textContent = "0.00";
return;
}

var total = 0;
var count = jeux.length;
var grouped = {};

jeux.forEach(function(j){
if(!grouped[j.loterie]) grouped[j.loterie] = [];
grouped[j.loterie].push(j);
total += Number(j.montant) || 0;
});

area.innerHTML = "";

Object.keys(grouped).forEach(function(name){
var title = document.createElement("div");
title.className = "group-title";
title.textContent = name;
area.appendChild(title);

grouped[name].forEach(function(j){
var row = document.createElement("div");
row.className = "ticket-row";
row.innerHTML =
"<div>" + j.type + "</div>" +
"<div>" + j.numero + "</div>" +
"<div>" + Number(j.montant).toFixed(2) + "</div>";

row.onclick = function(){
if(confirm("Supprimer ?")){
var idx = jeux.indexOf(j);
if(idx >= 0){
jeux.splice(idx, 1);
renderJeux();
}
}
};

area.appendChild(row);
});
});

document.getElementById("ticketCount").textContent = String(count);
document.getElementById("ticketTotal").textContent = total.toFixed(2);
}

function toggleDrawer(){
var d = document.getElementById("drawer");
var o = document.getElementById("overlay");
d.classList.toggle("open");
o.classList.toggle("show");
closeOptions();
}

function closeDrawer(){
document.getElementById("drawer").classList.remove("open");
document.getElementById("overlay").classList.remove("show");
}

function openOptions(){
document.getElementById("optionsSheet").classList.add("open");
document.getElementById("overlay").classList.add("show");
closeDrawer();
}

function closeOptions(){
document.getElementById("optionsSheet").classList.remove("open");
}

function deleteAllGames(){
jeux = [];
closeOptions();
document.getElementById("overlay").classList.remove("show");
renderJeux();
updateFields();
}

renderJeux();
updateFields();
</script>

</body>
</html>
`);
});
app.listen(3000, "0.0.0.0", () => {
console.log("Server ap mache sou rezo a");
});