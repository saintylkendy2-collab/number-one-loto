const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const VENDEURS_FILE = path.join(__dirname, "vendeurs.json");
const TICKETS_FILE = path.join(__dirname, "tickets.json");

function ensureVendeursFile() {
  if (!fs.existsSync(VENDEURS_FILE)) {
    fs.writeFileSync(VENDEURS_FILE, JSON.stringify({}, null, 2), "utf8");
  }
}

function ensureTicketsFile() {
  if (!fs.existsSync(TICKETS_FILE)) {
    fs.writeFileSync(TICKETS_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

function loadVendeursForLogin() {
  try {
    ensureVendeursFile();
    const raw = fs.readFileSync(VENDEURS_FILE, "utf8").trim();
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed;
  } catch (err) {
    console.error("Erreur lecture vendeurs :", err);
    return {};
  }
}

function saveVendeursForLogin(vendeurs) {
  try {
    fs.writeFileSync(VENDEURS_FILE, JSON.stringify(vendeurs, null, 2), "utf8");
  } catch (err) {
    console.error("Erreur sauvegarde vendeurs :", err);
  }
}

function loadTickets() {
  try {
    ensureTicketsFile();
    const raw = fs.readFileSync(TICKETS_FILE, "utf8").trim();
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Erreur lecture tickets :", err);
    return [];
  }
}

function saveTickets(tickets) {
  try {
    fs.writeFileSync(TICKETS_FILE, JSON.stringify(tickets, null, 2), "utf8");
  } catch (err) {
    console.error("Erreur sauvegarde tickets :", err);
  }
}

function formatDateTimeFR(date = new Date()) {
  return date.toLocaleString("fr-FR");
}

function formatDateFR(date = new Date()) {
  return date.toLocaleDateString("fr-FR");
}

function formatTimeFR(date = new Date()) {
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function money(n) {
  return Number(n || 0).toFixed(2);
}

function loginErrorPage(message) {
  return `
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
<div class="msg">${message}</div>
<a href="/">Retour</a>
</div>
</body>
</html>
`;
}

function detectDeviceInfo(userAgent = "") {
  const ua = String(userAgent || "");
  const low = ua.toLowerCase();

  let marca = "DESCONOCIDO";
  let modelo = "WEB";
  let version = "?";
  let place = "?";

  if (low.includes("iphone")) {
    marca = "APPLE";
    modelo = "IPHONE";
    place = "TEL";
  } else if (low.includes("ipad")) {
    marca = "APPLE";
    modelo = "IPAD";
    place = "TAB";
  } else if (low.includes("android")) {
    marca = "ANDROID";
    modelo = "ANDROID";
    place = "TEL";
  } else if (low.includes("windows")) {
    marca = "PC";
    modelo = "WINDOWS";
    place = "PC";
  } else if (low.includes("macintosh") || low.includes("mac os")) {
    marca = "APPLE";
    modelo = "MAC";
    place = "PC";
  } else if (low.includes("linux")) {
    marca = "PC";
    modelo = "LINUX";
    place = "PC";
  }

  const chromeMatch = ua.match(/Chrome\/(\d+)/i);
  const safariMatch = ua.match(/Version\/(\d+)/i);
  const firefoxMatch = ua.match(/Firefox\/(\d+)/i);
  const edgMatch = ua.match(/Edg\/(\d+)/i);

  if (chromeMatch) version = chromeMatch[1];
  else if (safariMatch) version = safariMatch[1];
  else if (firefoxMatch) version = firefoxMatch[1];
  else if (edgMatch) version = edgMatch[1];

  return { marca, modelo, version, place };
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return String(forwarded).split(",")[0].trim();
  }
  return req.socket?.remoteAddress || req.connection?.remoteAddress || req.ip || "?";
}

function buildConnectionRow(req, vendeur) {
  const ua = req.headers["user-agent"] || "";
  const device = detectDeviceInfo(ua);
  const now = new Date();

  return {
    id: "DEV-" + Date.now(),
    marca: device.marca,
    modelo: device.modelo,
    version: device.version,
    app: vendeur.app || "2.9.32",
    vinculado: formatDateTimeFR(now),
    last: formatDateTimeFR(now),
    pin: Math.floor(Math.random() * 900) + 100,
    place: device.place,
    ip: getClientIp(req),
    userAgent: ua,
    co: true,
    on: true,
    st: true
  };
}

function normalizeStatus(status = "") {
  const s = String(status || "").trim().toUpperCase();

  if (s === "GANE" || s === "GANADO" || s === "GAGNE" || s === "WON" || s === "GANYE") return "GANYE";
  if (s === "PERDU" || s === "PERDIDO" || s === "LOST" || s === "PEDI") return "PEDI";
  if (s === "ANILE" || s === "ANULE" || s === "ANULADO" || s === "CANCELED") return "ANILE";

  return "ANATAN";
}

function statusLabel(status = "") {
  const s = normalizeStatus(status);
  if (s === "GANYE") return "GANYE";
  if (s === "PEDI") return "PEDI";
  if (s === "ANILE") return "ANILE";
  return "AN ATAN";
}

function getVendorCommissionRate(vendeurObj) {
  const general = Number(
    vendeurObj?.comision?.general ||
    vendeurObj?.comision?.generalComision ||
    vendeurObj?.comision?.generale ||
    0
  );
  if (general > 0) return general / 100;
  return 0.05;
}

function getTicketPremioValue(ticket) {
  const status = normalizeStatus(ticket.status);
  if (status !== "GANYE") return 0;
  return Number(ticket.premio || 0);
}

function computeSummaries() {
  const vendeurs = loadVendeursForLogin();
  const tickets = loadTickets();
  const map = {};

  tickets.forEach((ticket) => {
    const vendeurId = String(ticket.vendeur || "").trim().toUpperCase();
    if (!vendeurId) return;

    if (!map[vendeurId]) {
      const vendeurObj = vendeurs[vendeurId] || {};
      map[vendeurId] = {
        vendeur: vendeurId,
        nombre: String(vendeurObj.nom || vendeurObj.nombre || vendeurId),
        zona: String(vendeurObj.zona || vendeurObj.groupe || ""),
        venta: 0,
        premios: 0,
        comision: 0,
        resultado: 0,
        tickets: 0,
        balanceAnterior: Number(vendeurObj.config?.credito || 0),
        balanceFinal: 0
      };
    }

    const status = normalizeStatus(ticket.status);
    const total = Number(ticket.total || 0);
    const premio = getTicketPremioValue(ticket);

    if (status !== "ANILE") {
      map[vendeurId].venta += total;
      map[vendeurId].tickets += 1;
    }

    if (status === "GANYE") {
      map[vendeurId].premios += premio;
    }
  });

  Object.keys(map).forEach((id) => {
    const vendeurObj = vendeurs[id] || {};
    const rate = getVendorCommissionRate(vendeurObj);
    map[id].comision = map[id].venta * rate;
    map[id].resultado = map[id].venta - map[id].comision - map[id].premios;
    map[id].balanceFinal = map[id].balanceAnterior + map[id].resultado;
  });

  return Object.values(map);
}

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
<div class="note">Entrez votre ID vendeur et votre mot de passe</div>
</form>
</body>
</html>
`);
});

app.post("/login", (req, res) => {
  const id = String(req.body.id || "").trim().toUpperCase();
  const password = String(req.body.password || "").trim();

  const vendeurs = loadVendeursForLogin();
  const vendeur = vendeurs[id];

  if (!vendeur) {
    return res.send(loginErrorPage("ID pa egziste ✖"));
  }

  const savedPassword = String(vendeur.password || vendeur.clave || "").trim();
  if (password !== savedPassword) {
    return res.send(loginErrorPage("Identifiant ou mot de passe incorrect ✖"));
  }

  if (String(vendeur.estatus || "").toLowerCase() === "bloqueado") {
    return res.send(loginErrorPage("Vandè sa bloke ✖"));
  }

  if (!Array.isArray(vendeur.conexiones)) vendeur.conexiones = [];

  const connRow = buildConnectionRow(req, vendeur);

const activeConn = Array.isArray(vendeur.conexiones)
  ? vendeur.conexiones.find(c => c && c.st === true)
  : null;

if (activeConn) {
  const sameDevice =
    String(activeConn.userAgent || "") === String(connRow.userAgent || "") &&
    String(activeConn.place || "") === String(connRow.place || "") &&
    String(activeConn.marca || "") === String(connRow.marca || "") &&
    String(activeConn.modelo || "") === String(connRow.modelo || "");

  if (sameDevice) {
    activeConn.last = connRow.last;
    activeConn.vinculado = activeConn.vinculado || connRow.vinculado;
    activeConn.ip = connRow.ip;
    activeConn.userAgent = connRow.userAgent;
    activeConn.app = connRow.app;
    activeConn.co = true;
    activeConn.on = true;
    activeConn.st = true;

    vendeur.conexion = activeConn.last;
    if (!vendeur.app) vendeur.app = "2.9.32";

    saveVendeursForLogin(vendeurs);
    return res.redirect("/dashboard?id=" + encodeURIComponent(id));
  }

    return res.send(loginErrorPage("ID sa konekte deja ✖"));
}

vendeur.conexiones.push(connRow);
vendeur.conexion = connRow.last;
if (!vendeur.app) vendeur.app = "2.9.32";

saveVendeursForLogin(vendeurs);
return res.redirect("/dashboard?id=" + encodeURIComponent(id));
});

app.get("/logout", (req, res) => {
  const sellerId = String(req.query.id || "").trim().toUpperCase();
  if (sellerId) {
    const vendeurs = loadVendeursForLogin();
    const vendeur = vendeurs[sellerId];
    if (vendeur && Array.isArray(vendeur.conexiones)) {
      vendeur.conexiones = vendeur.conexiones.map((c) => ({
        ...c,
        co: false,
        on: false,
        st: false,
        last: formatDateTimeFR(new Date())
      }));
      vendeur.conexion = "";
      saveVendeursForLogin(vendeurs);
    }
  }
  res.redirect("/");
});

app.get("/api/vendor/:id/tickets", (req, res) => {
  const sellerId = String(req.params.id || "").trim().toUpperCase();
  const tickets = loadTickets()
    .filter((t) => String(t.vendeur || "").trim().toUpperCase() === sellerId)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  res.json(tickets);
});

app.get("/api/ticket/:id", (req, res) => {
  const id = String(req.params.id || "").trim();
  const tickets = loadTickets();
  const ticket = tickets.find((t) => String(t.id) === id);
  res.json(ticket || {});
});

app.post("/api/tickets", (req, res) => {
  const sellerId = String(req.body.sellerId || "").trim().toUpperCase();
  const sellerName = String(req.body.sellerName || sellerId || "VENDEUR");
  const jeux = Array.isArray(req.body.jeux) ? req.body.jeux : [];
  const channel = String(req.body.channel || "MANUEL").trim().toUpperCase();

  if (!sellerId) {
    return res.status(400).json({ ok: false, message: "sellerId obligatoire" });
  }

  if (!jeux.length) {
    return res.status(400).json({ ok: false, message: "Pa gen jwèt" });
  }

  const safeJeux = jeux.map((j) => ({
    type: String(j.type || "").trim(),
    numero: String(j.numero || "").trim(),
    loterie: String(j.loterie || "").trim(),
    montant: Number(j.montant || 0)
  })).filter((j) => j.type && j.numero && j.loterie && j.montant > 0);

  if (!safeJeux.length) {
    return res.status(400).json({ ok: false, message: "Jwèt yo pa valid" });
  }

  const now = new Date();
  const total = safeJeux.reduce((sum, j) => sum + Number(j.montant || 0), 0);
  const tirages = [...new Set(safeJeux.map((j) => j.loterie))];
  const ticketId = String(Date.now()).slice(-8) + "-" + Math.floor(1000 + Math.random() * 9000);

  const ticket = {
    id: ticketId,
    vendeur: sellerId,
    vendeurNom: sellerName,
    createdAt: now.toISOString(),
    createdAtLabel: formatDateTimeFR(now),
    dateLabel: formatDateFR(now),
    timeLabel: formatTimeFR(now),
    status: "ANATAN",
    premio: 0,
    channel,
    total,
    tirages,
    jeux: safeJeux
  };

  const tickets = loadTickets();
  tickets.push(ticket);
  saveTickets(tickets);

  res.json({ ok: true, ticket });
});

app.post("/api/ticket-status", (req, res) => {
  const ticketId = String(req.body.id || "").trim();
  const status = normalizeStatus(req.body.status);
  const premio = Number(req.body.premio || 0);

  const tickets = loadTickets();
  const ticket = tickets.find((t) => String(t.id) === ticketId);

  if (!ticket) {
    return res.status(404).json({ ok: false, message: "Ticket introuvable" });
  }

  const currentStatus = normalizeStatus(ticket.status);

  if (status === "ANILE") {
    const createdAt = new Date(ticket.createdAt || Date.now()).getTime();
    const now = Date.now();
    const diffMinutes = (now - createdAt) / 60000;

    if (diffMinutes > 10) {
      return res.json({
        ok: false,
        message: "Ou pa ka anile ticket sa ankò. 10 minit yo pase."
      });
    }

    if (currentStatus === "GANYE" || currentStatus === "PEDI") {
      return res.json({
        ok: false,
        message: "Ticket sa deja trete."
      });
    }
  }

  ticket.status = status;
  ticket.updatedAt = new Date().toISOString();

  if (status === "GANYE") {
    ticket.premio = premio > 0 ? premio : Number(ticket.premio || 0);
  } else {
    ticket.premio = 0;
  }

  saveTickets(tickets);
  res.json({ ok: true, ticket });
});


app.get("/api/master/ventas-summary", (req, res) => {
  res.json(computeSummaries());
});

app.get("/api/master/balance-summary", (req, res) => {
  const summaries = computeSummaries().map((x) => ({
    vendeur: x.vendeur,
    nombre: x.nombre,
    balanceAnterior: x.balanceAnterior,
    resultado: x.resultado,
    balanceFinal: x.balanceFinal
  }));
  res.json(summaries);
});

app.get("/dashboard", (req, res) => {
  const sellerId = String(req.query.id || "").trim().toUpperCase();
  const vendeurs = loadVendeursForLogin();
  const vendeur = vendeurs[sellerId] || {};
  const sellerName = String(vendeur.nom || vendeur.nombre || sellerId || "VENDEUR");

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
body{color:#111;}
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
grid-template-columns:60px 1fr 150px;
align-items:center;
}
.top-left,.top-right{
display:flex;
align-items:center;
justify-content:center;
gap:12px;
font-size:24px;
user-select:none;
}
.top-title{
text-align:center;
font-size:24px;
font-weight:800;
white-space:nowrap;
overflow:hidden;
text-overflow:ellipsis;
padding:0 6px;
}
.icon-btn{cursor:pointer;}
.main{
flex:1;
min-height:0;
display:flex;
flex-direction:column;
overflow:hidden;
}
.page{
flex:1;
min-height:0;
display:none;
flex-direction:column;
}
.page.active{display:flex;}
.tickets-area{
flex:1;
min-height:60px;
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
font-weight:700;
padding:6px 8px;
background:#e6e6f0;
line-height:1.1;
}
.ticket-row{
display:grid;
grid-template-columns:60px 1fr 80px;
align-items:center;
padding:6px 10px;
font-size:14px;
background:#fff;
border-bottom:1px solid #ececec;
}
.ticket-row div{text-align:center;}
.ticket-row div:first-child{
font-weight:700;
text-align:left;
}
.ticket-row div:last-child{
text-align:right;
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
height:240px;
min-height:240px;
display:grid;
grid-template-columns:repeat(4,1fr);
grid-template-rows:repeat(4,1fr);
border-top:1px solid #cacaca;
margin-top:4px;
flex-shrink:0;
}
.key{
border:1px solid #cacaca;
background:#f7f7f7;
display:flex;
align-items:center;
justify-content:center;
font-size:24px;
color:#000;
user-select:none;
touch-action:manipulation;
cursor:pointer;
}
.key:active{background:#e3e3e3;}
.key.enter{
background:#f7f7f7;
color:#000;
font-size:22px;
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
.nav-item{
cursor:pointer;
padding:4px 2px;
}
.nav-item.active{
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
.overlay.show{display:block;}
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
.drawer.open{left:0;}
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
.options-sheet.open{bottom:0;}
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
.loterie-modal.show{display:flex;}
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
.loterie-item.selected .loterie-check{background:#355af2;}
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
.hidden-print-form{display:none;}

.billets-wrap{
flex:1;
overflow:auto;
padding:10px;
}
.billet-card{
background:#fff;
border-radius:14px;
padding:12px;
margin-bottom:10px;
box-shadow:0 4px 12px rgba(0,0,0,.05);
}
.billet-head{
display:flex;
justify-content:space-between;
gap:10px;
align-items:flex-start;
margin-bottom:8px;
}
.billet-code{
font-size:17px;
font-weight:800;
color:#222;
}
.billet-meta{
font-size:13px;
color:#666;
line-height:1.4;
}
.status-badge{
padding:6px 10px;
border-radius:999px;
font-size:12px;
font-weight:800;
white-space:nowrap;
}
.st-anatan{background:#fff3cd;color:#8a6d00;}
.st-ganye{background:#d1f7de;color:#157347;}
.st-pedi{background:#ffe0e0;color:#b42318;}
.st-anile{background:#ececec;color:#555;}
.billet-game{
display:grid;
grid-template-columns:70px 1fr 70px;
gap:6px;
font-size:14px;
padding:4px 0;
border-bottom:1px dashed #eee;
}
.billet-game:last-child{border-bottom:none;}
.billet-actions{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:8px;
margin-top:10px;
}
.small-btn{
border:none;
border-radius:10px;
padding:10px 6px;
font-size:13px;
font-weight:800;
cursor:pointer;
}
.btn-yellow{background:#fff3cd;color:#8a6d00;}
.btn-green{background:#d1f7de;color:#157347;}
.btn-red{background:#ffe0e0;color:#b42318;}
.btn-gray{background:#ececec;color:#555;}
.total-line{
margin-top:8px;
text-align:right;
font-size:15px;
font-weight:800;
}
.copy-wrap{
padding:14px;
display:flex;
flex-direction:column;
gap:12px;
}
.copy-input{
height:52px;
border:1px solid #d6d6d6;
border-radius:12px;
padding:0 14px;
font-size:18px;
background:#fff;
}
.copy-btn{
height:52px;
border:none;
border-radius:12px;
background:#3452aa;
color:#fff;
font-size:18px;
font-weight:800;
cursor:pointer;
}
.copy-note{
font-size:14px;
color:#666;
line-height:1.5;
}
@media (min-width:900px){
body{background:#dfe3ea;}
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
<div class="top-title">${sellerName}</div>
<div class="top-right">
<span class="icon-btn" onclick="submitPrint()">🖨️</span>
<span class="icon-btn" onclick="shareWhatsApp()">🟢</span>
<span class="icon-btn" onclick="openOptions()">⋮</span>
</div>
</div>

<div class="main">

<div id="salePage" class="page active">
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
<div class="key" onclick="press('+')" ontouchstart="press('+'); return false;">+</div>
<div class="key" onclick="press('1')" ontouchstart="press('1'); return false;">1</div>
<div class="key" onclick="press('2')" ontouchstart="press('2'); return false;">2</div>
<div class="key" onclick="press('3')" ontouchstart="press('3'); return false;">3</div>

<div class="key" onclick="press('-')" ontouchstart="press('-'); return false;">-</div>
<div class="key" onclick="press('4')" ontouchstart="press('4'); return false;">4</div>
<div class="key" onclick="press('5')" ontouchstart="press('5'); return false;">5</div>
<div class="key" onclick="press('6')" ontouchstart="press('6'); return false;">6</div>

<div class="key" onclick="press('/')" ontouchstart="press('/'); return false;">/</div>
<div class="key" onclick="press('7')" ontouchstart="press('7'); return false;">7</div>
<div class="key" onclick="press('8')" ontouchstart="press('8'); return false;">8</div>
<div class="key" onclick="press('9')" ontouchstart="press('9'); return false;">9</div>

<div class="key" onclick="press('.')" ontouchstart="press('.'); return false;">.</div>
<div class="key" onclick="backspaceKey()" ontouchstart="backspaceKey(); return false;">⌫</div>
<div class="key" onclick="press('0')" ontouchstart="press('0'); return false;">0</div>
<div class="key enter" onclick="handleEnter()" ontouchstart="handleEnter(); return false;">ENTER</div>
</div>
</div>

<div id="billetsPage" class="page">
<div id="billetsWrap" class="billets-wrap">
<div class="empty-zone">Pa gen billet</div>
</div>
</div>

<div id="copierPage" class="page">
<div class="copy-wrap">
<input id="copyTicketId" class="copy-input" placeholder="Mete nimewo seri ticket la">
<button class="copy-btn" onclick="handleCopyButton()">Copie exacte</button>
<button class="copy-btn" onclick="handleCopyLoterie()">Changer loterie</button>
<div class="copy-note">
Mete nimewo seri ticket la. Si ticket la egziste, jwèt yo ap remonte nan ekran an pou rekopye yo.
</div>
</div>
</div>

<div id="payerPage" class="page">
<div class="empty-zone">Payer ap vini</div>
</div>

<div id="rapportsPage" class="page">
<div class="empty-zone">Rapports ap vini</div>
</div>

<div id="drawer" class="drawer">
<div class="drawer-head">NUMBER ONE LOTO</div>
<div class="drawer-item">Tirages</div>
<div class="drawer-item">Balance</div>
<div class="drawer-item">Paramètre</div>
<div class="drawer-item">Imprimante</div>
<div class="drawer-item">Update</div>
<div class="drawer-item" onclick="window.location='/logout?id=${encodeURIComponent(sellerId)}'">Sortir</div>
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
<input type="hidden" name="ticketId" id="printTicketId">
<input type="hidden" name="sellerId" value="${sellerId}">
</form>

<div class="bottom-nav">
<div id="nav-billets" class="nav-item active" onclick="switchPage('billetsPage', this)">Billets</div>
<div id="nav-copier" class="nav-item" onclick="switchPage('copierPage', this)">Copier</div>
<div id="nav-payer" class="nav-item" onclick="switchPage('payerPage', this)">Payer</div>
<div id="nav-rapports" class="nav-item" onclick="switchPage('rapportsPage', this)">Rapports</div>
<div id="nav-menu" class="nav-item" onclick="toggleDrawer()">Menu</div>
</div>
</div>

<script>
var sellerId = ${JSON.stringify(sellerId)};
var sellerName = ${JSON.stringify(sellerName)};

var activeField = "numero";
var numero = "";
var montant = "";
var jeux = [];
var selectedLoteries = [];
var cursorNumero = 0;
var cursorMontant = 0;
var pendingChoiceNumber = "";
var tempChoices = [];
var savedTickets = [];
var currentPageName = "salePage";

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
 if(field === "numero") cursorNumero = value;
 else cursorMontant = value;
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

 if(field === "numero") cursorNumero = numero.length;
 if(field === "montant") cursorMontant = montant.length;

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
}

function hideChoicePanel(){
 document.getElementById("choicePanel").style.display = "none";
 document.getElementById("choiceList").innerHTML = "";
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
 if(document.getElementById("choicePanel").style.display === "block"){
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

 if(activeField === "numero"){
   if(!numero.trim()) return;

   if(selectedLoteries.length > 0){
     activeField = "montant";
     cursorMontant = montant.length;
     updateFields();
     return;
   }

   activeField = "loterie";
   updateFields();
   openLoterieModal();
   return;
 }

 if(activeField === "loterie"){
   validateLoteries();
   return;
 }

 if(activeField === "montant"){
   if(!montant.trim()) return;
   addGame();
   return;
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

 if(selectedLoteries.length === 0){
   activeField = "loterie";
   updateFields();
   openLoterieModal();
   return;
 }

 activeField = "montant";
 cursorMontant = montant.length;
 updateFields();
}

function toggleLoterie(name){
 var idx = selectedLoteries.indexOf(name);

 if(idx >= 0) selectedLoteries.splice(idx, 1);
 else selectedLoteries.push(name);

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

 if(/^\\d{2}$/.test(num)){
   return [{ type: "BOR", numero: num }];
 }

 if(/^\\d{2}\\/$/.test(num)){
   return buildSlashMarriageEntries(num);
 }

 if(/^\\d{3}$/.test(num)){
   return [{ type: "L3", numero: num }];
 }

 if(/^\\d{4}$/.test(num)){
   return [{ type: "MAR", numero: num.slice(0,2) + "*" + num.slice(2,4) }];
 }

 if(/^\\d{4}\\/$/.test(num)){
   return buildSlashMarriageEntries(num);
 }

 if(/^\\d{4}\\+(L1|L2|L3)(,(L1|L2|L3))*$/.test(num)){
   var raw4 = num.split("+")[0];
   var types4 = uniqueStrings(num.split("+")[1].split(","));
   return types4.map(function(t){
     return { type: t, numero: raw4 };
   });
 }

 if(/^\\d{5}\\+(L1|L2|L3)(,(L1|L2|L3))*$/.test(num)){
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
 if(!numero.trim()) return;
 if(!montant.trim()) return;
 if(selectedLoteries.length === 0) return;

 var entries = buildGameEntries(numero);

 if(!entries){
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

 if(jeux.length === 0){
   area.innerHTML = '<div class="empty-zone">Pas de jeux</div>';
   document.getElementById("ticketCount").textContent = "0";
   document.getElementById("ticketTotal").textContent = "0.00";
   return;
 }

 var grouped = {};
 var total = 0;

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
       '<div>' + j.type + '</div>' +
       '<div>' + j.numero + '</div>' +
       '<div>' + Number(j.montant).toFixed(2) + '</div>';

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

 document.getElementById("ticketCount").textContent = String(jeux.length);
 document.getElementById("ticketTotal").textContent = total.toFixed(2);
}

function buildPayloadGames(){
 return jeux.map(function(j){
   return {
     type: j.type,
     numero: j.numero,
     loterie: j.loterie,
     montant: Number(j.montant || 0)
   };
 });
}

function buildPrintableTextFromTicket(ticket){
 if(!ticket || !Array.isArray(ticket.jeux)) return "";

 var lines = [];

 ticket.jeux.forEach(function(j){
   lines.push(j.type + " " + j.numero + " " + Number(j.montant).toFixed(2) + " - " + j.loterie);
 });

 return lines.join("\\n");
}

function resetAfterSend(){
 jeux = [];
 numero = "";
 montant = "";
 cursorNumero = 0;
 cursorMontant = 0;
 selectedLoteries = [];

 activeField = "numero";

 renderJeux();
 updateFields();
}


function saveCurrentTicket(channel){
 if(jeux.length === 0){
   alert("Pa gen jwèt pou voye.");
   return Promise.resolve(null);
 }

 return fetch("/api/tickets", {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({
     sellerId: sellerId,
     sellerName: sellerName,
     jeux: buildPayloadGames(),
     channel: channel || "MANUEL"
   })
 }).then(function(res){
   return res.json();
 }).then(function(data){
   if(!data.ok){
     alert(data.message || "Erreur save ticket");
     return null;
   }
   return data.ticket;
 }).catch(function(){
   alert("Erreur save ticket");
   return null;
 });
}

function submitPrint(){
  var printWin = window.open("", "_blank");

  saveCurrentTicket("PRINT").then(function(ticket){
    if(!ticket){
      if(printWin) printWin.close();
      return;
    }

    if(printWin){
      printWin.location.href =
        "/print?ticketId=" + encodeURIComponent(ticket.id) +
        "&sellerId=" + encodeURIComponent(sellerId);
    }

    loadBillets();
    resetAfterSend();
  }).catch(function(){
    if(printWin) printWin.close();
    alert("Erreur impression");
  });
}

function shareWhatsApp(){
  var waWin = window.open("", "_blank");

  saveCurrentTicket("WHATSAPP").then(function(ticket){
    if(!ticket){
      if(waWin) waWin.close();
      return;
    }

    var text = buildPrintableTextFromTicket(ticket);
    var url = "https://wa.me/?text=" + encodeURIComponent(text);

    if(waWin){
      waWin.location.href = url;
    }

    loadBillets();
    resetAfterSend();
  }).catch(function(){
    if(waWin) waWin.close();
    alert("Erreur WhatsApp");
  });
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

function switchPage(pageId, el){
  if(pageId === "billetsPage" && currentPageName === "billetsPage"){
    pageId = "salePage";
  }

  currentPageName = pageId;

  document.querySelectorAll(".page").forEach(function(p){
    p.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");

  document.querySelectorAll(".nav-item").forEach(function(n){
    n.classList.remove("active");
  });

  if(el) el.classList.add("active");

  if(pageId === "billetsPage"){
    loadBillets();
  }
}

function statusClass(status){
 var s = String(status || "").toUpperCase();
 if(s === "GANYE") return "st-ganye";
 if(s === "PEDI") return "st-pedi";
 if(s === "ANILE") return "st-anile";
 return "st-anatan";
}

function statusLabel(status){
 var s = String(status || "").toUpperCase();
 if(s === "GANYE") return "GANYE";
 if(s === "PEDI") return "PEDI";
 if(s === "ANILE") return "ANILE";
 return "AN ATAN";
}

function loadBillets(){
 fetch("/api/vendor/" + encodeURIComponent(sellerId) + "/tickets")
 .then(function(res){ return res.json(); })
 .then(function(rows){
 savedTickets = Array.isArray(rows) ? rows : [];
 renderBillets();
 renderRapports();
 })
 .catch(function(){
 savedTickets = [];
 renderBillets();
 renderRapports();
 });
}


var selectedTicketToCopy = null;
var copyMode = false;

function feedbackTouch(){
  if(navigator.vibrate){
    navigator.vibrate(40);
  }
}

function renderBillets(){
  var wrap = document.getElementById("billetsWrap");

  if(!savedTickets.length){
    wrap.innerHTML = '<div class="empty-zone">Pa gen billet</div>';
    return;
  }

  wrap.innerHTML = "";

  savedTickets.forEach(function(t){
    var card = document.createElement("div");
    card.className = "billet-card";

    var premioTotal = Number(t.premio || 0);
    var premioTxt = premioTotal > 0
      ? '<div class="billet-meta" style="font-weight:800;color:#157347;">Gain total: ' + premioTotal.toFixed(2) + '</div>'
      : '';

    card.innerHTML =
      '<div class="billet-head">' +
        '<div>' +
          '<div class="billet-code">#' + t.id + '</div>' +
          '<div class="billet-meta">' + (t.createdAtLabel || '') + '</div>' +
          '<div class="billet-meta">Total: ' + Number(t.total || 0).toFixed(2) + '</div>' +
          premioTxt +
        '</div>' +
        '<div class="status-badge ' + statusClass(t.status) + '">' + statusLabel(t.status) + '</div>' +
      '</div>';

    if(Array.isArray(t.jeux)){
      t.jeux.forEach(function(j){
        var gain = Number(j.gain || j.premio || 0);

        var row = document.createElement("div");
        row.className = "billet-game";
        row.innerHTML =
          '<div>' + j.type + '</div>' +
          '<div>' + j.numero + ' - ' + j.loterie +
          (gain > 0 ? '<div style="font-size:13px;font-weight:800;color:#157347;margin-top:3px;">Gain: ' + gain.toFixed(2) + '</div>' : '') +
          '</div>' +
          '<div style="text-align:right">' + Number(j.montant || 0).toFixed(2) + '</div>';

        card.appendChild(row);
      });
    }

    var actions = document.createElement("div");
    actions.className = "billet-actions";
    actions.style.gridTemplateColumns = "repeat(4,1fr)";
    actions.innerHTML =
      '<button class="small-btn btn-green">COPIE</button>' +
      '<button class="small-btn btn-yellow">LOTERIE</button>' +
      '<button class="small-btn btn-yellow">MONTANT</button>' +
      '<button class="small-btn btn-gray">ANILE</button>';

    var btns = actions.querySelectorAll("button");

    btns[0].onclick = function(e){
      e.stopPropagation();
      feedbackTouch();
      copyFromTicket(t);
    };

    btns[1].onclick = function(e){
      e.stopPropagation();
      feedbackTouch();
      selectedTicketToCopy = t;
      copyMode = true;
      selectedLoteries = [];
      activeField = "loterie";
      updateFields();
      openLoterieModal();
    };

    btns[2].onclick = function(e){
      e.stopPropagation();
      feedbackTouch();

      var newMontant = prompt("Mete nouvo montant lan:");
      if(newMontant === null) return;

      newMontant = Number(newMontant || 0);
      if(newMontant <= 0){
        alert("Montant pa valid");
        return;
      }

      copyFromTicketWithMontant(t, newMontant);
    };

    btns[3].onclick = function(e){
      e.stopPropagation();
      feedbackTouch();

      if(confirm("Ou sèten ou vle anile ticket sa?")){
        updateTicketStatus(t.id, "ANILE");
      }
    };

    card.appendChild(actions);
    wrap.appendChild(card);
  });
}

function copyFromTicket(ticket){
  if(!ticket || !Array.isArray(ticket.jeux)){
    alert("Ticket pa valid");
    return;
  }

  jeux = [];
  selectedLoteries = [];
  numero = "";
  montant = "";
  cursorNumero = 0;
  cursorMontant = 0;
  activeField = "numero";

  ticket.jeux.forEach(function(j){
    jeux.push({
      type: j.type,
      numero: j.numero,
      loterie: j.loterie,
      montant: Number(j.montant || 0)
    });

    if(selectedLoteries.indexOf(j.loterie) < 0){
      selectedLoteries.push(j.loterie);
    }
  });

  renderJeux();
  updateFields();
  switchPage("salePage", document.getElementById("nav-billets"));
}

function copyFromTicketWithMontant(ticket, newMontant){
  if(!ticket || !Array.isArray(ticket.jeux)){
    alert("Ticket pa valid");
    return;
  }

  jeux = [];
  selectedLoteries = [];
  numero = "";
  montant = "";
  cursorNumero = 0;
  cursorMontant = 0;
  activeField = "numero";

  ticket.jeux.forEach(function(j){
    jeux.push({
      type: j.type,
      numero: j.numero,
      loterie: j.loterie,
      montant: Number(newMontant || 0)
    });

    if(selectedLoteries.indexOf(j.loterie) < 0){
      selectedLoteries.push(j.loterie);
    }
  });

  renderJeux();
  updateFields();
  switchPage("salePage", document.getElementById("nav-billets"));
}

function validateLoteries(){
  document.getElementById("loterieModal").classList.remove("show");
  document.getElementById("overlay").classList.remove("show");

  if(selectedLoteries.length === 0){
    activeField = "loterie";
    updateFields();
    openLoterieModal();
    return;
  }

  if(copyMode && selectedTicketToCopy){
    jeux = [];
    numero = "";
    montant = "";
    cursorNumero = 0;
    cursorMontant = 0;
    activeField = "numero";

    selectedTicketToCopy.jeux.forEach(function(j){
      selectedLoteries.forEach(function(lot){
        jeux.push({
          type: j.type,
          numero: j.numero,
          loterie: lot,
          montant: Number(j.montant || 0)
        });
      });
    });

    copyMode = false;
    selectedTicketToCopy = null;

    renderJeux();
    updateFields();
    switchPage("salePage", document.getElementById("nav-billets"));
    return;
  }

  activeField = "montant";
  cursorMontant = montant.length;
  updateFields();
}

function handleCopyButton(){
  alert("Kounya kopye fèt dirèk sou biyè a.");
}

function handleCopyLoterie(){
  alert("Kounya chanje loterie fèt dirèk sou biyè a.");
}





function renderRapports(){
  var box = document.getElementById("rapportsPage");
  if(!box) return;

  function toIsoDay(value){
    var d = new Date(value || new Date());
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function toFr(iso){
    if(!iso) return "";
    var p = iso.split("-");
    if(p.length !== 3) return iso;
    return p[2] + "/" + p[1] + "/" + p[0];
  }

  var oldStart = document.getElementById("rapportDateStart");
  var oldEnd = document.getElementById("rapportDateEnd");

  var todayStr = toIsoDay(new Date());
  var startValue = oldStart ? oldStart.value : todayStr;
  var endValue = oldEnd ? oldEnd.value : todayStr;

  var filtered = savedTickets.filter(function(t){
    var d = toIsoDay(t.createdAt || new Date());
    return d >= startValue && d <= endValue;
  });

  var vente = 0;
  var prime = 0;

  var byDay = {};
  var byLoterie = {};

  filtered.forEach(function(t){
    var st = String(t.status || "").toUpperCase();
    if(st === "ANILE") return;

    var total = Number(t.total || 0);
    var premio = st === "GANYE" ? Number(t.premio || 0) : 0;
    var dayKey = toIsoDay(t.createdAt || new Date());

    vente += total;
    prime += premio;

    if(!byDay[dayKey]){
      byDay[dayKey] = { vente: 0, prime: 0 };
    }
    byDay[dayKey].vente += total;
    byDay[dayKey].prime += premio;

    (t.jeux || []).forEach(function(j){
      var lot = String(j.loterie || "").trim() || "SANS TIRAGE";
      var amt = Number(j.montant || 0);

      if(!byLoterie[lot]){
        byLoterie[lot] = { vente: 0, prime: 0 };
      }
      byLoterie[lot].vente += amt;
    });
  });

  var commission = 0; // kite master panel jere sa
var resultat = vente - prime;

  var daysHtml = "";
  var sortedDays = Object.keys(byDay).sort();
  sortedDays.forEach(function(day){
    var d = byDay[day];
    var dCommission = 0;
var dBalance = d.vente - d.prime;

    daysHtml +=
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;font-size:18px;margin-bottom:18px;">' +
        '<div>' + d.vente.toFixed(2) + '<div style="font-size:15px;color:#666;margin-top:4px;">' + dCommission.toFixed(2) + '</div></div>' +
        '<div>' + d.prime.toFixed(2) + '</div>' +
        '<div>' + dBalance.toFixed(2) + '<div style="font-size:15px;color:#666;margin-top:4px;">' + toFr(day) + '</div></div>' +
      '</div>';
  });

  if(!daysHtml){
    daysHtml =
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;font-size:18px;margin-bottom:18px;">' +
        '<div>0.00<div style="font-size:15px;color:#666;margin-top:4px;">0.00</div></div>' +
        '<div>0.00</div>' +
        '<div>0.00<div style="font-size:15px;color:#666;margin-top:4px;">' + toFr(endValue) + '</div></div>' +
      '</div>';
  }

  var loterieHtml = "";
  var lotKeys = Object.keys(byLoterie).sort();
  lotKeys.forEach(function(lot){
    var l = byLoterie[lot];
    var lCommission = l.vente * 0.15;
    var lBalance = l.vente - l.prime - lCommission;

    loterieHtml +=
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;font-size:18px;margin-bottom:18px;">' +
        '<div>' + l.vente.toFixed(2) + '<div style="font-size:15px;color:#666;margin-top:4px;">' + lCommission.toFixed(2) + '</div></div>' +
        '<div>' + l.prime.toFixed(2) + '</div>' +
        '<div>' + lBalance.toFixed(2) + '<div style="font-size:15px;color:#666;margin-top:4px;">' + lot + '</div></div>' +
      '</div>';
  });

  if(!loterieHtml){
    loterieHtml =
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;font-size:18px;margin-bottom:18px;">' +
        '<div>' + vente.toFixed(2) + '<div style="font-size:15px;color:#666;margin-top:4px;">' + commission.toFixed(2) + '</div></div>' +
        '<div>' + prime.toFixed(2) + '</div>' +
        '<div>' + resultat.toFixed(2) + '</div>' +
      '</div>';
  }

  box.innerHTML =
  '<div style="height:100%;display:flex;flex-direction:column;background:#f5f5f5;">' +

    '<div style="height:58px;min-height:58px;background:#2f49d1;color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 14px;">' +
      '<button id="rapportBackBtn" type="button" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer;">←</button>' +
      '<div style="font-size:22px;font-weight:700;">Rapports</div>' +
      '<div style="display:flex;gap:18px;align-items:center;">' +
        '<button id="rapportPrintBtn" type="button" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">🖨️</button>' +
        '<button id="rapportRefreshBtn" type="button" style="background:none;border:none;color:#fff;font-size:22px;cursor:pointer;">↻</button>' +
      '</div>' +
    '</div>' +

    '<div style="padding:14px;overflow:auto;flex:1;">' +

      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px;">' +
        '<input id="rapportDateStart" type="date" value="' + startValue + '" style="width:100%;border:none;border-bottom:1px solid #999;background:transparent;padding:10px 0;font-size:18px;outline:none;">' +
        '<input id="rapportDateEnd" type="date" value="' + endValue + '" style="width:100%;border:none;border-bottom:1px solid #999;background:transparent;padding:10px 0;font-size:18px;outline:none;">' +
      '</div>' +

      '<div style="background:#fff;padding:18px 16px;margin-bottom:18px;">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;row-gap:8px;font-size:18px;line-height:1.5;">' +
          '<div style="text-align:center;font-weight:700;">Ventes</div><div style="text-align:center;font-weight:700;">' + vente.toFixed(2) + '</div>' +
          '<div style="text-align:center;font-weight:700;">Prix</div><div style="text-align:center;font-weight:700;">' + prime.toFixed(2) + '</div>' +
          '<div style="text-align:center;font-weight:700;">Commission</div><div style="text-align:center;font-weight:700;">' + commission.toFixed(2) + '</div>' +
          '<div style="text-align:center;font-weight:700;">Résultat</div><div style="text-align:center;font-weight:700;">' + resultat.toFixed(2) + '</div>' +
        '</div>' +
      '</div>' +

      '<div style="background:#fff;padding:18px 16px;margin-bottom:18px;text-align:center;">' +
        '<div style="font-size:22px;font-weight:700;margin-bottom:18px;">RESUMEN POR DÍA</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;font-size:18px;margin-bottom:14px;">' +
          '<div>VENTE</div>' +
          '<div>PRIME</div>' +
          '<div>BALANCE</div>' +
        '</div>' +
        daysHtml +
      '</div>' +

      '<div style="background:#fff;padding:18px 16px;text-align:center;">' +
        '<div style="font-size:22px;font-weight:700;margin-bottom:18px;">RESUMEN POR LOTERÍA</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;font-size:18px;margin-bottom:14px;">' +
          '<div>VENTE</div>' +
          '<div>PRIME</div>' +
          '<div>BALANCE</div>' +
        '</div>' +
        loterieHtml +
      '</div>' +

    '</div>' +
  '</div>';

  var backBtn = document.getElementById("rapportBackBtn");
  var refreshBtn = document.getElementById("rapportRefreshBtn");
  var printBtn = document.getElementById("rapportPrintBtn");
  var startInput = document.getElementById("rapportDateStart");
  var endInput = document.getElementById("rapportDateEnd");

  if(backBtn){
    backBtn.addEventListener("click", function(){
      switchPage("billetsPage", document.getElementById("nav-billets"));
    });
  }

  if(refreshBtn){
    refreshBtn.addEventListener("click", function(){
      loadBillets();
    });
  }

  if(printBtn){
    printBtn.addEventListener("click", function(){
      window.print();
    });
  }

  if(startInput){
    startInput.addEventListener("change", function(){
      renderRapports();
    });
  }

  if(endInput){
    endInput.addEventListener("change", function(){
      renderRapports();
    });
  }
}


function updateTicketStatus(id, status, premio){
 fetch("/api/ticket-status", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
   id: id,
   status: status,
   premio: premio || 0
 })
 }).then(function(res){
 return res.json();
 }).then(function(){
 loadBillets();
 }).catch(function(){
 alert("Erreur mise à jour status");
 });
}

function copyTicketById(){
 var id = document.getElementById("copyTicketId").value.trim();
 if(!id){
 alert("Mete nimewo seri a");
 return;
 }

 fetch("/api/ticket/" + encodeURIComponent(id))
 .then(function(res){ return res.json(); })
 .then(function(ticket){
 if(!ticket || !ticket.id){
   alert("Ticket pa jwenn");
   return;
 }

 jeux = [];
 selectedLoteries = [];
 numero = "";
 cursorNumero = 0;
 activeField = "numero";

 if(Array.isArray(ticket.jeux)){
   ticket.jeux.forEach(function(j){
     jeux.push({
       type: j.type,
       numero: j.numero,
       loterie: j.loterie,
       montant: Number(j.montant || 0)
     });

     if(selectedLoteries.indexOf(j.loterie) < 0){
       selectedLoteries.push(j.loterie);
     }
   });
 }

 renderJeux();
 updateFields();
 switchPage("salePage", document.getElementById("nav-billets"));
 })
 .catch(function(){
 alert("Erreur lecture ticket");
 });
}



 (function(){
  var autoBoulPeMode = false;

  var overlay = document.getElementById("overlay");
  var sheet = document.getElementById("optionsSheet");

  if(overlay){
    overlay.onclick = function(){
      closeDrawer();
      closeOptions();
      overlay.classList.remove("show");
    };
  }

  if(sheet && !document.getElementById("boulPeOption")){
    var items = sheet.querySelectorAll(".sheet-item");
    var boulPe = document.createElement("div");
    boulPe.id = "boulPeOption";
    boulPe.className = "sheet-item";
    boulPe.textContent = "Boul pè";
    boulPe.onclick = function(){
      autoBoulPeMode = true;
      closeOptions();
      document.getElementById("overlay").classList.remove("show");

      activeField = "montant";
      cursorMontant = montant.length;
      updateFields();
    };

    items.forEach(function(item){
      if(item.textContent.trim() === "Loto 4 chif otomatik"){
        item.parentNode.insertBefore(boulPe, item.nextSibling);
      }
    });
  }

  var oldHandleEnter = handleEnter;

  handleEnter = function(){
    if(document.getElementById("choicePanel").style.display === "block"){
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

    if(activeField === "numero"){
      if(!numero.trim()) return;

      if(selectedLoteries.length > 0){
        activeField = "montant";
        cursorMontant = montant.length;
        updateFields();
        return;
      }

      activeField = "loterie";
      updateFields();
      openLoterieModal();
      return;
    }

    if(activeField === "loterie"){
      validateLoteries();
      return;
    }

    if(activeField === "montant"){
      if(!montant.trim()) return;

      if(autoBoulPeMode){
        if(selectedLoteries.length === 0){
          activeField = "loterie";
          updateFields();
          openLoterieModal();
          return;
        }

        ["00","11","22","33","44","55","66","77","88","99"].forEach(function(num){
          selectedLoteries.forEach(function(lot){
            mergeOrPushGame({
              type: "BOR",
              numero: num,
              loterie: lot,
              montant: parseFloat(montant) || 0
            });
          });
        });

        autoBoulPeMode = false;
        montant = "";
        cursorMontant = 0;
        activeField = "numero";

        renderJeux();
        updateFields();
        return;
      }

      addGame();
      return;
    }

    oldHandleEnter();
  };
})();

renderJeux();
updateFields();
loadBillets();
(function(){
  var oldRenderBillets = renderBillets;
  var oldValidateLoteries = validateLoteries;

  var montantCopyTicket = null;
  var montantCopyValue = 0;

  renderBillets = function(){
    oldRenderBillets();
    fixMontantButtons();
  };

  function fixMontantButtons(){
    var cards = document.querySelectorAll(".billet-card");

    cards.forEach(function(card, index){
      var actions = card.querySelector(".billet-actions");
      if(!actions) return;

      var ticket = savedTickets[index];
      if(!ticket) return;

      var buttons = actions.querySelectorAll("button");
      var montantBtns = [];

      buttons.forEach(function(btn){
        if(btn.textContent.trim().toUpperCase() === "MONTANT"){
          montantBtns.push(btn);
        }
      });

      while(montantBtns.length > 1){
        montantBtns.pop().remove();
      }

      var btn = montantBtns[0];
      if(!btn){
        btn = document.createElement("button");
        btn.type = "button";
        btn.className = "small-btn btn-yellow";
        btn.textContent = "MONTANT";
        actions.insertBefore(btn, actions.lastElementChild);
      }

      btn.onclick = function(e){
        e.preventDefault();
        e.stopPropagation();

        var m = prompt("Mete nouvo montant lan:");
        if(m === null) return;

        m = Number(m || 0);
        if(m <= 0){
          alert("Montant pa valid");
          return;
        }

        montantCopyTicket = ticket;
        montantCopyValue = m;

        selectedLoteries = [];
        activeField = "loterie";
        updateFields();
        openLoterieModal();
      };
    });
  }

  validateLoteries = function(){
    if(montantCopyTicket){
      document.getElementById("loterieModal").classList.remove("show");
      document.getElementById("overlay").classList.remove("show");

      if(selectedLoteries.length === 0){
        activeField = "loterie";
        updateFields();
        openLoterieModal();
        return;
      }

      jeux = [];
      numero = "";
      montant = "";
      cursorNumero = 0;
      cursorMontant = 0;
      activeField = "numero";

      montantCopyTicket.jeux.forEach(function(j){
        selectedLoteries.forEach(function(lot){
          jeux.push({
            type: j.type,
            numero: j.numero,
            loterie: lot,
            montant: Number(montantCopyValue || 0)
          });
        });
      });

      montantCopyTicket = null;
      montantCopyValue = 0;

      renderJeux();
      updateFields();
      switchPage("salePage", document.getElementById("nav-billets"));
      return;
    }

    oldValidateLoteries();
  };
})();

function closeOptions(){
  document.getElementById("optionsSheet").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}
</script>
</body>
</html>
`);
});

app.get("/print", (req, res) => {
  const ticketId = String(req.query.ticketId || "").trim();
  const sellerId = String(req.query.sellerId || "").trim().toUpperCase();

  const tickets = loadTickets();
  const ticket = tickets.find((t) => String(t.id) === ticketId);

  if (!ticket) {
    return res.status(404).send("Ticket introuvable");
  }

  const vendeurs = loadVendeursForLogin();
  const vendeur = vendeurs[sellerId] || {};
  const sellerName = String(vendeur.nom || vendeur.nombre || sellerId || "SELLER");

  const total = Number(ticket.total || 0);
  const now = new Date(ticket.createdAt || Date.now());

  const dateStr = now.toLocaleDateString("fr-FR");
  const timeStr = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const grouped = {};
  (ticket.jeux || []).forEach(function(j){
    const lot = String(j.loterie || "").trim() || "SANS TIRAGE";
    if (!grouped[lot]) grouped[lot] = [];
    grouped[lot].push(j);
  });

  let gamesHtml = "";

  Object.keys(grouped).forEach(function(loterie){
    gamesHtml += '<div class="tirage">' + loterie + '</div>';

    grouped[loterie].forEach(function(j){
      let type = String(j.type || "").toUpperCase();
      if (type === "BOR") type = "Borlette";
      else if (type === "MAR") type = "Mariage";
      else if (type === "L3") type = "Loto 3";
      else if (type === "L4") type = "Loto 4";

      gamesHtml +=
        '<div class="game-row">' +
          '<div class="col-type">' + type + '</div>' +
          '<div class="col-num">' + String(j.numero || "") + '</div>' +
          '<div class="col-amt">' + Number(j.montant || 0).toFixed(2) + '</div>' +
        '</div>';
    });

    gamesHtml += '<div class="line"></div>';
  });

  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Print</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
@page{
  size: 58mm auto;
  margin: 0;
}
html,body{
  margin:0;
  padding:0;
  background:#fff;
}
body{
  width:42mm;
  margin:0 auto;
  padding:1mm 1mm 2mm 1mm;
  font-family:monospace;
  color:#000;
  font-size:9px;
  line-height:1.15;
}
.ticket{
  width:100%;
}
.title{
  text-align:center;
  font-size:10px;
  font-weight:700;
  margin:0 0 4px 0;
  white-space:nowrap;
}
.meta{
  margin:0 0 3px 0;
}
.meta-line{
  white-space:nowrap;
}
.line{
  border-top:1px dashed #000;
  margin:3px 0;
}
.tirage{
  font-size:9px;
  font-weight:700;
  margin:3px 0 2px 0;
  white-space:nowrap;
}
.game-row{
  display:grid;
  grid-template-columns: 1fr 24px 32px;
  column-gap:3px;
  align-items:center;
  margin:0;
}
.col-type{
  white-space:nowrap;
  overflow:hidden;
}
.col-num{
  text-align:left;
  white-space:nowrap;
}
.col-amt{
  text-align:right;
  white-space:nowrap;
}
.total{
  font-size:10px;
  font-weight:700;
  margin-top:2px;
  white-space:nowrap;
}
</style>
</head>
<body>
<div class="ticket">
  <div class="title">NUMBER ONE LOTO</div>

  <div class="meta">
    <div class="meta-line">SELLER ${sellerName}</div>
    <div class="meta-line">TICKET ${ticket.id}</div>
    <div class="meta-line">DATE ${dateStr} ${timeStr}</div>
  </div>

  <div class="line"></div>

  ${gamesHtml}

  <div class="total">TOTAL: ${total.toFixed(2)} G</div>
</div>

<script>
setTimeout(function(){
  try { window.print(); } catch(e) {}
}, 300);
</script>
</body>
</html>
  `);
});



const adminRoutes = require("./admin");
app.use(adminRoutes);

function loadTickets() {
 try {
 if (!fs.existsSync(TICKETS_FILE)) return [];
 const raw = fs.readFileSync(TICKETS_FILE, "utf8").trim();
 if (!raw) return [];
 return JSON.parse(raw);
 } catch (e) {
 return [];
 }
}

app.get("/tickets/:vendeur", (req, res) => {
 const vendeurId = String(req.params.vendeur || "").toUpperCase();
 const tickets = loadTickets();

 const result = tickets.filter(t =>
 String(t.vendeur || "").toUpperCase() === vendeurId
 );

 res.json(result);
});


app.listen(3000, "0.0.0.0", () => {
 console.log("Server ap mache sou rezo a");
});
