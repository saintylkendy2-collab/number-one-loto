const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const VENDEURS_FILE = path.join(__dirname, "vendeurs.json");

function ensureVendeursFile() {
  if (!fs.existsSync(VENDEURS_FILE)) {
    fs.writeFileSync(VENDEURS_FILE, JSON.stringify({}, null, 2), "utf8");
  }
}

function readVendeursObject() {
  try {
    ensureVendeursFile();
    const raw = fs.readFileSync(VENDEURS_FILE, "utf8").trim();
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed;
  } catch (err) {
    console.error("Erreur lecture vendeurs.json :", err);
    return {};
  }
}

function writeVendeursObject(data) {
  fs.writeFileSync(VENDEURS_FILE, JSON.stringify(data, null, 2), "utf8");
}

function normalizeConnection(conn = {}) {
  return {
    id: String(conn.id || ""),
    marca: String(conn.marca || conn.id || "DESCONOCIDO"),
    modelo: String(conn.modelo || conn.id || "WEB"),
    version: String(conn.version || "?"),
    app: String(conn.app || "2.9.32"),
    vinculado: String(conn.vinculado || conn.last || ""),
    last: String(conn.last || ""),
    pin: conn.pin == null ? "" : conn.pin,
    place: String(conn.place || "?"),
    ip: String(conn.ip || ""),
    userAgent: String(conn.userAgent || ""),
    co: conn.co === true,
    on: conn.on === true,
    st: conn.st === true
  };
}

function objectToArray(obj) {
  return Object.keys(obj).map((id) => {
    const v = obj[id] || {};
    return {
      id,
      clave: v.clave || v.password || "",
      password: v.password || v.clave || "",
      nombre: v.nombre || v.nom || "",
      nom: v.nom || v.nombre || "",
      groupe: v.groupe || v.zona || "",
      zona: v.zona || v.groupe || "",
      estatus: v.estatus || "Activo",
      app: v.app || "2.9.32",
      conexion: v.conexion || "",
      apellido: v.apellido || "",
      cedula: v.cedula || "",
      telefono: v.telefono || "",
      direccion: v.direccion || "",
      sexo: v.sexo || "-",
      config: v.config || {},
      comision: v.comision || {},
      premios: v.premios || {},
      limites: v.limites || {},
      conexiones: Array.isArray(v.conexiones) ? v.conexiones.map(normalizeConnection) : []
    };
  });
}

function normalizeVendor(data = {}) {
  const nombre = String(data.nombre || data.nom || "").trim();
  const zona = String(data.zona || data.groupe || "").trim();
  const clave = String(data.clave || data.password || "").trim();

  return {
    nom: nombre,
    nombre: nombre,
    groupe: zona,
    zona: zona,
    password: clave,
    clave: clave,
    estatus: String(data.estatus || "Activo"),
    app: String(data.app || "2.9.32"),
    conexion: String(data.conexion || ""),
    apellido: String(data.apellido || ""),
    cedula: String(data.cedula || ""),
    telefono: String(data.telefono || ""),
    direccion: String(data.direccion || ""),
    sexo: String(data.sexo || "-"),
    config: data.config || {
      limiteDiario: "0",
      credito: "0",
      deshabilitarLoterias: "",
      deshabilitarJugadas: "",
      mezclaNumeros: "0",
      habilitarCuadre: false,
      ventasWhatsapp: false,
      usarNombreTicket: false,
      deshabilitarDecimales: "0",
      deshabilitarTerminales: "0",
      habilitarPrepago: false,
      activarBono: false,
      bonoTipo: "Mariage"
    },
    comision: data.comision || {
      retener: false,
      general: "0",
      borlette: "0",
      mariage: "0",
      loto3: "0",
      loto4: "0",
      loto5: "0",
      loto5o2: "0",
      loto5o3: "0",
      zona: "0",
      porLoteria: false
    },
    premios: data.premios || {
      habilitar: true,
      loteria: "TODAS",
      applyAll: true,
      borlette: ["", "", ""],
      mariage: ["", "", ""],
      loto3: ["", "", ""],
      loto4: ["", "", ""],
      loto5: ["", "", ""],
      loto5o2: ["", "", ""],
      loto5o3: ["", "", ""]
    },
    limites: data.limites || {
      loteria: "TODAS",
      applyAll: true,
      borlette: "0",
      mariage: "0",
      loto3: "0",
      loto4_l1: "0",
      loto4_l2: "0",
      loto4_l3: "0",
      loto5_l1: "0",
      loto5_l2: "0",
      loto5_l3: "0",
      limitarNumeros: [],
      bloqueoNumeros: [],
      limitarCantidad: {
        borlette: "0",
        mariage: "0",
        loto3: "0",
        loto4: "0",
        loto5: "0",
        loto5o2: "0",
        loto5o3: "0"
      }
    },
    conexiones: Array.isArray(data.conexiones) ? data.conexiones.map(normalizeConnection) : []
  };
}

router.get("/api/vendors", (req, res) => {
  try {
    const obj = readVendeursObject();
    res.json(objectToArray(obj));
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

router.post("/api/vendors", (req, res) => {
  try {
    const body = req.body || {};
    const id = String(body.id || "").trim().toUpperCase();

    if (!id) {
      return res.status(400).json({ ok: false, message: "ID obligatoire" });
    }

    const data = normalizeVendor(body);

    if (!data.nombre) {
      return res.status(400).json({ ok: false, message: "Nombre obligatoire" });
    }

    if (!data.clave) {
      return res.status(400).json({ ok: false, message: "Clave obligatoire" });
    }

    const obj = readVendeursObject();

    if (obj[id]) {
      return res.status(409).json({ ok: false, message: "ID déjà existant" });
    }

    obj[id] = data;
    writeVendeursObject(obj);

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Erreur save vendor" });
  }
});

router.put("/api/vendors/:id", (req, res) => {
  try {
    const oldId = String(req.params.id || "").trim().toUpperCase();
    const body = req.body || {};
    const newId = String(body.id || "").trim().toUpperCase();

    if (!oldId || !newId) {
      return res.status(400).json({ ok: false, message: "ID invalide" });
    }

    const data = normalizeVendor(body);

    if (!data.nombre) {
      return res.status(400).json({ ok: false, message: "Nombre obligatoire" });
    }

    if (!data.clave) {
      return res.status(400).json({ ok: false, message: "Clave obligatoire" });
    }

    const obj = readVendeursObject();

    if (!obj[oldId]) {
      return res.status(404).json({ ok: false, message: "Vendeur introuvable" });
    }

    if (oldId !== newId && obj[newId]) {
      return res.status(409).json({ ok: false, message: "Nouvel ID déjà existant" });
    }

    delete obj[oldId];
    obj[newId] = data;
    writeVendeursObject(obj);

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Erreur update vendor" });
  }
});

router.delete("/api/vendors/:id", (req, res) => {
  try {
    const id = String(req.params.id || "").trim().toUpperCase();
    const obj = readVendeursObject();

    if (!obj[id]) {
      return res.status(404).json({ ok: false, message: "Vendeur introuvable" });
    }

    delete obj[id];
    writeVendeursObject(obj);

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Erreur delete vendor" });
  }
});

router.post("/api/vendors/:id/connections/:index/block", (req, res) => {
  try {
    const id = String(req.params.id || "").trim().toUpperCase();
    const index = Number(req.params.index);
    const obj = readVendeursObject();
    const vendor = obj[id];

    if (!vendor) {
      return res.status(404).json({ ok: false, message: "Vendeur introuvable" });
    }

    if (!Array.isArray(vendor.conexiones)) vendor.conexiones = [];

    if (!vendor.conexiones[index]) {
      return res.status(404).json({ ok: false, message: "Connexion introuvable" });
    }

    vendor.conexiones[index] = normalizeConnection({
      ...vendor.conexiones[index],
      co: false,
      on: false,
      st: false,
      last: new Date().toLocaleString("fr-FR")
    });

    vendor.estatus = "Bloqueado";
    vendor.conexion = vendor.conexiones[index].last || vendor.conexion || "";

    writeVendeursObject(obj);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Erreur blocage connexion" });
  }
});

router.post("/api/vendors/:id/connections/:index/unblock", (req, res) => {
  try {
    const id = String(req.params.id || "").trim().toUpperCase();
    const index = Number(req.params.index);
    const obj = readVendeursObject();
    const vendor = obj[id];

    if (!vendor) {
      return res.status(404).json({ ok: false, message: "Vendeur introuvable" });
    }

    if (!Array.isArray(vendor.conexiones)) vendor.conexiones = [];

    if (!vendor.conexiones[index]) {
      return res.status(404).json({ ok: false, message: "Connexion introuvable" });
    }

    vendor.conexiones[index] = normalizeConnection({
      ...vendor.conexiones[index],
      co: true,
      on: true,
      st: true,
      last: new Date().toLocaleString("fr-FR")
    });

    vendor.estatus = "Activo";
    vendor.conexion = vendor.conexiones[index].last || vendor.conexion || "";

    writeVendeursObject(obj);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Erreur déblocage connexion" });
  }
});

router.delete("/api/vendors/:id/connections/:index", (req, res) => {
  try {
    const id = String(req.params.id || "").trim().toUpperCase();
    const index = Number(req.params.index);
    const obj = readVendeursObject();
    const vendor = obj[id];

    if (!vendor) {
      return res.status(404).json({ ok: false, message: "Vendeur introuvable" });
    }

    if (!Array.isArray(vendor.conexiones)) vendor.conexiones = [];

    if (!vendor.conexiones[index]) {
      return res.status(404).json({ ok: false, message: "Connexion introuvable" });
    }

    vendor.conexiones.splice(index, 1);

    const activeConn = vendor.conexiones.find(c => c && c.st === true);
    if (activeConn) {
      vendor.conexion = activeConn.last || vendor.conexion || "";
      vendor.estatus = "Activo";
    } else {
      vendor.conexion = "";
    }

    writeVendeursObject(obj);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Erreur delete connexion" });
  }
});

router.get("/master/vendors", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Master Ventas</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{
font-family:Arial,sans-serif;
background:linear-gradient(180deg,#20243d 0%, #1c2037 100%);
color:#d7dcef;
min-height:100vh;
}
.hidden{display:none !important;}

.login-page{
min-height:100vh;
display:flex;
align-items:center;
justify-content:center;
padding:24px;
}
.login-card{
width:100%;
max-width:760px;
background:#313553;
border-radius:18px;
padding:34px 28px 26px;
box-shadow:0 14px 35px rgba(0,0,0,.22);
}
.login-field-label{
font-size:17px;
color:#d7dbf1;
margin-bottom:10px;
}
.login-input{
width:100%;
height:56px;
border:none;
outline:none;
border-radius:12px;
padding:0 16px;
background:#23263f;
color:#fff;
font-size:18px;
margin-bottom:18px;
}
.login-btn{
width:100%;
height:56px;
border:none;
border-radius:12px;
background:linear-gradient(90deg,#6c6cff,#7a5cff);
color:#fff;
font-size:19px;
font-weight:700;
cursor:pointer;
margin-top:10px;
}
.menu-overlay{
position:fixed;
inset:0;
background:rgba(0,0,0,.35);
display:none;
z-index:999;
}
.menu-overlay.show{display:block;}
.side-menu{
position:fixed;
top:0;
left:-320px;
width:320px;
max-width:88vw;
height:100vh;
background:#2b2f47;
color:#c7cde0;
z-index:1000;
overflow-y:auto;
transition:left .25s ease;
padding:18px 18px 28px;
}
.side-menu.open{left:0;}
.side-menu-header{
display:flex;
align-items:center;
justify-content:space-between;
margin-bottom:22px;
}
.side-menu-logo-wrap{
display:flex;
align-items:center;
gap:12px;
}
.side-menu-logo-img{
width:58px;
height:58px;
border-radius:6px;
object-fit:cover;
background:#fff;
}
.side-menu-logo{
font-size:18px;
font-weight:700;
color:#e4e8f2;
}
.side-menu-close{
font-size:22px;
cursor:pointer;
color:#d5daea;
}
.side-menu-section{
font-size:12px;
color:#8f97b2;
margin:18px 0 8px;
letter-spacing:1px;
}
.side-menu-item{
display:flex;
align-items:center;
justify-content:space-between;
padding:14px 12px;
border-radius:12px;
cursor:pointer;
color:#c7cde0;
margin-bottom:4px;
}
.side-menu-item.active{
background:linear-gradient(90deg,#6d63ff,#7d73ff);
color:#fff;
}
.side-menu-item:hover{
background:rgba(255,255,255,.05);
color:#eef1f8;
}
.submenu-box{
display:none;
padding:4px 0 10px 18px;
}
.submenu-box.open{display:block;}
.submenu-item{
padding:12px 10px;
border-radius:10px;
cursor:pointer;
color:#bcc4da;
margin-bottom:4px;
}
.submenu-item:hover{
background:linear-gradient(90deg,#6d63ff,#7d73ff);
color:#fff;
}
.app-page{
min-height:100vh;
padding:10px 8px 20px;
}
.topbar{
display:flex;
align-items:center;
justify-content:space-between;
gap:10px;
background:#2a2f4a;
border-radius:12px;
padding:14px;
margin-bottom:14px;
}
.top-left,.top-right{
display:flex;
align-items:center;
gap:14px;
}
.icon-btn{
font-size:26px;
color:#d5daf8;
user-select:none;
cursor:pointer;
}
.clock-pill{
background:#23343d;
color:#52d07f;
padding:9px 15px;
border-radius:999px;
font-size:18px;
font-weight:700;
}
.avatar{
width:42px;
height:42px;
border-radius:50%;
background:#d9dbe7;
display:flex;
align-items:center;
justify-content:center;
font-size:20px;
color:#444;
position:relative;
}
.avatar::after{
content:"";
position:absolute;
right:-1px;
bottom:0;
width:12px;
height:12px;
border-radius:50%;
background:#59d26f;
border:2px solid #2a2f4a;
}
.page-title{
font-size:24px;
font-weight:600;
color:#d5dbef;
margin:8px 2px 12px;
}
.filters{display:grid;grid-template-columns:1fr;gap:8px;margin-bottom:12px}
.filter-group{margin:0}
.filter-label,.date-range label{
display:block;
font-size:13px;
font-weight:500;
color:#bcc4de;
margin:0 0 4px 2px;
}
.filter-input,.filter-select,.date-range input,.field-input,.field-select{
width:100%;
border-radius:12px;
border:1px solid rgba(255,255,255,.10);
background:#2a2f4a;
color:#d3d9ec;
outline:none;
box-shadow:none;
}
.filter-input,.filter-select,.date-range input{
height:48px;
padding:0 14px;
font-size:16px;
}
.field-input,.field-select{
height:52px;
padding:0 16px;
font-size:16px;
}
.date-range{display:flex;gap:6px}
.date-range > div{flex:1}
.table-card{
background:#2a2f4a;
border-radius:14px;
overflow:hidden;
box-shadow:0 6px 20px rgba(0,0,0,.12);
margin-top:10px;
}
.table-scroll{
overflow-x:auto;
overflow-y:hidden;
-webkit-overflow-scrolling:touch;
}
table{
width:max-content;
min-width:100%;
border-collapse:collapse;
font-size:14px;
}
thead th{
background:#4a4f69;
color:#c8cfe6;
padding:12px 14px;
font-size:14px;
font-weight:600;
text-align:left;
white-space:nowrap;
border-right:1px solid rgba(255,255,255,.08);
}
tbody td{
padding:12px 14px;
font-size:14px;
font-weight:500;
color:#bcc4de;
border-top:1px solid rgba(255,255,255,.08);
border-right:1px solid rgba(255,255,255,.06);
white-space:nowrap;
text-align:left;
vertical-align:middle;
}
tbody tr:nth-child(even){background:#313652;}
.vendor-name{font-weight:600;color:#bcc4de;}
.money{color:#bcc4de;}
.result-ok{
color:#79d98d;
font-weight:600;
cursor:pointer;
}
.page-block{
background:transparent;
}
.action-row{
display:flex;
align-items:center;
justify-content:space-between;
gap:10px;
margin:8px 0 12px;
}
.action-buttons{
display:flex;
gap:10px;
margin-left:auto;
}
.square-btn{
width:132px;
height:72px;
border-radius:14px;
border:2px solid #3fc9e8;
background:transparent;
color:#3fc9e8;
font-size:36px;
line-height:1;
cursor:pointer;
}
.square-btn.purple{
border-color:#6d63ff;
color:#6d63ff;
}
.vendor-filters{
display:grid;
grid-template-columns:1fr;
gap:10px;
margin-bottom:10px;
}
.clickable-row{cursor:pointer;}
.mini-btn{
border:none;
background:transparent;
color:#7a6dff;
font-size:22px;
cursor:pointer;
}
.status-dot{
font-size:18px;
margin-right:8px;
}
.green{color:#54d46d;}
.gray{color:#969bb1;}
.editor-top-actions{
display:flex;
justify-content:flex-end;
gap:12px;
margin:6px 0 12px;
}
.editor-top-btn{
width:132px;
height:70px;
border-radius:14px;
background:transparent;
cursor:pointer;
font-size:18px;
font-weight:700;
}
.editor-top-btn.back{
border:2px solid #6d63ff;
color:#6d63ff;
}
.editor-top-btn.save{
border:2px solid #3fc9e8;
color:#3fc9e8;
}
.tabs-scroll{
overflow-x:auto;
overflow-y:hidden;
-webkit-overflow-scrolling:touch;
margin-bottom:0;
}
.tabs{
display:flex;
min-width:max-content;
background:#2a2f4a;
border-radius:12px 12px 0 0;
border-bottom:1px solid rgba(255,255,255,.08);
}
.tab{
padding:18px 26px;
font-size:18px;
color:#d7dcef;
white-space:nowrap;
cursor:pointer;
border-bottom:3px solid transparent;
}
.tab.active{
color:#7b72ff;
border-bottom-color:#7b72ff;
font-weight:600;
}
.editor-card{
background:#2a2f4a;
border-radius:0 0 16px 16px;
padding:18px 0 20px;
box-shadow:0 6px 20px rgba(0,0,0,.12);
margin-bottom:24px;
}
.editor-section{
padding:0 18px;
}
.field-group{
margin-bottom:18px;
}
.field-label{
font-size:14px;
color:#d7dcef;
margin:0 0 8px 2px;
}
.hint{
margin-top:6px;
padding:12px 14px;
font-size:12px;
line-height:1.45;
color:#8c7fff;
background:#43436f;
border-radius:0;
}
.phone-wrap{
display:flex;
align-items:center;
gap:10px;
height:52px;
padding:0 16px;
border-radius:12px;
border:1px solid rgba(255,255,255,.10);
background:#2a2f4a;
color:#d3d9ec;
}
.phone-code{
min-width:110px;
display:flex;
align-items:center;
gap:8px;
color:#d3d9ec;
}
.phone-input{
flex:1;
border:none;
outline:none;
background:transparent;
color:#d3d9ec;
font-size:16px;
}
.switch-row{
display:flex;
align-items:center;
gap:14px;
margin:12px 0 10px;
}
.switch{
position:relative;
width:56px;
height:32px;
border-radius:999px;
background:#424761;
cursor:pointer;
flex:0 0 auto;
}
.switch::after{
content:"";
position:absolute;
left:4px;
top:4px;
width:24px;
height:24px;
border-radius:50%;
background:#fff;
transition:.2s;
}
.switch.on{
background:linear-gradient(90deg,#6d63ff,#7d73ff);
}
.switch.on::after{
left:28px;
}
.switch-label{
font-size:17px;
color:#d7dcef;
}
.triple-grid{
display:grid;
grid-template-columns:120px 1fr 1fr 1fr;
gap:12px;
align-items:center;
margin-bottom:12px;
}
.triple-grid .game-name{
font-size:17px;
color:#d7dcef;
}
.mini-input{
width:100%;
height:52px;
border-radius:12px;
border:1px solid rgba(255,255,255,.10);
background:#2a2f4a;
color:#d3d9ec;
padding:0 16px;
font-size:16px;
outline:none;
}
.empty-state{
color:#9ea5cb;
font-size:15px;
text-align:center;
padding:20px;
}
.conn-actions-wrap{
position:relative;
display:inline-block;
}
.conn-menu-btn{
border:none;
background:transparent;
color:#cfd5f0;
font-size:24px;
cursor:pointer;
line-height:1;
}
.conn-menu{
display:none;
position:absolute;
right:0;
top:28px;
min-width:180px;
background:#3a3f5a;
border-radius:12px;
box-shadow:0 10px 28px rgba(0,0,0,.28);
padding:8px 0;
z-index:5000;
}
.conn-menu.show{
display:block;
}
.conn-menu-item{
padding:12px 16px;
cursor:pointer;
font-size:16px;
color:#e5e9f8;
}
.conn-menu-item:hover{
background:rgba(255,255,255,.08);
}
.bool-on{
color:#2fd0ff;
font-weight:700;
font-size:24px;
}
.bool-ok{
color:#54d46d;
font-weight:700;
font-size:24px;
}
.bool-off{
color:#8f96b5;
font-weight:700;
font-size:24px;
}
.refresh-row{
display:flex;
justify-content:flex-end;
padding:0 18px 12px;
}
.refresh-btn{
width:74px;
height:74px;
border-radius:50%;
border:none;
background:rgba(255,255,255,.05);
color:#7b72ff;
font-size:38px;
cursor:pointer;
}
@media (max-width:700px){
.square-btn,.editor-top-btn{width:132px;height:70px}
.triple-grid{grid-template-columns:1fr;}
.tab{padding:16px 22px;font-size:17px;}
}

#tab-conexiones .table-card{
 overflow:visible;
}

#tab-conexiones .table-scroll{
 overflow-x:auto;
 overflow-y:visible;
 -webkit-overflow-scrolling:touch;
}

.conn-menu{
 z-index:9999;
}

</style>
</head>
<body>

<div class="login-page" id="loginPage">
 <div class="login-card">
  <div class="login-field-label">Username</div>
  <input id="username" type="text" placeholder="Username" class="login-input" />
  <div class="login-field-label">Password</div>
  <input id="password" type="password" placeholder="••••••••" class="login-input" />
  <button class="login-btn" onclick="loginMaster()">Ingresar</button>
 </div>
</div>

<div id="menuOverlay" class="menu-overlay"></div>

<div id="sideMenu" class="side-menu">
 <div class="side-menu-header">
  <div class="side-menu-logo-wrap">
   <img class="side-menu-logo-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/240px-Placeholder_view_vector.svg.png" alt="logo">
   <div class="side-menu-logo">NUMBER ONE LOTO</div>
  </div>
  <div id="menuCloseBtn" class="side-menu-close" onclick="closeSideMenu()">✕</div>
 </div>

 <div class="side-menu-section">AJUSTES</div>

 <div class="side-menu-item" onclick="toggleSubmenu('configMenu')">
  <span>Configuración</span><span>></span>
 </div>
 <div id="configMenu" class="submenu-box">
  <div class="submenu-item" onclick="goPage('grupo')">Grupo</div>
 </div>

 <div class="side-menu-item" onclick="toggleSubmenu('limitesMenu')">
  <span>Límites</span><span>></span>
 </div>
 <div id="limitesMenu" class="submenu-box">
  <div class="submenu-item" onclick="goPage('limites_ajustes')">Ajustes</div>
  <div class="submenu-item" onclick="goPage('limites_estadisticas')">Estadísticas</div>
 </div>

 <div class="side-menu-item"><span>Loterías</span></div>
 <div class="side-menu-item active" onclick="goPage('vendors')"><span>Vendedores</span></div>
 <div class="side-menu-item"><span>Mi Cuenta</span></div>

 <div class="side-menu-section">MONITOREO</div>
 <div class="side-menu-item"><span>Tickets</span></div>
 <div class="side-menu-item"><span>Sorteos</span></div>

 <div class="side-menu-section">REPORTES</div>
 <div class="side-menu-item" onclick="toggleSubmenu('ventaMenu')">
  <span>Venta</span><span>></span>
 </div>
 <div id="ventaMenu" class="submenu-box">
  <div class="submenu-item" onclick="goPage('ventas')">General</div>
  <div class="submenu-item" onclick="goPage('vendors')">Vendedor</div>
  <div class="submenu-item">Lotería</div>
  <div class="submenu-item">Jugada</div>
  <div class="submenu-item">Número</div>
  <div class="submenu-item">Conexion</div>
  <div class="submenu-item">Tickets premiados</div>
  <div class="submenu-item">Tickets cancelados</div>
  <div class="submenu-item">Grupo</div>
 </div>

 <div class="side-menu-section">FLUJO DE EFECTIVO</div>
 <div class="side-menu-item"><span>Transactions</span></div>

 <div class="side-menu-item" onclick="toggleSubmenu('balanceMenu')">
  <span>Balance</span><span>></span>
 </div>
 <div id="balanceMenu" class="submenu-box">
  <div class="submenu-item">Vendedor</div>
 </div>

 <div class="side-menu-section">DESCONECTAR</div>
 <div class="side-menu-item"><span>Salir</span></div>
</div>

<div class="app-page hidden" id="appPage">
 <div class="topbar">
  <div class="top-left">
   <div class="icon-btn" id="menuBtn" onclick="openSideMenu()">☰</div>
   <div class="icon-btn">⌕</div>
  </div>
  <div class="top-right">
   <div class="clock-pill" id="clockBox">13:15</div>
   <div class="icon-btn">☼</div>
   <div class="avatar">👤</div>
  </div>
 </div>

 <div id="ventasPage" class="page-block">
  <div class="page-title">Ventas</div>

  <div class="filters">
   <div class="filter-group">
    <div class="date-range">
     <div>
      <label>Desde</label>
      <input type="date" id="fechaInicio">
     </div>
     <div>
      <label>Hasta</label>
      <input type="date" id="fechaFin">
     </div>
    </div>
   </div>

   <div class="filter-group">
    <label class="filter-label">Zona</label>
    <select class="filter-select"><option>-</option></select>
   </div>

   <div class="filter-group">
    <label class="filter-label">Vendedor</label>
    <select class="filter-select"><option>-</option></select>
   </div>

   <div class="filter-group">
    <label class="filter-label">Lotería</label>
    <select class="filter-select"><option>-</option></select>
   </div>

   <div class="filter-group">
    <label class="filter-label">Jugada</label>
    <select class="filter-select"><option>-</option></select>
   </div>

   <div class="filter-group">
    <label class="filter-label">Comisión</label>
    <select class="filter-select">
     <option>Todas</option>
     <option>3%</option>
     <option>5%</option>
     <option>8%</option>
     <option>10%</option>
    </select>
   </div>
  </div>

  <div class="table-card">
   <div class="table-scroll">
    <table>
     <thead>
      <tr>
       <th>VENDEDOR</th>
       <th>VENTA</th>
       <th>COMISIÓN</th>
       <th>PREMIOS</th>
       <th>RESULTADO</th>
      </tr>
     </thead>
     <tbody>
      <tr>
       <td class="vendor-name">Wisly</td>
       <td class="money">9,918.00</td>
       <td class="money">991.80</td>
       <td class="money">700.00</td>
       <td class="result-ok">8,226.20</td>
      </tr>
      <tr>
       <td class="vendor-name">Edras</td>
       <td class="money">9,830.00</td>
       <td class="money">1,474.50</td>
       <td class="money">1,500.00</td>
       <td class="result-ok">6,855.50</td>
      </tr>
      <tr>
       <td class="vendor-name">Paul</td>
       <td class="money">8,945.00</td>
       <td class="money">1,252.30</td>
       <td class="money">1,600.00</td>
       <td class="result-ok">6,092.70</td>
      </tr>
      <tr>
       <td class="vendor-name">Mackenson</td>
       <td class="money">8,268.00</td>
       <td class="money">1,240.20</td>
       <td class="money">1,200.00</td>
       <td class="result-ok">5,827.80</td>
      </tr>
      <tr>
       <td class="vendor-name">Etzer</td>
       <td class="money">8,950.00</td>
       <td class="money">1,253.00</td>
       <td class="money">1,975.00</td>
       <td class="result-ok">5,722.00</td>
      </tr>
      <tr>
       <td class="vendor-name">Klodi</td>
       <td class="money">6,499.00</td>
       <td class="money">974.85</td>
       <td class="money">550.00</td>
       <td class="result-ok">4,974.15</td>
      </tr>
     </tbody>
    </table>
   </div>
  </div>
 </div>

 <div id="vendorsPage" class="page-block hidden">
  <div class="page-title">Vendedores</div>

  <div class="action-row">
   <div></div>
   <div class="action-buttons">
    <button class="square-btn" onclick="openNewVendor()">+</button>
    <button class="square-btn purple" onclick="loadVendorsFromServer()">↻</button>
   </div>
  </div>

  <div class="vendor-filters">
   <input id="vendorFilterId" class="filter-input" placeholder="ID" />
   <input id="vendorFilterNombre" class="filter-input" placeholder="NOMBRE" />
   <select id="vendorFilterGrupo" class="filter-select"></select>
   <select id="vendorFilterEstado" class="filter-select">
    <option value="">- ESTADO -</option>
    <option value="Activo">Activo</option>
    <option value="Bloqueado">Bloqueado</option>
   </select>
  </div>

  <div class="table-card">
   <div class="table-scroll">
    <table>
     <thead>
      <tr>
       <th>ID</th>
       <th>NOMBRE</th>
       <th>ZONA</th>
       <th>APP</th>
       <th>CONEXIÓN</th>
       <th>LIMIT</th>
       <th>PAGO</th>
       <th>STATUS</th>
       <th></th>
       <th></th>
       <th></th>
      </tr>
     </thead>
     <tbody id="vendorsTableBody"></tbody>
    </table>
   </div>
  </div>
 </div>

 <div id="vendorEditorPage" class="page-block hidden">
  <div class="page-title">Vendedor</div>

  <div class="editor-top-actions">
   <button class="editor-top-btn back" onclick="backToVendorList()">≪</button>
   <button class="editor-top-btn save" onclick="saveVendor()">💾</button>
  </div>

  <div class="tabs-scroll">
   <div class="tabs" id="vendorTabs">
    <div class="tab active" data-tab="datos" onclick="showVendorTab('datos')">Datos Del Vendedor</div>
    <div class="tab" data-tab="config" onclick="showVendorTab('config')">Configuración</div>
    <div class="tab" data-tab="comision" onclick="showVendorTab('comision')">Comisión</div>
    <div class="tab" data-tab="premios" onclick="showVendorTab('premios')">Pago De Premios</div>
    <div class="tab" data-tab="limites" onclick="showVendorTab('limites')">Límite De Ventas</div>
    <div class="tab" data-tab="conexiones" onclick="showVendorTab('conexiones')">Conexiones</div>
    <div class="tab" data-tab="clonar" onclick="showVendorTab('clonar')">Clonar</div>
   </div>
  </div>

  <div class="editor-card">
   <div class="editor-section vendor-tab-panel" id="tab-datos">
    <div class="field-group">
     <div class="field-label">ID</div>
     <input id="vd_id" class="field-input" />
    </div>
    <div class="field-group">
     <div class="field-label">Clave</div>
     <input id="vd_clave" class="field-input" />
    </div>
    <div class="field-group">
     <div class="field-label">Nombre</div>
     <input id="vd_nombre" class="field-input" />
    </div>
    <div class="field-group">
     <div class="field-label">Apellido</div>
     <input id="vd_apellido" class="field-input" />
    </div>
    <div class="field-group">
     <div class="field-label">Cédula</div>
     <input id="vd_cedula" class="field-input" />
    </div>
    <div class="field-group">
 <div class="field-label">Teléfono</div>
 <input id="vd_telefono" class="field-input" placeholder="+509 / +1 / +33 ..." />
</div>

    <div class="field-group">
     <div class="field-label">Dirección</div>
     <input id="vd_direccion" class="field-input" />
    </div>
    <div class="field-group">
     <div class="field-label">Estatus</div>
     <select id="vd_estatus" class="field-select">
      <option value="Activo">Activo</option>
      <option value="Bloqueado">Bloqueado</option>
     </select>
    </div>
    <div class="field-group">
     <div class="field-label">Sexo</div>
     <select id="vd_sexo" class="field-select">
      <option>-</option>
      <option>Hombre</option>
      <option>Mujer</option>
     </select>
    </div>
    <div class="field-group">
     <div class="field-label">Zona</div>
     <select id="vd_zona" class="field-select"></select>
    </div>
   </div>

   <div class="editor-section vendor-tab-panel hidden" id="tab-config">
    <div class="field-group">
     <div class="field-label">Límite Diario</div>
     <input id="cfg_limite_diario" class="field-input" value="0" />
     <div class="hint">Monto máximo que puede vender por día. Deje en 0 si no lo utiliza.</div>
    </div>
    <div class="field-group">
     <div class="field-label">Crédito</div>
     <input id="cfg_credito" class="field-input" value="0" />
     <div class="hint">Balance general hasta el próximo cuadre. Deje en 0 si no lo utiliza.</div>
    </div>
    <div class="field-group">
     <div class="field-label">Deshabilitar Loterías</div>
     <input id="cfg_deshabilitar_loterias" class="field-input" />
     <div class="hint">Loterías que este vendedor no puede vender.</div>
    </div>
    <div class="field-group">
     <div class="field-label">Deshabilitar Jugadas</div>
     <input id="cfg_deshabilitar_jugadas" class="field-input" />
     <div class="hint">Jugadas que este vendedor no puede vender.</div>
    </div>
    <div class="field-group">
     <div class="field-label">Mezcla de números</div>
     <input id="cfg_mezcla_numeros" class="field-input" value="0" />
     <div class="hint">Cantidad de números que puede mezclar. 0 para usar el valor global. -1 para desactivar a este vendedor.</div>
    </div>

    <div class="switch-row"><div id="sw_cuadre" class="switch"></div><div class="switch-label">Habilitar Cuadre</div></div>
    <div class="hint">Mostrar opción de cuadre al vendedor.</div>

    <div class="switch-row"><div id="sw_whatsapp" class="switch"></div><div class="switch-label">Ventas por WhatsApp</div></div>
    <div class="hint">Permitir ventas por WhatsApp.</div>

    <div class="switch-row"><div id="sw_nombre_ticket" class="switch"></div><div class="switch-label">Usar nombre en Ticket</div></div>
    <div class="hint">Usar el nombre de este vendedor como nombre de Consorcio en sus tickets.</div>

    <div class="field-group">
     <div class="field-label">Deshabilitar Decimales</div>
     <input id="cfg_decimales" class="field-input" value="0" />
     <div class="hint">Cantidad de decimales permitidos por lotería. Deje en 0 para usar el valor global.</div>
    </div>

    <div class="field-group">
     <div class="field-label">Deshabilitar Terminales</div>
     <input id="cfg_terminales" class="field-input" value="0" />
     <div class="hint">Cantidad de terminales permitidos por lotería. Deje en 0 para usar el valor global.</div>
    </div>

    <div class="switch-row"><div id="sw_prepago" class="switch"></div><div class="switch-label">Habilitar Prepago</div></div>
    <div class="hint">Para habilitar el punto de venta en modo PREPAGO.</div>

    <div class="switch-row"><div id="sw_bono" class="switch"></div><div class="switch-label">Activar Bono</div></div>
    <div class="field-group">
     <select id="cfg_bono" class="field-select">
      <option>Mariage</option>
      <option>Borlette</option>
      <option>Loto 3</option>
     </select>
    </div>
   </div>

   <div class="editor-section vendor-tab-panel hidden" id="tab-comision">
    <div class="switch-row" style="justify-content:flex-end;">
     <div id="sw_retener_comision" class="switch"></div>
     <div class="switch-label">Retener Comisión</div>
    </div>

    <div class="field-group">
     <div class="field-label" style="font-weight:700;">Comisión General</div>
     <input id="com_general" class="field-input" value="0" />
    </div>

    <div class="field-group"><div class="field-label">Borlette</div><input id="com_borlette" class="field-input" value="0" /></div>
    <div class="field-group"><div class="field-label">Mariage</div><input id="com_mariage" class="field-input" value="0" /></div>
    <div class="field-group"><div class="field-label">Loto 3</div><input id="com_loto3" class="field-input" value="0" /></div>
    <div class="field-group"><div class="field-label">Loto 4</div><input id="com_loto4" class="field-input" value="0" /></div>
    <div class="field-group"><div class="field-label">Loto 5</div><input id="com_loto5" class="field-input" value="0" /></div>
    <div class="field-group"><div class="field-label">Loto 5 o2</div><input id="com_loto5o2" class="field-input" value="0" /></div>
    <div class="field-group"><div class="field-label">Loto 5 o3</div><input id="com_loto5o3" class="field-input" value="0" /></div>

    <div class="field-group">
     <div class="field-label" style="font-weight:700;">Comisión de Zona</div>
     <input id="com_zona" class="field-input" value="0" />
     <div class="hint">Use esta opción si el vendedor pagará la comisión del supervisor diferente a lo configurado en la zona.</div>
    </div>

    <div class="switch-row"><div id="sw_comision_loteria" class="switch"></div><div class="switch-label">Comisión por Lotería</div></div>
   </div>

   <div class="editor-section vendor-tab-panel hidden" id="tab-premios">
    <div class="switch-row">
     <div id="sw_premios_habilitar" class="switch on"></div>
     <div class="switch-label">Habilitar</div>
    </div>

    <div class="field-group" style="display:flex;gap:14px;align-items:center;">
     <select id="premios_loteria" class="field-select" style="flex:1;"></select>
     <div class="switch on" id="sw_premios_apply"></div>
    </div>

    <div class="triple-grid">
     <div class="game-name">Borlette</div>
     <input id="prem_borlette_1" class="mini-input" />
     <input id="prem_borlette_2" class="mini-input" />
     <input id="prem_borlette_3" class="mini-input" />
    </div>

    <div class="triple-grid">
     <div class="game-name">Mariage</div>
     <input id="prem_mariage_1" class="mini-input" />
     <input id="prem_mariage_2" class="mini-input" />
     <input id="prem_mariage_3" class="mini-input" />
    </div>

    <div class="triple-grid">
     <div class="game-name">Loto 3</div>
     <input id="prem_l3_1" class="mini-input" />
     <input id="prem_l3_2" class="mini-input" />
     <input id="prem_l3_3" class="mini-input" />
    </div>

    <div class="triple-grid">
     <div class="game-name">Loto 4</div>
     <input id="prem_l4_1" class="mini-input" />
     <input id="prem_l4_2" class="mini-input" />
     <input id="prem_l4_3" class="mini-input" />
    </div>

    <div class="triple-grid">
     <div class="game-name">Loto 5</div>
     <input id="prem_l5_1" class="mini-input" />
     <input id="prem_l5_2" class="mini-input" />
     <input id="prem_l5_3" class="mini-input" />
    </div>
   </div>

   <div class="editor-section vendor-tab-panel hidden" id="tab-limite">
    <div class="field-group">
     <label>Borlette</label>
     <input id="lim_borlette" class="field-input" />
    </div>
    <div class="field-group">
     <label>Mariage</label>
     <input id="lim_mariage" class="field-input" />
    </div>
    <div class="field-group">
     <label>Loto 3</label>
     <input id="lim_l3" class="field-input" />
    </div>
    <div class="field-group">
     <label>Loto 4 (L1, L2, L3)</label>
     <input id="lim_l4_l1" class="field-input" placeholder="L1"/>
     <input id="lim_l4_l2" class="field-input" placeholder="L2"/>
     <input id="lim_l4_l3" class="field-input" placeholder="L3"/>
    </div>
    <div class="field-group">
     <label>Loto 5 (L1, L2, L3)</label>
     <input id="lim_l5_l1" class="field-input" placeholder="L1"/>
     <input id="lim_l5_l2" class="field-input" placeholder="L2"/>
     <input id="lim_l5_l3" class="field-input" placeholder="L3"/>
    </div>
   </div>

   <div class="editor-section vendor-tab-panel hidden" id="tab-conexiones">
    <div class="refresh-row">
     <button class="refresh-btn" onclick="refreshCurrentConexiones()">↻</button>
    </div>

    <div class="table-card">
     <div class="table-scroll">
      <table>
       <thead>
        <tr>
         <th>MARCA</th>
         <th>MODELO</th>
         <th>VERSION</th>
         <th>APP</th>
         <th>VINCULADO</th>
         <th>LAST CONNECTION</th>
         <th>PIN</th>
         <th>PLACE</th>
         <th>CO</th>
         <th>ON</th>
         <th>ST</th>
         <th></th>
        </tr>
       </thead>
       <tbody id="conexiones_table"></tbody>
      </table>
     </div>
    </div>
   </div>

   <div class="editor-section vendor-tab-panel hidden" id="tab-clonar">
    <div style="display:flex;justify-content:center;margin-top:40px;">
     <button class="login-btn" onclick="cloneVendor()">Clonar Vendedor</button>
    </div>
   </div>
  </div>
 </div>
</div>

<script>
let currentPage = "ventas";
let currentVendorIndex = null;
let vendors = [];

const gruposList = [
"Anderson",
"Brasser Dollar",
"Joslin",
"Judler",
"Junior",
"Michel"
];

const loteriasList = [
"TODAS",
"TENNESSE MORNING",
"TEXAS MORNING",
"GEORGIA MIDDAY",
"TENNESSE MIDDAY",
"FLORIDA MIDDAY",
"NEW YORK MIDDAY",
"FLORIDA EVENING",
"NEW YORK EVENING",
"GEORGIA EVENING"
];

function safe(v){
 return v == null ? "" : String(v);
}

function byId(id){
 return document.getElementById(id);
}

function exists(id){
 return !!byId(id);
}

function setValue(id, value){
 const el = byId(id);
 if(el) el.value = safe(value);
}

function getValue(id, fallback = ""){
 const el = byId(id);
 return el ? el.value : fallback;
}

function getSwitchValue(id){
 const el = byId(id);
 return el ? el.classList.contains("on") : false;
}

function setSwitchValue(id,val){
 const el = byId(id);
 if(!el) return;
 if(val){ el.classList.add("on"); }
 else{ el.classList.remove("on"); }
}

function makeOption(value,text){
 const opt = document.createElement("option");
 opt.value = value;
 opt.textContent = text;
 return opt;
}

function updateClock(){
 const d = new Date();
 const h = String(d.getHours()).padStart(2,"0");
 const m = String(d.getMinutes()).padStart(2,"0");
 const box = document.getElementById("clockBox");
 if(box) box.textContent = h + ":" + m;
}
setInterval(updateClock,1000);
updateClock();

async function loadVendorsFromServer(){
 try{
   const res = await fetch("/api/vendors");
   const data = await res.json();
   vendors = Array.isArray(data) ? data : [];
   renderVendorTable();
 }catch(err){
   console.error(err);
   vendors = [];
   renderVendorTable();
 }
}

function loginMaster() {
 const user = document.getElementById("username");
 const pass = document.getElementById("password");
 const loginPage = document.getElementById("loginPage");
 const appPage = document.getElementById("appPage");

 if (!user || !pass || !loginPage || !appPage) return;

 const u = user.value.trim();
 const p = pass.value.trim();

 if (u === "Number" && p === "1234") {
   loginPage.style.display = "none";
   appPage.classList.remove("hidden");
   appPage.style.display = "block";
   loadVendorsFromServer();
   goPage("ventas"); // FIX
 } else {
   alert("Login incorrect");
 }
}

function openSideMenu(){
 const menu = document.getElementById("sideMenu");
 const overlay = document.getElementById("menuOverlay");
 if(menu) menu.classList.add("open");
 if(overlay) overlay.classList.add("show");
}

function closeSideMenu(){
 const menu = document.getElementById("sideMenu");
 const overlay = document.getElementById("menuOverlay");
 if(menu) menu.classList.remove("open");
 if(overlay) overlay.classList.remove("show");
}

function toggleSubmenu(id){
 const box = document.getElementById(id);
 if(!box) return;
 const isOpen = box.classList.contains("open");

 document.querySelectorAll(".submenu-box").forEach(function(el){
   el.classList.remove("open");
 });

 if(!isOpen) box.classList.add("open");
}

function goPage(page){
 currentPage = page;

 const ventasPage = document.getElementById("ventasPage");
 const vendorsPage = document.getElementById("vendorsPage");
 const editorPage = document.getElementById("vendorEditorPage");

 if(ventasPage) ventasPage.classList.add("hidden");
 if(vendorsPage) vendorsPage.classList.add("hidden");
 if(editorPage) editorPage.classList.add("hidden");

 if(page === "ventas"){
   ventasPage.classList.remove("hidden");
 }else if(page === "vendors"){
   vendorsPage.classList.remove("hidden");
   renderVendorTable();
 }else if(page === "editor"){
   editorPage.classList.remove("hidden");
 }

 closeSideMenu();
}

function loadGrupoSelects(){
 const ids = ["vendorFilterGrupo","vd_zona"];
 ids.forEach(id=>{
   const el = byId(id);
   if(!el) return;

   const current = el.value;
   el.innerHTML = "";

   if(id === "vendorFilterGrupo"){
     el.appendChild(makeOption("","- GRUPO -"));
   }

   gruposList.forEach(g=>{
     el.appendChild(makeOption(g,g));
   });

   if(current) el.value = current;
 });
}

function loadLoteriasSelects(){
 const ids = ["premios_loteria"];
 ids.forEach(id=>{
   const el = byId(id);
   if(!el) return;
   const current = el.value;
   el.innerHTML = "";
   loteriasList.forEach(l=>{
     el.appendChild(makeOption(l,l === "TODAS" ? "- TODAS -" : l));
   });
   if(current) el.value = current;
 });
}

function renderVendorTable(){
 const tbody = byId("vendorsTableBody");
 if(!tbody) return;

 const idFilter = safe(byId("vendorFilterId")?.value).toLowerCase();
 const nameFilter = safe(byId("vendorFilterNombre")?.value).toLowerCase();
 const grupoFilter = safe(byId("vendorFilterGrupo")?.value);
 const estadoFilter = safe(byId("vendorFilterEstado")?.value);

 const filtered = vendors.filter(v=>{
   const okId = !idFilter || safe(v.id).toLowerCase().includes(idFilter);
   const okName = !nameFilter || safe(v.nombre).toLowerCase().includes(nameFilter);
   const okGrupo = !grupoFilter || safe(v.zona || v.groupe) === grupoFilter;
   const okEstado = !estadoFilter || safe(v.estatus) === estadoFilter;
   return okId && okName && okGrupo && okEstado;
 });

 tbody.innerHTML = "";

 if(!filtered.length){
   tbody.innerHTML = '<tr><td colspan="11" class="empty-state">No hay vendedores</td></tr>';
   return;
 }

 filtered.forEach(v=>{
   const originalIndex = vendors.findIndex(x=>x.id === v.id);

   const hasActive = Array.isArray(v.conexiones) && v.conexiones.some(c => c && c.st === true);
   const statusDot = hasActive
     ? '<span class="status-dot green">●</span>'
     : '<span class="status-dot gray">●</span>';

   tbody.innerHTML += \`
   <tr class="clickable-row" onclick="openVendorByIndex(\${originalIndex})">
    <td>\${statusDot}<strong>\${safe(v.id)}</strong></td>
    <td>\${safe(v.nombre)}</td>
    <td>\${safe(v.zona || v.groupe)}</td>
    <td>\${safe(v.app)}</td>
    <td>\${safe(v.conexion)}</td>
    <td>✓</td>
    <td>✓</td>
    <td>\${safe(v.estatus) === "Activo" ? "✓" : ""}</td>
    <td><button class="mini-btn" onclick="event.stopPropagation();openVendorByIndex(\${originalIndex})">✎</button></td>
    <td><button class="mini-btn" onclick="event.stopPropagation();deleteVendorByIndex(\${originalIndex})">🗑</button></td>
    <td></td>
   </tr>
   \`;
 });
}

function blankVendor(){
 return {
   id:"",
   clave:"",
   password:"",
   nombre:"",
   nom:"",
   apellido:"",
   cedula:"",
   telefono:"",
   direccion:"",
   estatus:"Activo",
   sexo:"-",
   zona:"",
   groupe:"",
   config:{
     limiteDiario:"0",
     credito:"0",
     deshabilitarLoterias:"",
     deshabilitarJugadas:"",
     mezclaNumeros:"0",
     habilitarCuadre:false,
     ventasWhatsapp:false,
     usarNombreTicket:false,
     deshabilitarDecimales:"0",
     deshabilitarTerminales:"0",
     habilitarPrepago:false,
     activarBono:false,
     bonoTipo:"Mariage"
   },
   comision:{
     retener:false,
     general:"0",
     borlette:"0",
     mariage:"0",
     loto3:"0",
     loto4:"0",
     loto5:"0",
     loto5o2:"0",
     loto5o3:"0",
     zona:"0",
     porLoteria:false
   },
   premios:{
     habilitar:true,
     loteria:"TODAS",
     applyAll:true,
     borlette:["","",""],
     mariage:["","",""],
     loto3:["","",""],
     loto4:["","",""],
     loto5:["","",""],
     loto5o2:["","",""],
     loto5o3:["","",""]
   },
   limites:{
     loteria:"TODAS",
     applyAll:true,
     borlette:"0",
     mariage:"0",
     loto3:"0",
     loto4_l1:"0",
     loto4_l2:"0",
     loto4_l3:"0",
     loto5_l1:"0",
     loto5_l2:"0",
     loto5_l3:"0",
     limitarNumeros:[],
     bloqueoNumeros:[],
     limitarCantidad:{
       borlette:"0",
       mariage:"0",
       loto3:"0",
       loto4:"0",
       loto5:"0",
       loto5o2:"0",
       loto5o3:"0"
     }
   },
   conexiones:[],
   app:"2.9.32",
   conexion:""
 };
}

function openNewVendor(){
 currentVendorIndex = null;
 fillVendorForm(blankVendor());
 goPage("editor");
 showVendorTab("datos");
}

function openVendorByIndex(index){
 currentVendorIndex = index;
 fillVendorForm(vendors[index]);
 goPage("editor");
 showVendorTab("datos");
}

function backToVendorList(){
 goPage("vendors");
}

function fillVendorForm(v){
 const cfg = v.config || {};
 const com = v.comision || {};
 const premios = v.premios || {};
 const limites = v.limites || {};
 const limCant = limites.limitarCantidad || {};

 setValue("vd_id", v.id);
 setValue("vd_clave", v.clave || v.password);
 setValue("vd_nombre", v.nombre || v.nom);
 setValue("vd_apellido", v.apellido);
 setValue("vd_cedula", v.cedula);
 setValue("vd_telefono", v.telefono);
 setValue("vd_direccion", v.direccion);
 setValue("vd_estatus", v.estatus || "Activo");
 setValue("vd_sexo", v.sexo || "-");
 setValue("vd_zona", v.zona || v.groupe);

 setValue("cfg_limite_diario", cfg.limiteDiario || cfg.limite_diario || "0");
 setValue("cfg_credito", cfg.credito || "0");
 setValue("cfg_deshabilitar_loterias", cfg.deshabilitarLoterias || cfg.deshabilitar_loterias || "");
 setValue("cfg_deshabilitar_jugadas", cfg.deshabilitarJugadas || cfg.deshabilitar_jugadas || "");
 setValue("cfg_mezcla_numeros", cfg.mezclaNumeros || "0");
 setValue("cfg_decimales", cfg.deshabilitarDecimales || "0");
 setValue("cfg_terminales", cfg.deshabilitarTerminales || "0");
 setValue("cfg_bono", cfg.bonoTipo || "Mariage");

 setSwitchValue("sw_cuadre", !!cfg.habilitarCuadre);
 setSwitchValue("sw_whatsapp", !!cfg.ventasWhatsapp);
 setSwitchValue("sw_nombre_ticket", !!cfg.usarNombreTicket);
 setSwitchValue("sw_prepago", !!cfg.habilitarPrepago);
 setSwitchValue("sw_bono", !!cfg.activarBono);

 setValue("com_general", com.general || "0");
 setValue("com_borlette", com.borlette || "0");
 setValue("com_mariage", com.mariage || "0");
 setValue("com_loto3", com.loto3 || "0");
 setValue("com_loto4", com.loto4 || "0");
 setValue("com_loto5", com.loto5 || "0");
 setValue("com_loto5o2", com.loto5o2 || "0");
 setValue("com_loto5o3", com.loto5o3 || "0");
 setValue("com_zona", com.zona || "0");

 setSwitchValue("sw_retener_comision", !!com.retener);
 setSwitchValue("sw_comision_loteria", !!com.porLoteria);

 setValue("premios_loteria", premios.loteria || "TODAS");
 setSwitchValue("sw_premios_habilitar", premios.habilitar !== false);
 setSwitchValue("sw_premios_apply", premios.applyAll !== false);

 setValue("prem_borlette_1", (premios.borlette || [])[0] || "");
 setValue("prem_borlette_2", (premios.borlette || [])[1] || "");
 setValue("prem_borlette_3", (premios.borlette || [])[2] || "");
 setValue("prem_mariage_1", (premios.mariage || [])[0] || "");
 setValue("prem_mariage_2", (premios.mariage || [])[1] || "");
 setValue("prem_mariage_3", (premios.mariage || [])[2] || "");
 setValue("prem_l3_1", (premios.loto3 || [])[0] || "");
 setValue("prem_l3_2", (premios.loto3 || [])[1] || "");
 setValue("prem_l3_3", (premios.loto3 || [])[2] || "");
 setValue("prem_l4_1", (premios.loto4 || [])[0] || "");
 setValue("prem_l4_2", (premios.loto4 || [])[1] || "");
 setValue("prem_l4_3", (premios.loto4 || [])[2] || "");
 setValue("prem_l5_1", (premios.loto5 || [])[0] || "");
 setValue("prem_l5_2", (premios.loto5 || [])[1] || "");
 setValue("prem_l5_3", (premios.loto5 || [])[2] || "");

 setValue("lim_borlette", limites.borlette || "");
 setValue("lim_mariage", limites.mariage || "");
 setValue("lim_l3", limites.loto3 || "");
 setValue("lim_l4_l1", limites.loto4_l1 || "");
 setValue("lim_l4_l2", limites.loto4_l2 || "");
 setValue("lim_l4_l3", limites.loto4_l3 || "");
 setValue("lim_l5_l1", limites.loto5_l1 || "");
 setValue("lim_l5_l2", limites.loto5_l2 || "");
 setValue("lim_l5_l3", limites.loto5_l3 || "");

 renderConexiones(Array.isArray(v.conexiones) ? v.conexiones : []);
}

function readVendorForm(){
 const current = currentVendorIndex != null ? vendors[currentVendorIndex] : null;

 return {
   id: getValue("vd_id").trim().toUpperCase(),
   clave: getValue("vd_clave").trim(),
   password: getValue("vd_clave").trim(),
   nombre: getValue("vd_nombre").trim(),
   nom: getValue("vd_nombre").trim(),
   apellido: getValue("vd_apellido").trim(),
   cedula: getValue("vd_cedula").trim(),
   telefono: getValue("vd_telefono").trim(),
   direccion: getValue("vd_direccion").trim(),
   estatus: getValue("vd_estatus", "Activo"),
   sexo: getValue("vd_sexo", "-"),
   zona: getValue("vd_zona").trim(),
   groupe: getValue("vd_zona").trim(),

   config:{
     limiteDiario: getValue("cfg_limite_diario", "0"),
     credito: getValue("cfg_credito", "0"),
     deshabilitarLoterias: getValue("cfg_deshabilitar_loterias", ""),
     deshabilitarJugadas: getValue("cfg_deshabilitar_jugadas", ""),
     mezclaNumeros: getValue("cfg_mezcla_numeros", "0"),
     habilitarCuadre: getSwitchValue("sw_cuadre"),
     ventasWhatsapp: getSwitchValue("sw_whatsapp"),
     usarNombreTicket: getSwitchValue("sw_nombre_ticket"),
     deshabilitarDecimales: getValue("cfg_decimales", "0"),
     deshabilitarTerminales: getValue("cfg_terminales", "0"),
     habilitarPrepago: getSwitchValue("sw_prepago"),
     activarBono: getSwitchValue("sw_bono"),
     bonoTipo: getValue("cfg_bono", "Mariage")
   },

   comision:{
     retener: getSwitchValue("sw_retener_comision"),
     general: getValue("com_general", "0"),
     borlette: getValue("com_borlette", "0"),
     mariage: getValue("com_mariage", "0"),
     loto3: getValue("com_loto3", "0"),
     loto4: getValue("com_loto4", "0"),
     loto5: getValue("com_loto5", "0"),
     loto5o2: getValue("com_loto5o2", "0"),
     loto5o3: getValue("com_loto5o3", "0"),
     zona: getValue("com_zona", "0"),
     porLoteria: getSwitchValue("sw_comision_loteria")
   },

   premios:{
     habilitar: getSwitchValue("sw_premios_habilitar"),
     loteria: getValue("premios_loteria", "TODAS"),
     applyAll: getSwitchValue("sw_premios_apply"),
     borlette:[getValue("prem_borlette_1"), getValue("prem_borlette_2"), getValue("prem_borlette_3")],
     mariage:[getValue("prem_mariage_1"), getValue("prem_mariage_2"), getValue("prem_mariage_3")],
     loto3:[getValue("prem_l3_1"), getValue("prem_l3_2"), getValue("prem_l3_3")],
     loto4:[getValue("prem_l4_1"), getValue("prem_l4_2"), getValue("prem_l4_3")],
     loto5:[getValue("prem_l5_1"), getValue("prem_l5_2"), getValue("prem_l5_3")],
     loto5o2:["","",""],
     loto5o3:["","",""]
   },

   limites:{
     loteria: "TODAS",
     applyAll: true,
     borlette: getValue("lim_borlette", "0"),
     mariage: getValue("lim_mariage", "0"),
     loto3: getValue("lim_l3", "0"),
     loto4_l1: getValue("lim_l4_l1", "0"),
     loto4_l2: getValue("lim_l4_l2", "0"),
     loto4_l3: getValue("lim_l4_l3", "0"),
     loto5_l1: getValue("lim_l5_l1", "0"),
     loto5_l2: getValue("lim_l5_l2", "0"),
     loto5_l3: getValue("lim_l5_l3", "0"),
     limitarNumeros: [],
     bloqueoNumeros: [],
     limitarCantidad:{
       borlette: "0",
       mariage: "0",
       loto3: "0",
       loto4: "0",
       loto5: "0",
       loto5o2: "0",
       loto5o3: "0"
     }
   },

   conexiones: current ? (Array.isArray(current.conexiones) ? current.conexiones : []) : [],
   app: current ? safe(current.app || "2.9.32") : "2.9.32",
   conexion: current ? safe(current.conexion || "") : ""
 };
}

async function saveVendor(){
 const vendor = readVendorForm();

 if(!vendor.id || !vendor.nombre){
   alert("ID y Nombre son obligatorios");
   return;
 }

 if(!vendor.clave){
   alert("Clave obligatoria");
   return;
 }

 try{
   let res;

   if(currentVendorIndex === null){
     res = await fetch("/api/vendors", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(vendor)
     });
   }else{
     const oldVendor = vendors[currentVendorIndex];
     res = await fetch("/api/vendors/" + encodeURIComponent(oldVendor.id), {
       method: "PUT",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(vendor)
     });
   }

   const data = await res.json();

   if(!res.ok){
     alert(data.message || "Erreur save");
     return;
   }

   alert("Vendedor guardado ✔");
   await loadVendorsFromServer();
   goPage("vendors");
 }catch(err){
   console.error(err);
   alert("Erreur save vendor");
 }
}

async function deleteVendorByIndex(index){
 if(!confirm("Eliminar vendedor?")) return;

 try{
   const vendor = vendors[index];
   const res = await fetch("/api/vendors/" + encodeURIComponent(vendor.id), {
     method: "DELETE"
   });

   const data = await res.json();

   if(!res.ok){
     alert(data.message || "Erreur delete");
     return;
   }

   currentVendorIndex = null;
   await loadVendorsFromServer();
 }catch(err){
   console.error(err);
   alert("Erreur delete vendor");
 }
}

async function cloneVendor(){
 const vendor = readVendorForm();

 if(!vendor.id){
   alert("Selecciona un vendedor");
   return;
 }

 vendor.id = vendor.id + "_COPY";
 vendor.nombre = vendor.nombre + "_copy";
 vendor.nom = vendor.nombre;
 vendor.password = vendor.clave;
 vendor.groupe = vendor.zona;
 vendor.conexiones = [];
 vendor.conexion = "";

 try{
   const res = await fetch("/api/vendors", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(vendor)
   });

   const data = await res.json();

   if(!res.ok){
     alert(data.message || "Erreur clone");
     return;
   }

   alert("Copiar vendedor ✔");
   await loadVendorsFromServer();
   goPage("vendors");
 }catch(err){
   console.error(err);
   alert("Erreur clone vendor");
 }
}

function boolIcon(v, clsOn){
 return v ? '<span class="' + clsOn + '">●</span>' : '<span class="bool-off">⊘</span>';
}

function closeAllConnMenus(){
 document.querySelectorAll(".conn-menu").forEach(el => el.classList.remove("show"));
}

function toggleConnMenu(i){
 const menu = byId("conn_menu_" + i);
 if(!menu) return;
 const show = !menu.classList.contains("show");
 closeAllConnMenus();
 if(show) menu.classList.add("show");
}

function renderConexiones(rows){
 const tbody = byId("conexiones_table");
 if(!tbody) return;

 tbody.innerHTML = "";

 if(!rows || !rows.length){
   tbody.innerHTML = '<tr><td colspan="12" class="empty-state">No hay conexiones</td></tr>';
   return;
 }

 rows.forEach((c,i)=>{
   const isBlocked = !c.st;
   const actionLabel = isBlocked ? "Aceptar" : "Bloquear";
   const actionFn = isBlocked ? \`unblockConn(\${i})\` : \`blockConn(\${i})\`;

   tbody.innerHTML += \`
   <tr>
    <td>\${safe(c.marca)}</td>
    <td>\${safe(c.modelo)}</td>
    <td>\${safe(c.version)}</td>
    <td>\${safe(c.app)}</td>
    <td>\${safe(c.vinculado)}</td>
    <td>\${safe(c.last)}</td>
    <td>\${safe(c.pin)}</td>
    <td>\${safe(c.place)}</td>
    <td>\${boolIcon(c.co, "bool-on")}</td>
    <td>\${boolIcon(c.on, "bool-on")}</td>
    <td>\${boolIcon(c.st, "bool-ok")}</td>
    <td>
      <div class="conn-actions-wrap">
        <button class="conn-menu-btn" onclick="toggleConnMenu(\${i});event.stopPropagation();">⋮</button>
        <div class="conn-menu" id="conn_menu_\${i}">
          <div class="conn-menu-item" onclick="\${actionFn}">\${actionLabel}</div>
          <div class="conn-menu-item" onclick="deleteConn(\${i})">Eliminar</div>
          <div class="conn-menu-item" onclick="pinConn(\${i})">PIN</div>
        </div>
      </div>
    </td>
   </tr>
   \`;
 });
}

async function refreshCurrentConexiones(){
 if(currentVendorIndex == null) return;
 await loadVendorsFromServer();
 const current = vendors[currentVendorIndex];
 if(current){
   renderConexiones(current.conexiones || []);
 }
}

async function blockConn(i){
 if(currentVendorIndex == null) return;

 const vendor = vendors[currentVendorIndex];
 if(!vendor) return;

 try{
   const res = await fetch("/api/vendors/" + encodeURIComponent(vendor.id) + "/connections/" + i + "/block", {
     method: "POST"
   });

   const data = await res.json();

   if(!res.ok){
     alert(data.message || "Erreur blocage");
     return;
   }

   closeAllConnMenus();
   await loadVendorsFromServer();

   const idx = vendors.findIndex(v => v.id === vendor.id);
   if(idx >= 0){
     currentVendorIndex = idx;
     fillVendorForm(vendors[idx]);
   }

   alert("Connexion bloquée");
 }catch(err){
   console.error(err);
   alert("Erreur blocage connexion");
 }
}

async function unblockConn(i){
 if(currentVendorIndex == null) return;

 const vendor = vendors[currentVendorIndex];
 if(!vendor) return;

 try{
   const res = await fetch("/api/vendors/" + encodeURIComponent(vendor.id) + "/connections/" + i + "/unblock", {
     method: "POST"
   });

   const data = await res.json();

   if(!res.ok){
     alert(data.message || "Erreur déblocage");
     return;
   }

   closeAllConnMenus();
   await loadVendorsFromServer();

   const idx = vendors.findIndex(v => v.id === vendor.id);
   if(idx >= 0){
     currentVendorIndex = idx;
     fillVendorForm(vendors[idx]);
   }

   alert("Connexion activée");
 }catch(err){
   console.error(err);
   alert("Erreur déblocage connexion");
 }
}

async function deleteConn(i){
 if(currentVendorIndex == null) return;

 const vendor = vendors[currentVendorIndex];
 if(!vendor) return;

 try{
   const res = await fetch("/api/vendors/" + encodeURIComponent(vendor.id) + "/connections/" + i, {
     method: "DELETE"
   });

   const data = await res.json();

   if(!res.ok){
     alert(data.message || "Erreur suppression connexion");
     return;
   }

   closeAllConnMenus();
   await loadVendorsFromServer();

   const idx = vendors.findIndex(v => v.id === vendor.id);
   if(idx >= 0){
     currentVendorIndex = idx;
     fillVendorForm(vendors[idx]);
   }

   alert("Connexion supprimée");
 }catch(err){
   console.error(err);
   alert("Erreur suppression connexion");
 }
}

function pinConn(i){
 const vendor = currentVendorIndex != null ? vendors[currentVendorIndex] : null;
 const conn = vendor && Array.isArray(vendor.conexiones) ? vendor.conexiones[i] : null;
 if(!conn){
   alert("PIN introuvable");
   return;
 }
 closeAllConnMenus();
 alert("PIN conexión: " + safe(conn.pin));
}

function showVendorTab(tabName){
 document.querySelectorAll(".tab").forEach(tab=>{
   tab.classList.remove("active");
   if(tab.dataset.tab === tabName){
     tab.classList.add("active");
   }
 });

 document.querySelectorAll(".vendor-tab-panel").forEach(panel=>{
   panel.classList.add("hidden");
 });

 const map = {
   datos: "tab-datos",
   config: "tab-config",
   comision: "tab-comision",
   premios: "tab-premios",
   limites: "tab-limite",
   conexiones: "tab-conexiones",
   clonar: "tab-clonar"
 };

 const panel = byId(map[tabName] || ("tab-" + tabName));
 if(panel) panel.classList.remove("hidden");
}

function bindSwitches(){
 document.querySelectorAll(".switch").forEach(sw=>{
   if(sw.dataset.bound === "1") return;
   sw.dataset.bound = "1";
   sw.addEventListener("click",function(){
     sw.classList.toggle("on");
   });
 });
}

document.addEventListener("click", function(e){
 if(!e.target.closest(".conn-actions-wrap")){
   closeAllConnMenus();
 }
});

document.addEventListener("DOMContentLoaded", function(){
 const menuBtn = byId("menuBtn");
 const menuCloseBtn = byId("menuCloseBtn");
 const overlay = byId("menuOverlay");

 if(menuBtn) menuBtn.addEventListener("click", openSideMenu);
 if(menuCloseBtn) menuCloseBtn.addEventListener("click", closeSideMenu);
 if(overlay) overlay.addEventListener("click", closeSideMenu);

 const idFilter = byId("vendorFilterId");
 const nombreFilter = byId("vendorFilterNombre");
 const grupoFilter = byId("vendorFilterGrupo");
 const estadoFilter = byId("vendorFilterEstado");

 if(idFilter) idFilter.addEventListener("input", renderVendorTable);
 if(nombreFilter) nombreFilter.addEventListener("input", renderVendorTable);
 if(grupoFilter) grupoFilter.addEventListener("change", renderVendorTable);
 if(estadoFilter) estadoFilter.addEventListener("change", renderVendorTable);

 loadGrupoSelects();
 loadLoteriasSelects();
 bindSwitches();
 loadVendorsFromServer();
});

goPage("vendors");
</script>

</body>
</html>
`);
});

module.exports = router;