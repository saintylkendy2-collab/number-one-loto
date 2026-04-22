const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const VENDEURS_FILE = path.join(__dirname, "vendeurs.json");

function ensureVendeursFile() {
  try {
    if (!fs.existsSync(VENDEURS_FILE)) {
      fs.writeFileSync(VENDEURS_FILE, JSON.stringify({}, null, 2), "utf8");
    }
  } catch (err) {
    console.error("Erreur création vendeurs.json :", err);
  }
}

function normalizeVendor(data = {}) {
  const id = String(data.id || "").trim();
  const clave = String(data.clave || data.password || "").trim();
  const nombre = String(data.nombre || data.nom || "").trim();
  const groupe = String(data.groupe || data.zona || "").trim();

  return {
    nom: nombre,
    nombre: nombre,
    groupe: groupe,
    zona: groupe,
    password: clave,
    clave: clave,
    estatus: String(data.estatus || "Activo"),
    app: String(data.app || "2.9.32"),
    conexion: String(data.conexion || "")
  };
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
      conexion: v.conexion || ""
    };
  });
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
    const id = String(body.id || "").trim();
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

    obj[id] = {
      nom: data.nom,
      groupe: data.groupe,
      password: data.password,
      clave: data.clave,
      estatus: data.estatus,
      app: data.app,
      conexion: data.conexion
    };

    writeVendeursObject(obj);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Erreur save vendor" });
  }
});

router.put("/api/vendors/:id", (req, res) => {
  try {
    const oldId = String(req.params.id || "").trim();
    const body = req.body || {};
    const newId = String(body.id || "").trim();

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
    obj[newId] = {
      nom: data.nom,
      groupe: data.groupe,
      password: data.password,
      clave: data.clave,
      estatus: data.estatus,
      app: data.app,
      conexion: data.conexion
    };

    writeVendeursObject(obj);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Erreur update vendor" });
  }
});

router.delete("/api/vendors/:id", (req, res) => {
  try {
    const id = String(req.params.id || "").trim();
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
.filter-input,.filter-select,.field-input,.field-select{
width:100%;
border-radius:12px;
border:1px solid rgba(255,255,255,.10);
background:#2a2f4a;
color:#d3d9ec;
outline:none;
box-shadow:none;
}
.filter-input,.filter-select{
height:48px;
padding:0 14px;
font-size:16px;
}
.field-input,.field-select{
height:52px;
padding:0 16px;
font-size:16px;
}
.clickable-row{cursor:pointer;}
.row-actions{
display:flex;
align-items:center;
gap:10px;
}
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
.empty-state{
color:#9ea5cb;
font-size:15px;
text-align:center;
padding:20px;
}
@media (max-width:700px){
.square-btn,.editor-top-btn{width:132px;height:70px}
.tab{
padding:16px 22px;
font-size:17px;
}
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
  <div class="side-menu-item active" onclick="goPage('vendors')"><span>Vendedores</span></div>
  <div class="side-menu-item"><span>Mi Cuenta</span></div>

  <div class="side-menu-section">DESCONECTAR</div>
  <div class="side-menu-item" onclick="logoutMaster()"><span>Salir</span></div>
</div>

<div class="app-page hidden" id="appPage">
  <div class="topbar">
    <div class="top-left">
      <div class="icon-btn" id="menuBtn" onclick="openSideMenu()">☰</div>
    </div>
    <div class="top-right">
      <div class="clock-pill" id="clockBox">13:15</div>
      <div class="avatar">👤</div>
    </div>
  </div>

  <div id="vendorsPage" class="page-block">
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
      <input id="vendorFilterGrupo" class="filter-input" placeholder="GRUPO / ZONA" />
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
              <th>STATUS</th>
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
          <div class="field-label">Zona / Grupo</div>
          <input id="vd_zona" class="field-input" />
        </div>
        <div class="field-group">
          <div class="field-label">Estatus</div>
          <select id="vd_estatus" class="field-select">
            <option>Bloqueado</option>
            <option>Activo</option>
          </select>
        </div>
      </div>

      <div class="editor-section vendor-tab-panel hidden" id="tab-config">
        <div class="empty-state">Paj sa rete disponib pou lòt reglaj pita.</div>
      </div>

      <div class="editor-section vendor-tab-panel hidden" id="tab-comision">
        <div class="empty-state">Paj sa rete disponib pou komisyon pita.</div>
      </div>

      <div class="editor-section vendor-tab-panel hidden" id="tab-premios">
        <div class="empty-state">Paj sa rete disponib pou premio pita.</div>
      </div>

      <div class="editor-section vendor-tab-panel hidden" id="tab-limites">
        <div class="empty-state">Paj sa rete disponib pou limit pita.</div>
      </div>

      <div class="editor-section vendor-tab-panel hidden" id="tab-conexiones">
        <div class="empty-state">Pa gen koneksyon pou kounya.</div>
      </div>

      <div class="editor-section vendor-tab-panel hidden" id="tab-clonar">
        <div style="display:flex;justify-content:center;margin-top:40px;">
          <button class="editor-top-btn save" onclick="cloneVendor()">Clonar Vendedor</button>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
let vendors = [];
let currentVendorIndex = null;

function byId(id){
  return document.getElementById(id);
}

function safe(v){
  return v == null ? "" : String(v);
}

function updateClock(){
  const d = new Date();
  const h = String(d.getHours()).padStart(2,"0");
  const m = String(d.getMinutes()).padStart(2,"0");
  const box = byId("clockBox");
  if(box) box.textContent = h + ":" + m;
}
setInterval(updateClock,1000);
updateClock();

function loginMaster() {
  const user = byId("username");
  const pass = byId("password");
  const loginPage = byId("loginPage");
  const appPage = byId("appPage");

  if (!user || !pass || !loginPage || !appPage) return;

  const u = user.value.trim();
  const p = pass.value.trim();

  if (u === "Number" && p === "1234") {
    loginPage.style.display = "none";
    appPage.classList.remove("hidden");
    appPage.style.display = "block";
    loadVendorsFromServer();
  } else {
    alert("Login incorrect");
  }
}

function logoutMaster(){
  const loginPage = byId("loginPage");
  const appPage = byId("appPage");
  if(loginPage) loginPage.style.display = "flex";
  if(appPage) appPage.style.display = "none";
}

function openSideMenu(){
  const menu = byId("sideMenu");
  const overlay = byId("menuOverlay");
  if(menu) menu.classList.add("open");
  if(overlay) overlay.classList.add("show");
}

function closeSideMenu(){
  const menu = byId("sideMenu");
  const overlay = byId("menuOverlay");
  if(menu) menu.classList.remove("open");
  if(overlay) overlay.classList.remove("show");
}

function goPage(page){
  const vendorsPage = byId("vendorsPage");
  const editorPage = byId("vendorEditorPage");

  if(vendorsPage) vendorsPage.classList.add("hidden");
  if(editorPage) editorPage.classList.add("hidden");

  if(page === "vendors"){
    vendorsPage.classList.remove("hidden");
  }else if(page === "editor"){
    editorPage.classList.remove("hidden");
  }

  closeSideMenu();
}

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

function renderVendorTable(){
  const tbody = byId("vendorsTableBody");
  if(!tbody) return;

  const idFilter = safe(byId("vendorFilterId")?.value).toLowerCase();
  const nameFilter = safe(byId("vendorFilterNombre")?.value).toLowerCase();
  const grupoFilter = safe(byId("vendorFilterGrupo")?.value).toLowerCase();
  const estadoFilter = safe(byId("vendorFilterEstado")?.value);

  const filtered = vendors.filter(v=>{
    const okId = !idFilter || safe(v.id).toLowerCase().includes(idFilter);
    const okName = !nameFilter || safe(v.nombre || v.nom).toLowerCase().includes(nameFilter);
    const okGrupo = !grupoFilter || safe(v.zona || v.groupe).toLowerCase().includes(grupoFilter);
    const okEstado = !estadoFilter || safe(v.estatus) === estadoFilter;
    return okId && okName && okGrupo && okEstado;
  });

  tbody.innerHTML = "";

  if(!filtered.length){
    tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No hay vendedores</td></tr>';
    return;
  }

  filtered.forEach(v=>{
    const originalIndex = vendors.findIndex(x=>x.id === v.id);
    const statusDot = v.estatus === "Activo"
      ? '<span class="status-dot green">●</span>'
      : '<span class="status-dot gray">●</span>';

    tbody.innerHTML += \`
      <tr class="clickable-row" onclick="openVendorByIndex(\${originalIndex})">
        <td>\${statusDot}<strong>\${safe(v.id)}</strong></td>
        <td>\${safe(v.nombre || v.nom)}</td>
        <td>\${safe(v.zona || v.groupe)}</td>
        <td>\${safe(v.app || "2.9.32")}</td>
        <td>\${safe(v.conexion || "")}</td>
        <td>\${safe(v.estatus || "Activo")}</td>
        <td>
          <button class="mini-btn" onclick="event.stopPropagation();openVendorByIndex(\${originalIndex})">✎</button>
        </td>
        <td>
          <button class="mini-btn" onclick="event.stopPropagation();deleteVendorByIndex(\${originalIndex})">🗑</button>
        </td>
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
    groupe:"",
    zona:"",
    estatus:"Activo",
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
  fillVendorForm(vendors[index] || blankVendor());
  goPage("editor");
  showVendorTab("datos");
}

function backToVendorList(){
  goPage("vendors");
}

function fillVendorForm(v){
  byId("vd_id").value = safe(v.id);
  byId("vd_clave").value = safe(v.clave || v.password);
  byId("vd_nombre").value = safe(v.nombre || v.nom);
  byId("vd_zona").value = safe(v.zona || v.groupe);
  byId("vd_estatus").value = safe(v.estatus || "Activo");
}

function readVendorForm(){
  return {
    id: byId("vd_id").value.trim(),
    clave: byId("vd_clave").value.trim(),
    password: byId("vd_clave").value.trim(),
    nombre: byId("vd_nombre").value.trim(),
    nom: byId("vd_nombre").value.trim(),
    groupe: byId("vd_zona").value.trim(),
    zona: byId("vd_zona").value.trim(),
    estatus: byId("vd_estatus").value,
    app: currentVendorIndex != null ? safe(vendors[currentVendorIndex]?.app || "2.9.32") : "2.9.32",
    conexion: currentVendorIndex != null ? safe(vendors[currentVendorIndex]?.conexion || "") : ""
  };
}

async function saveVendor(){
  const vendor = readVendorForm();

  if(!vendor.id || !vendor.nombre || !vendor.clave){
    alert("ID, Nombre y Clave son obligatorios");
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
      const oldId = vendors[currentVendorIndex].id;
      res = await fetch("/api/vendors/" + encodeURIComponent(oldId), {
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
    currentVendorIndex = null;
    goPage("vendors");
  }catch(err){
    console.error(err);
    alert("Erreur save vendor");
  }
}

async function deleteVendorByIndex(index){
  if(!confirm("Eliminar vendedor?")) return;

  try{
    const id = vendors[index]?.id;
    if(!id) return;

    const res = await fetch("/api/vendors/" + encodeURIComponent(id), {
      method: "DELETE"
    });

    const data = await res.json();

    if(!res.ok){
      alert(data.message || "Erreur delete");
      return;
    }

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

  const copy = {
    ...vendor,
    id: vendor.id + "_copy",
    nombre: vendor.nombre + "_copy",
    nom: vendor.nom + "_copy"
  };

  try{
    const res = await fetch("/api/vendors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(copy)
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

  const panel = byId("tab-" + tabName);
  if(panel) panel.classList.remove("hidden");
}

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
  if(grupoFilter) grupoFilter.addEventListener("input", renderVendorTable);
  if(estadoFilter) estadoFilter.addEventListener("change", renderVendorTable);

  goPage("vendors");
});
</script>
</body>
</html>
  `);
});

module.exports = router;
