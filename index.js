const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const LOGIN_ID = "NOC100";
const LOGIN_PASSWORD = "1234";

app.get("/", (req, res) => {
res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Login Vendeur</title>
<style>
*{box-sizing:border-box;}
html,body{
margin:0;
padding:0;
width:100%;
height:100%;
font-family:Arial,sans-serif;
background:#f2f2f2;
}
body{
display:flex;
align-items:center;
justify-content:center;
padding:20px;
}
.login-box{
width:100%;
max-width:380px;
background:#fff;
border-radius:16px;
box-shadow:0 8px 25px rgba(0,0,0,.08);
padding:28px 22px;
}
.title{
text-align:center;
font-size:26px;
font-weight:800;
color:#1c1c1c;
margin-bottom:22px;
}
.sub{
text-align:center;
color:#666;
margin-bottom:20px;
}
.input{
width:100%;
height:52px;
border:1px solid #d8d8d8;
border-radius:10px;
font-size:18px;
padding:0 14px;
margin-bottom:14px;
}
.btn{
width:100%;
height:54px;
border:none;
border-radius:12px;
background:#3f7fe8;
color:#fff;
font-size:22px;
font-weight:700;
cursor:pointer;
}
.note{
margin-top:16px;
color:#888;
font-size:14px;
text-align:center;
}
</style>
</head>
<body>
<form class="login-box" method="POST" action="/login">
<div class="title">NUMBER ONE LOTO</div>
<div class="sub">Connexion vendeur</div>
<input class="input" type="text" name="id" placeholder="Identifiant" autocomplete="username" required>
<input class="input" type="password" name="password" placeholder="Mot de passe" autocomplete="current-password" required>
<button class="btn" type="submit">CONNECTER</button>
<div class="note">ID test: NOC100 &nbsp;|&nbsp; Mot de passe: 1234</div>
</form>
</body>
</html>
`);
});

app.post("/login", (req, res) => {
const id = (req.body.id || "").trim();
const password = (req.body.password || "").trim();

if (id === LOGIN_ID && password === LOGIN_PASSWORD) {
return res.redirect("/dashboard");
}

res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Login échoué</title>
<style>
body{
margin:0;
min-height:100vh;
display:flex;
align-items:center;
justify-content:center;
background:#f2f2f2;
font-family:Arial,sans-serif;
padding:20px;
}
.box{
width:100%;
max-width:360px;
background:#fff;
border-radius:14px;
padding:24px;
box-shadow:0 8px 22px rgba(0,0,0,.08);
text-align:center;
}
.msg{
color:#d93025;
font-size:20px;
font-weight:700;
margin-bottom:16px;
}
a{
display:inline-block;
margin-top:6px;
text-decoration:none;
color:#3f7fe8;
font-weight:700;
}
</style>
</head>
<body>
<div class="box">
<div class="msg">Identifiant ou mot de passe incorrect ✖</div>
<a href="/">Retour</a>
</div>
</body>
</html>
`);
});

app.get("/logout", (req, res) => {
res.redirect("/");
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
overflow-y:auto;
font-family:Arial,sans-serif;
background:#efeff4;
}
body{
color:#111;
}
.app{
height:100vh;
display:flex;
flex-direction:column;
}
.topbar{
height:60px;
min-height:60px;
background:#3452aa;
color:#fff;
display:grid;
grid-template-columns:60px 1fr 110px;
align-items:center;
}
.top-left,.top-right{
display:flex;
align-items:center;
justify-content:center;
gap:14px;
font-size:28px;
user-select:none;
}
.top-title{
text-align:center;
font-size:28px;
font-weight:800;
}
.icon-btn{
cursor:pointer;
}
.main{
flex:1;
min-height:0;
display:flex;
flex-direction:column;
overflow:hidden;
}
.tickets-area{
flex:1;
min-height:140px;
overflow:auto;
background:#efeff4;
}
.empty-zone{
height:100%;
display:flex;
align-items:center;
justify-content:center;
color:#a9a9a9;
font-size:26px;
font-weight:700;
}
.group-title{
font-size:14px;
font-weight:600;
padding:4px 8px;
background:#e6e6f0;
line-height:1.1;
}
.ticket-row{
display:grid;
grid-template-columns:60px 1fr 80px;
align-items:center;
padding:6px 10px; /* redwi wotè */
font-size:14px;
}

.ticket-row div{
text-align:center;
}

/* type (BOR, L4, etc) */
.ticket-row div:first-child{
font-weight:600;
text-align:left;
}

/* numero */
.ticket-row div:first-child{
font-weight:normal;
text-align:left;
}

/* montant */
.ticket-row div:last-child{
text-align:right;
}

/* retire twòp espas ant liy yo */
.ticket-row + .ticket-row{
margin-top:2px;
}

.summary-bar{
height:42px;
min-height:42px;
background:#dfe3fb;
display:grid;
grid-template-columns:1fr 1fr 1fr;
align-items:center;
font-size:22px;
font-weight:800;
padding:0 12px;
}
.summary-bar .count{
grid-column:2;
display:flex;
align-items:center;
justify-content:center;
text-align:center;
}
.summary-bar .total{
grid-column:3;
display:flex;
align-items:center;
justify-content:flex-end;
text-align:right;
}
.selected-loteries-line{
min-height:40px;
height:40px;
background:#f3f3f3;
border-top:1px solid #ddd;
border-bottom:1px solid #ddd;
display:flex;
align-items:center;
padding:0 12px;
font-size:18px;
color:#444;
overflow:hidden;
white-space:nowrap;
text-overflow:ellipsis;
}
.choice-panel{
display:none;
padding:8px 12px;
background:#efeff4;
}
.choice-grid{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:8px;
}
.choice-chip{
height:56px;
border-radius:12px;
background:#fff;
border:2px solid #d7d7d7;
display:flex;
align-items:center;
justify-content:center;
font-size:24px;
font-weight:800;
cursor:pointer;
user-select:none;
}
.choice-chip.active{
background:#dfe3fb;
border-color:#5b6ff2;
}
.fields{
height:50px;
min-height:50px;
background:#f8f8f8;
display:grid;
grid-template-columns:1fr 1fr 1fr;
position:relative;
border-bottom:1px solid #d0d0d0;
}
.field{
position:relative;
display:flex;
align-items:flex-end;
justify-content:center;
padding:0 8px 8px 8px;
font-size:18px;
color:#979797;
font-weight:500;
user-select:none;
cursor:pointer;
overflow:hidden;
white-space:nowrap;
text-overflow:ellipsis;
}
.field.active{
color:#111;
font-weight:800;
}
.active-line{
position:absolute;
bottom:0;
left:1%;
width:31%;
height:3px;
background:#5b6ff2;
transition:left .18s ease;
}
.active-caret{
position:absolute;
bottom:6px;
width:2px;
height:28px;
background:#ff5d93;
border-radius:3px;
transition:left .18s ease;
left:16%;
animation:blinkCaret 1s steps(1) infinite;
}
@keyframes blinkCaret{
0%,50%{opacity:1;}
50.01%,100%{opacity:0;}
}
.keypad{
height:300px;
min-height:300px;
display:grid;
grid-template-columns:repeat(4,1fr);
grid-template-rows:repeat(4,1fr);
border-top:1px solid #cacaca;
margin-top:8px;
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
cursor:pointer;
}
.key:active{
background:#e3e3e3;
}
.key.enter{
background:#fff; /* menm koulè ak lòt yo */
color:#000;
font-size:26px;
font-weight:700;
}

.bottom-nav{
height:54px;
min-height:54px;
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
.overlay{
position:fixed;
inset:0;
background:rgba(0,0,0,.22);
z-index:3000;
display:none;
}
.overlay.show{
display:block;
}
.drawer{
position:fixed;
top:0;
left:-290px;
width:280px;
height:100%;
background:#fff;
z-index:3100;
transition:left .22s ease;
box-shadow:3px 0 16px rgba(0,0,0,.18);
overflow:auto;
}
.drawer.open{
left:0;
}
.drawer-head{
background:#3452aa;
color:#fff;
padding:22px 18px;
font-size:24px;
font-weight:800;
}
.drawer-item{
padding:17px 18px;
border-bottom:1px solid #eee;
font-size:20px;
cursor:pointer;
}
.options-sheet{
position:fixed;
left:0;
right:0;
bottom:-420px;
background:#fff;
z-index:3200;
transition:bottom .22s ease;
box-shadow:0 -3px 16px rgba(0,0,0,.18);
}
.options-sheet.open{
bottom:0;
}
.sheet-item{
padding:18px;
border-bottom:1px solid #eee;
font-size:20px;
cursor:pointer;
}
.loterie-modal{
position:fixed;
inset:0;
background:rgba(0,0,0,.35);
z-index:4000;
display:none;
align-items:center;
justify-content:center;
}
.loterie-modal.show{
display:flex;
}
.loterie-box{
width:92%;
max-width:460px;
max-height:84vh;
background:#fff;
border-radius:12px;
overflow:hidden;
display:flex;
flex-direction:column;
}
.loterie-list{
overflow:auto;
max-height:72vh;
}
.loterie-item{
display:grid;
grid-template-columns:56px 1fr auto;
gap:10px;
align-items:center;
min-height:78px;
padding:8px 12px;
border-bottom:1px solid #ddd;
cursor:pointer;
}
.loterie-check{
width:44px;
height:44px;
border-radius:50%;
background:#d8d8d8;
color:#fff;
display:flex;
align-items:center;
justify-content:center;
font-size:28px;
font-weight:700;
}
.loterie-item.selected .loterie-check{
background:#355af2;
}
.loterie-name{
font-size:20px;
font-weight:800;
color:#222;
}
.loterie-sub{
margin-top:4px;
font-size:14px;
color:#666;
}
.loterie-time{
color:#76c5ff;
font-size:18px;
font-weight:800;
white-space:nowrap;
}
.modal-actions{
height:74px;
min-height:74px;
background:#f5f5f5;
display:grid;
grid-template-columns:1fr 1fr 1fr;
align-items:center;
justify-items:center;
}
.circle-btn{
width:56px;
height:56px;
border-radius:50%;
display:flex;
align-items:center;
justify-content:center;
font-size:30px;
color:#fff;
user-select:none;
cursor:pointer;
}
.btn-clear{background:#5f628b;}
.btn-ok{background:#1fc7dd;}
.btn-close{background:#c9c9c9;}
.hidden-print-form{
display:none;
}
@media (min-width:900px){
body{
background:#dfe3ea;
}
.app{
max-width:500px;
margin:0 auto;
background:#efeff4;
border-left:1px solid #ddd;
border-right:1px solid #ddd;
}
}
</style>
</head>
<body>
<div class="app">
<div id="overlay" class="overlay" onclick="closeDrawer();closeOptions();"></div>

<div class="topbar">
<div class="top-left">
<span class="icon-btn" onclick="toggleDrawer()">☰</span>
</div>
<div class="top-title">Vendeur</div>
<div class="top-right">
<span class="icon-btn" onclick="submitPrint()">🖨️</span>
<span class="icon-btn" onclick="shareWhatsApp()">🟢</span>
<span class="icon-btn" onclick="openOptions()">⋮</span>
</div>
</div>

<div class="main">
<div id="ticketsArea" class="tickets-area">
<div class="empty-zone">Pas de jeux</div>
</div>

<div class="summary-bar">
<div id="ticketCount" class="count">0</div>
<div id="ticketTotal" class="total">0.00</div>
</div>

<div id="selectedLoteriesLine" class="selected-loteries-line"></div>

<div id="choicePanel" class="choice-panel">
  <div id="choiceList" class="choice-grid"></div>
</div>

<div class="fields">
<div id="numeroLine" class="field active" onclick="tapField(event,'numero')">Numero</div>
<div id="loterieLine" class="field" onclick="setField('loterie')">Loterie</div>
<div id="montantLine" class="field" onclick="tapField(event,'montant')">Montant</div>
<div id="activeLine" class="active-line"></div>
<div id="activeCaret" class="active-caret"></div>
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
<div class="drawer-head">NUMBER ONE LOTO</div>
<div class="drawer-item">Tirages</div>
<div class="drawer-item">Balance</div>
<div class="drawer-item">Paramètre</div>
<div class="drawer-item">Imprimante</div>
<div class="drawer-item">Update</div>
<div class="drawer-item" onclick="window.location='/logout'">Sortir</div>
</div>

<div id="optionsSheet" class="options-sheet">
<div class="sheet-item" onclick="deleteAllGames()">Supprimer</div>
<div class="sheet-item" onclick="autoMarriage()">Maryaj otomatik</div>
<div class="sheet-item" onclick="autoLoto4()">Loto 4 chif otomatik</div>
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

<form id="printForm" class="hidden-print-form" method="POST" action="/print" target="_blank">
<input type="hidden" name="data" id="printData">
</form>
</div>

<script>
var activeField = "numero";
var numero = "";
var montant = "";
var jeux = [];
var selectedLoteries = [];
var cursorNumero = 0;
var cursorMontant = 0;
var pendingChoiceNumber = "";
var tempChoices = [];

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

function getSelectedLoteriesText(){
  return selectedLoteries.length ? selectedLoteries.join(", ") : "";
}

function measureTextWidth(text, el){
  const canvas = measureTextWidth.canvas || (measureTextWidth.canvas = document.createElement("canvas"));
  const ctx = canvas.getContext("2d");
  const style = window.getComputedStyle(el);
  ctx.font = style.fontWeight + " " + style.fontSize + " " + style.fontFamily;
  return ctx.measureText(text).width;
}

function getFieldValue(field){
  return field === "numero" ? numero : montant;
}

function getCursorValue(field){
  return field === "numero" ? cursorNumero : cursorMontant;
}

function setCursorValue(field, value){
  if(field === "numero"){
    cursorNumero = value;
  }else{
    cursorMontant = value;
  }
}

function tapField(event, field){
  activeField = field;

  var el = document.getElementById(field === "numero" ? "numeroLine" : "montantLine");
  var value = getFieldValue(field);
  var rect = el.getBoundingClientRect();
  var clickX = event.clientX;

  if(!value.length){
    setCursorValue(field, 0);
    updateFields();
    return;
  }

  var textWidth = measureTextWidth(value, el);
  var startX = rect.left + ((rect.width - textWidth) / 2);

  var bestIndex = 0;
  var bestDistance = Infinity;

  for(var i = 0; i <= value.length; i++){
    var part = value.slice(0, i);
    var x = startX + measureTextWidth(part, el);
    var dist = Math.abs(clickX - x);

    if(dist < bestDistance){
      bestDistance = dist;
      bestIndex = i;
    }
  }

  setCursorValue(field, bestIndex);
  updateFields();
}

function moveCaret(){
  var caret = document.getElementById("activeCaret");
  var fieldsWrap = document.querySelector(".fields");

  if(activeField === "loterie"){
    caret.style.display = "none";
    return;
  }

  var fieldEl = document.getElementById(activeField === "numero" ? "numeroLine" : "montantLine");
  var value = getFieldValue(activeField);
  var cursorPos = getCursorValue(activeField);

  var wrapRect = fieldsWrap.getBoundingClientRect();
  var fieldRect = fieldEl.getBoundingClientRect();

  var shownText = value || (activeField === "numero" ? "Numero" : "Montant");
  var fullWidth = measureTextWidth(shownText, fieldEl);
  var textStart = fieldRect.left + ((fieldRect.width - fullWidth) / 2);

  var realText = value || "";
  var beforeCursor = realText.slice(0, cursorPos);
  var beforeWidth = measureTextWidth(beforeCursor, fieldEl);

  var caretX = textStart + beforeWidth;

  caret.style.display = "block";
  caret.style.left = (caretX - wrapRect.left) + "px";
}

function updateFields(){
  var numeroLine = document.getElementById("numeroLine");
  var loterieLine = document.getElementById("loterieLine");
  var montantLine = document.getElementById("montantLine");
  var selectedLine = document.getElementById("selectedLoteriesLine");
  var activeLine = document.getElementById("activeLine");

  numeroLine.textContent = numero || "Numero";
  loterieLine.textContent = "Loterie";
  montantLine.textContent = montant || "Montant";
  selectedLine.textContent = getSelectedLoteriesText();

  numeroLine.classList.remove("active");
  loterieLine.classList.remove("active");
  montantLine.classList.remove("active");

  var lineLeft = "1%";

  if(activeField === "numero"){
    numeroLine.classList.add("active");
    lineLeft = "1%";
  }

  if(activeField === "loterie"){
    loterieLine.classList.add("active");
    lineLeft = "34.5%";
  }

  if(activeField === "montant"){
    montantLine.classList.add("active");
    lineLeft = "68%";
  }

  activeLine.style.left = lineLeft;
  moveCaret();
}

function setField(field){
  activeField = field;

  if(field === "numero"){
    cursorNumero = numero.length;
  }

  if(field === "montant"){
    cursorMontant = montant.length;
  }

  updateFields();

  if(field === "loterie"){
    openLoterieModal();
  }
}

function showChoicePanel(options){
  var panel = document.getElementById("choicePanel");
  var list = document.getElementById("choiceList");
  tempChoices = [];
  list.innerHTML = "";

  options.forEach(function(opt){
    var div = document.createElement("div");
    div.className = "choice-chip";
    div.textContent = opt;
    div.onclick = function(){
      if(tempChoices.indexOf(opt) >= 0){
        tempChoices = tempChoices.filter(function(x){ return x !== opt; });
        div.classList.remove("active");
      }else{
        tempChoices.push(opt);
        div.classList.add("active");
      }
    };
    list.appendChild(div);
  });

  panel.style.display = "block";
  document.querySelector(".key.enter").classList.add("option-mode");
}

function hideChoicePanel(){
  document.getElementById("choicePanel").style.display = "none";
  document.getElementById("choiceList").innerHTML = "";
  document.querySelector(".key.enter").classList.remove("option-mode");
  tempChoices = [];
}

function press(val){
  val = String(val);

  if(activeField === "numero"){
    if(val === "+"){
      if(numero.length === 4){
        pendingChoiceNumber = numero;
        showChoicePanel(["L1","L2","L3"]);
        return;
      }

      if(numero.length === 5){
        pendingChoiceNumber = numero;
        showChoicePanel(["L1","L2","L3"]);
        return;
      }

      return;
    }

    if(val === "/"){
      if(/^\\d{2}$/.test(numero) || /^\\d{4}$/.test(numero)){
        numero = numero + "/";
        cursorNumero = numero.length;
        activeField = "montant";
        cursorMontant = montant.length;
        updateFields();
        return;
      }
      return;
    }

    if(!/[0-9]/.test(val)) return;
    if(numero.indexOf("/") >= 0) return;
    if(numero.length >= 5) return;

    numero = numero.slice(0, cursorNumero) + val + numero.slice(cursorNumero);
    cursorNumero += val.length;
  }else if(activeField === "montant"){
    if(!/[0-9.]/.test(val)) return;
    montant = montant.slice(0, cursorMontant) + val + montant.slice(cursorMontant);
    cursorMontant += val.length;
  }

  updateFields();
}

function backspaceKey(){
  if(activeField === "numero"){
    if(cursorNumero > 0){
      numero = numero.slice(0, cursorNumero - 1) + numero.slice(cursorNumero);
      cursorNumero--;
    }
  }else if(activeField === "montant"){
    if(cursorMontant > 0){
      montant = montant.slice(0, cursorMontant - 1) + montant.slice(cursorMontant);
      cursorMontant--;
    }
  }

  updateFields();
}

function handleEnter(){
  if (document.getElementById("choicePanel").style.display === "block") {
    if(tempChoices.length === 0){
      alert("Chwazi omwen youn");
      return;
    }
    numero = pendingChoiceNumber + "+" + tempChoices.join(",");
    cursorNumero = numero.length;
    hideChoicePanel();
    activeField = "montant";
    cursorMontant = montant.length;
    updateFields();
    return;
  }

  if (activeField === "numero") {
    if (!numero.trim()) return;

    if (selectedLoteries.length > 0) {
      activeField = "montant";
      cursorMontant = montant.length;
      updateFields();
    } else {
      activeField = "loterie";
      updateFields();
      openLoterieModal();
    }
    return;
  }

  if (activeField === "montant") {
    addGame();
    return;
  }

  if (activeField === "loterie") {
    openLoterieModal();
  }
}

function openLoterieModal(){
  document.getElementById("loterieModal").classList.add("show");
  document.getElementById("overlay").classList.add("show");
  renderLoterieList();
}

function closeLoterieModal(){
  document.getElementById("loterieModal").classList.remove("show");
  document.getElementById("overlay").classList.remove("show");
  activeField = "numero";
  updateFields();
}

function clearLoteries(){
  selectedLoteries = [];
  renderLoterieList();
  updateFields();
}

function validateLoteries(){
  document.getElementById("loterieModal").classList.remove("show");
  document.getElementById("overlay").classList.remove("show");
  activeField = "montant";
  cursorMontant = montant.length;
  updateFields();
}

function toggleLoterie(name){
  var idx = selectedLoteries.indexOf(name);

  if (idx >= 0) {
    selectedLoteries.splice(idx, 1);
  } else {
    selectedLoteries.push(name);
  }

  renderLoterieList();
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

function reverse2(s){
  return s.charAt(1) + s.charAt(0);
}

function uniqueStrings(arr){
  var out = [];
  var seen = {};
  arr.forEach(function(x){
    if(!seen[x]){
      seen[x] = true;
      out.push(x);
    }
  });
  return out;
}

function buildSlashMarriageEntries(num){
  var raw = num.slice(0, -1);

  if(/^\\d{2}$/.test(raw)){
    var a2 = raw;
    var ar2 = reverse2(a2);

    return uniqueStrings([a2, ar2]).map(function(x){
      return { type: "BOR", numero: x };
    });
  }

  if(/^\\d{4}$/.test(raw)){
    var a = raw.slice(0,2);
    var b = raw.slice(2,4);
    var ar = reverse2(a);
    var br = reverse2(b);

    return uniqueStrings([
      a + "*" + b,
      a + "*" + br,
      ar + "*" + b,
      ar + "*" + br
    ]).map(function(x){
      var parts = x.split("*");
      if(parts[0] === parts[1]) return null;
      if(parts[0] === reverse2(parts[1])) return null;
      return { type: "MAR", numero: x };
    }).filter(Boolean);
  }

  return null;
}

function buildGameEntries(num){
  num = num.trim();

  if (/^\\d{2}$/.test(num)) {
    return [{ type: "BOR", numero: num }];
  }

  if (/^\\d{2}\\/$/.test(num)) {
    return buildSlashMarriageEntries(num);
  }

  if (/^\\d{3}$/.test(num)) {
    return [{ type: "L3", numero: num }];
  }

  if (/^\\d{4}$/.test(num)) {
    return [{ type: "MAR", numero: num.slice(0,2) + "*" + num.slice(2,4) }];
  }

  if (/^\\d{4}\\/$/.test(num)) {
    return buildSlashMarriageEntries(num);
  }

  if (/^\\d{4}\\+(L1|L2|L3)(,(L1|L2|L3))*$/.test(num)) {
    var raw4 = num.split("+")[0];
    var types4 = uniqueStrings(num.split("+")[1].split(","));
    return types4.map(function(t){
      return { type: t, numero: raw4 };
    });
  }

  if (/^\\d{5}\\+(L1|L2|L3)(,(L1|L2|L3))*$/.test(num)) {
    var raw5 = num.split("+")[0];
    var types5 = uniqueStrings(num.split("+")[1].split(","));
    return types5.map(function(t){
      return { type: t, numero: raw5 };
    });
  }

  return null;
}

function mergeOrPushGame(entry){
  var found = jeux.find(function(j){
    return j.type === entry.type && j.numero === entry.numero && j.loterie === entry.loterie;
  });

  if(found){
    found.montant = Number(found.montant) + Number(entry.montant);
  }else{
    jeux.push(entry);
  }
}

function getAutoSourceBalls(){
  var counts = {};

  jeux.forEach(function(j){
    if(j.type === "BOR" && /^\\d{2}$/.test(j.numero)){
      counts[j.numero] = (counts[j.numero] || 0) + 1;
    }
  });

  return counts;
}

function autoMarriage(){
  var counts = getAutoSourceBalls();
  var nums = Object.keys(counts);

  if(nums.length === 0){
    alert("Pa gen boul 2 chif pou maryaj otomatik");
    return;
  }
  if(selectedLoteries.length === 0){
    alert("Chwazi omwen yon loterie");
    return;
  }
  if(!montant.trim()){
    alert("Mete montan an");
    return;
  }

  var results = {};

  for(var i=0;i<nums.length;i++){
    for(var j=i+1;j<nums.length;j++){
      var a = nums[i];
      var b = nums[j];
      var ar = reverse2(a);
      var br = reverse2(b);

      if(a === b) continue;
      if(a === br) continue;
      if(ar === b) continue;

      [
        a + "*" + b,
        a + "*" + br,
        ar + "*" + b,
        ar + "*" + br
      ].forEach(function(m){
        var parts = m.split("*");
        if(parts[0] !== parts[1] && parts[0] !== reverse2(parts[1])){
          results[m] = true;
        }
      });
    }
  }

  Object.keys(results).forEach(function(numeroAuto){
    selectedLoteries.forEach(function(lot){
      mergeOrPushGame({
        type: "MAR",
        numero: numeroAuto,
        loterie: lot,
        montant: parseFloat(montant) || 0
      });
    });
  });

  closeOptions();
  document.getElementById("overlay").classList.remove("show");
  renderJeux();
  updateFields();
}

function autoLoto4(){
  var counts = getAutoSourceBalls();
  var nums = Object.keys(counts);

  if(nums.length === 0){
    alert("Pa gen boul 2 chif pou loto otomatik");
    return;
  }
  if(selectedLoteries.length === 0){
    alert("Chwazi omwen yon loterie");
    return;
  }
  if(!montant.trim()){
    alert("Mete montan an");
    return;
  }

  var results = {};

  for(var i=0;i<nums.length;i++){
    for(var j=i+1;j<nums.length;j++){
      var a = nums[i];
      var b = nums[j];
      var ar = reverse2(a);
      var br = reverse2(b);

      if(a === b) continue;
      if(a === br) continue;
      if(ar === b) continue;

      [
        a + b,
        a + br,
        ar + b,
        ar + br,
        b + a,
        b + ar,
        br + a,
        br + ar
      ].forEach(function(l4){
        var left = l4.slice(0,2);
        var right = l4.slice(2,4);

        if(left !== right && left !== reverse2(right)){
          results[l4] = true;
        }
      });
    }
  }

  Object.keys(results).forEach(function(numeroAuto){
    selectedLoteries.forEach(function(lot){
      mergeOrPushGame({
        type: "L4",
        numero: numeroAuto,
        loterie: lot,
        montant: parseFloat(montant) || 0
      });
    });
  });

  closeOptions();
  document.getElementById("overlay").classList.remove("show");
  renderJeux();
  updateFields();
}

function addGame(){
  if (!numero.trim()) return;
  if (!montant.trim()) return;
  if (selectedLoteries.length === 0) return;

  var entries = buildGameEntries(numero);

  if (!entries) {
    alert("Jeu pa valid");
    return;
  }

  selectedLoteries.forEach(function(lot){
    entries.forEach(function(entry){
      mergeOrPushGame({
        type: entry.type,
        numero: entry.numero,
        loterie: lot,
        montant: parseFloat(montant) || 0
      });
    });
  });

  numero = "";
  cursorNumero = 0;
  activeField = "numero";
  renderJeux();
  updateFields();
}

function renderJeux(){
  var area = document.getElementById("ticketsArea");

  if (jeux.length === 0) {
    area.innerHTML = '<div class="empty-zone">Pas de jeux</div>';
    document.getElementById("ticketCount").textContent = "0";
    document.getElementById("ticketTotal").textContent = "0.00";
    return;
  }

  var grouped = {};
  var total = 0;

  jeux.forEach(function(j){
    if (!grouped[j.loterie]) grouped[j.loterie] = [];
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
        '<div>' + j.type + '</div>' +
        '<div>' + j.numero + '</div>' +
        '<div>' + Number(j.montant).toFixed(2) + '</div>';

      row.onclick = function(){
        if (confirm("Supprimer ?")) {
          var idx = jeux.indexOf(j);
          if (idx >= 0) {
            jeux.splice(idx, 1);
            renderJeux();
          }
        }
      };

      area.appendChild(row);
    });
  });

  document.getElementById("ticketCount").textContent = String(jeux.length);
  document.getElementById("ticketTotal").textContent = total.toFixed(2);
}

function buildPrintText(){
  if (jeux.length === 0) return "";

  var total = 0;
  var lines = [];

  jeux.forEach(function(j){
    total += Number(j.montant) || 0;
    lines.push(j.type + " " + j.numero + " " + j.montant + " - " + j.loterie);
  });

  lines.push("------------------------------");
  lines.push("TOTAL: " + total.toFixed(2) + " G");
  lines.push("");
  lines.push("Bon chans");

  return lines.join("\\n");
}

function submitPrint(){
  var text = buildPrintText();
  if (!text) {
    alert("Pa gen jwèt pou enprime.");
    return;
  }

  document.getElementById("printData").value = text;
  document.getElementById("printForm").submit();
}

function shareWhatsApp(){
  var text = buildPrintText();
  if (!text) {
    alert("Pa gen jwèt pou voye.");
    return;
  }

  var url = "https://wa.me/?text=" + encodeURIComponent(text);
  window.open(url, "_blank");
}

function toggleDrawer(){
  document.getElementById("drawer").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("show");
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

app.post("/print", (req, res) => {
const raw = req.body.data || "";
const lines = raw
.split("\\n")
.map(line => line.trim())
.filter(line => line.length > 0);

let total = 0;

const formattedLines = lines.map(line => {
const parts = line.split(/\\s+/);

if (parts.length >= 3) {
const type = parts[0].toUpperCase();
const number = parts[1];
const amount = parseFloat(parts[2]);

if (!Number.isNaN(amount)) {
total += amount;
return type.padEnd(4, " ") + " " + String(number).padEnd(8, " ") + " " + amount.toFixed(2) + " G";
}
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
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Print</title>
<style>
body{
font-family: monospace;
font-size: 12px;
margin: 0;
padding: 4px;
width: 58mm;
}
@media print {
html, body{
height:auto !important;
overflow:visible !important;
}
}

pre{
margin:0;
white-space:pre-wrap;
word-break:break-word;
}
</style>
</head>
<body onload="window.print();setTimeout(function(){window.close();},400);">
<pre>NUMBER ONE LOTO
Date: \${dateStr}
Heure: \${timeStr}
------------------------------
\${formattedLines.join("\\n")}
------------------------------
TOTAL: \${total.toFixed(2)} G

Bon chans
</pre>
</body>
</html>
`);
});

app.listen(3000, "0.0.0.0", () => {
console.log("Server ap mache sou rezo a");
});