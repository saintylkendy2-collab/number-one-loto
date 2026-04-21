const express = require("express");
const router = express.Router();

router.get("/master/vendors", (req, res) => {
  res.send(`
    <!-- LOGIN + TABLO ou la -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Master Ventas</title>
  <style>
 *{
.app-page{
  min-height:100vh;
  padding:8px 8px 14px;
}

.page-title{
  font-size:24px;
  font-weight:500;
  color:#dfe4ff;
  margin:6px 2px 10px;
}

.filters{
  display:grid;
  grid-template-columns:1fr;
  gap:8px;
  margin-bottom:10px;
}

.filter-group{
  margin:0;
}

.filter-label,
.date-range label{
  display:block;
  font-size:13px;
  line-height:1.1;
  color:#dfe4ff;
  margin:0 0 4px 2px;
}

.filter-input,
.filter-select,
.date-range input{
  width:100%;
  height:46px;
  border-radius:10px;
  border:1px solid rgba(255,255,255,.08);
  background:#2a2f4a;
  color:#eef1ff;
  font-size:15px;
  padding:0 12px;
  outline:none;
  margin:0;
}

.date-range{
  display:flex;
  gap:6px;
  margin:0;
}

.date-range > div{
  flex:1;
  margin:0;
}

.page-title{
  margin: 4px 2px 8px !important;
}


.filter-label,
.date-range label{
  margin: 0 0 2px 2px !important;
  font-size: 12px !important;
  line-height: 1 !important;
}

.filter-select,
.filter-input,
.date-range input{
  height: 38px !important;
  margin: 0 !important;
  padding: 0 10px !important;
  font-size: 14px !important;
}

.date-range{
  gap: 4px !important;
  margin: 0 !important;
}

.date-range > div{
  margin: 0 !important;
}

.topbar{
  margin-bottom: 8px !important;
}

.app-page{
  padding-top: 8px !important;
}

   
   
    .hidden{display:none!important;}

    /* LOGIN */
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

    /* APP */
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
      font-weight:500;
      color:#dfe4ff;
      margin:8px 2px 14px;
    }
    .filters{
      display:grid;
      grid-template-columns:1fr;
      gap:10px;
      margin-bottom:14px;
    }
    .filter-label{
      font-size:14px;
      color:#dfe4ff;
      margin:2px 2px 6px;
    }
    .filter-input,.filter-select{
      width:100%;
      height:58px;
      border-radius:12px;
      border:1px solid rgba(255,255,255,.08);
      background:#2a2f4a;
      color:#eef1ff;
      font-size:18px;
      padding:0 14px;
      outline:none;
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
  min-width:0;
  border-collapse:collapse;
  font-size:14px;
}

thead th{
  background:#4a4f69;
  color:#f0f2ff;
  padding:10px 12px;
  font-size:14px;
  font-weight:700;
  text-align:left;
  white-space:nowrap;
  border-right:1px solid rgba(255,255,255,.08);
}

tbody td{
  padding:10px 12px;
  font-size:14px;
  color:#cfd4ee;
  border-top:1px solid rgba(255,255,255,.08);
  border-right:1px solid rgba(255,255,255,.06);
  white-space:nowrap;
  text-align:left;
  vertical-align:middle;
}

tbody tr:nth-child(even){
  background:#313652;
}

.vendor-name{
  font-weight:700;
  color:#eef1ff;
  text-align:left !important;
}

.money{
  font-weight:700;
  color:#dfe4ff;
  text-align:left !important;
}

.result-ok{
  color:#67d57b;
  font-weight:700;
  text-align:left !important;
}

.result-bad{
  color:#ff8484;
  font-weight:700;
  text-align:left !important;
}
    .summary{
      padding:12px 14px;
      color:#9ea5cb;
      font-size:14px;
    }
     html, body{
  background:#20243d !important;
} 
 .page-title{
  margin:4px 2px 6px !important;
}

.filters{
  gap:4px !important;
  margin-bottom:8px !important;
}

.filter-label,
.date-range label{
  margin:0 0 2px 2px !important;
  font-size:12px !important;
}

.filter-select,
.filter-input,
.date-range input{
  height:38px !important;
  margin:0 !important;
}

.date-range{
  gap:4px !important;
}


.filters,
.filters > div{
  background: transparent !important;
}

.filter-select,
.filter-input,
.date-range input{
  background:#2a2f4a !important;
  color:#eef1ff !important;
  border:1px solid rgba(255,255,255,.08) !important;
}

html, body{
  background:#20243d !important;
}


html, body{
  background:linear-gradient(180deg,#20243d 0%, #1c2037 100%) !important;
}


git add .
git commit -m "restore dark background"
git push


.page-title{
  font-size:20px !important;
  font-weight:600 !important;
  color:#d7dcef !important;
}

.filter-label,
.date-range label{
  font-size:11px !important;
  font-weight:500 !important;
  color:#b9c0da !important;
}

.filter-select,
.filter-input,
.date-range input{
  font-size:13px !important;
  font-weight:500 !important;
  color:#d7dcef !important;
}
 .summary{
  font-size:12px !important;
  color:#aeb6d2 !important;
}

thead th{
  font-size:12px !important;
  font-weight:600 !important;
  color:#cfd6ee !important;
}

tbody td{
  font-size:12px !important;
  font-weight:500 !important;
  color:#c5cce3 !important;
}

.vendor-name{
  font-size:12px !important;
  font-weight:600 !important;
  color:#d7dcef !important;
}

.money{
  color:#c5cce3 !important;
}

.result-ok{
  color:#74d88a !important;
  font-weight:600 !important;
}

body,
.app-page,
.page-title,
.filter-label,
.date-range label,
.filter-select,
.filter-input,
.date-range input,
.summary,
table,
thead th,
tbody td,
.vendor-name,
.money,
.result-ok,
.result-bad{
  font-family: Arial, sans-serif !important;
}

/* ANLÈ */
.page-title{
  font-size: 22px !important;
  font-weight: 600 !important;
  color: #d5dbef !important;
}

.filter-label,
.date-range label{
  font-size: 13px !important;
  font-weight: 500 !important;
  color: #bcc4de !important;
}

.filter-select,
.filter-input,
.date-range input{
  font-size: 15px !important;
  font-weight: 500 !important;
  color: #d3d9ec !important;
}

/* TI TEKS ANLÈ TABLO A */
.summary{
  font-size: 13px !important;
  color: #aeb6d2 !important;
}

/* TABLO ANBA */
thead th{
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #c8cfe6 !important;
}

tbody td{
  font-size: 14px !important;
  font-weight: 500 !important;
  color: #bcc4de !important;
}

/* NON MOUN YO PA BLAN */
.vendor-name{
  font-size: 14px !important;
  font-weight: 500 !important;
  color: #bcc4de !important;
}

/* CHIF YO MENM STYLE AK RÈS TABLO A */
.money{
  font-size: 14px !important;
  font-weight: 500 !important;
  color: #bcc4de !important;
  font-family: Arial, sans-serif !important;
}

.result-ok{
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #79d98d !important;
  font-family: Arial, sans-serif !important;
}

.result-bad{
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #d98b8b !important;
  font-family: Arial, sans-serif !important;
}
/* ONLY TOP BIGGER */
.page-title{
  font-size:24px !important;
}

.filter-label,
.date-range label{
  font-size:14px !important;
}

.filter-select,
.filter-input,
.date-range input{
  font-size:16px !important;
}
/* SOFT COLORS FOR EYES */
body{
  filter: brightness(0.95);
}

thead th{
  color:#bfc7df !important;
}

tbody td{
  color:#aeb6d2 !important;
}

.vendor-name{
  color:#aeb6d2 !important;
}

.money{
  color:#aeb6d2 !important;
}

.result-ok{
  color:#6fd38a !important;
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

  <div class="app-page hidden" id="appPage">
    <div class="topbar">
      <div class="top-left">
        <div class="icon-btn">☰</div>
        <div class="icon-btn">⌕</div>
      </div>
      <div class="top-right">
        <div class="clock-pill" id="clockBox">13:15</div>
        <div class="icon-btn">☼</div>
        <div class="avatar">👤</div>
      </div>
    </div>

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
    <select class="filter-select">
      <option>-</option>
    </select>
  </div>

  <div class="filter-group">
    <label class="filter-label">Vendedor</label>
    <select class="filter-select">
      <option>-</option>
    </select>
  </div>

  <div class="filter-group">
    <label class="filter-label">Lotería</label>
    <select class="filter-select">
      <option>-</option>
    </select>
  </div>

  <div class="filter-group">
    <label class="filter-label">Jugada</label>
    <select class="filter-select">
      <option>-</option>
    </select>
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

<script>
function updateClock(){
  const d = new Date();
  const h = String(d.getHours()).padStart(2,"0");
  const m = String(d.getMinutes()).padStart(2,"0");
  document.getElementById("clockBox").textContent = h + ":" + m;
}
setInterval(updateClock, 1000);
updateClock();

function loginMaster(){
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if(user === "Number" && pass === "1234"){
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("appPage").classList.remove("hidden");
  } else {
    alert("Login incorrect");
  }
}
/* =========================
   MENU BÒ GOCH + SUBMENUS
   ========================= */

function openSideMenu() {
  const menu = document.getElementById("sideMenu");
  const overlay = document.getElementById("menuOverlay");
  if (menu) menu.classList.add("open");
  if (overlay) overlay.classList.add("show");
}

function closeSideMenu() {
  const menu = document.getElementById("sideMenu");
  const overlay = document.getElementById("menuOverlay");
  if (menu) menu.classList.remove("open");
  if (overlay) overlay.classList.remove("show");
}

function toggleSubmenu(id) {
  const box = document.getElementById(id);
  if (!box) return;

  const isOpen = box.classList.contains("open");

  document.querySelectorAll(".submenu-box").forEach(el => {
    el.classList.remove("open");
  });

  if (!isOpen) {
    box.classList.add("open");
  }
}

/* =========================
   NAVIGASYON SUBMENU YO
   ========================= */

function goPage(page) {
  const routes = {
    grupo: "/grupo",
    limites_ajustes: "/limites/ajustes",
    limites_estadisticas: "/limites/estadisticas",

    venta_general: "/venta/general",
    venta_vendedor: "/venta/vendedor",
    venta_loteria: "/venta/loteria",
    venta_jugada: "/venta/jugada",
    venta_numero: "/venta/numero",
    venta_conexion: "/venta/conexion",
    venta_tickets_premiados: "/venta/tickets-premiados",
    venta_tickets_cancelados: "/venta/tickets-cancelados",
    venta_grupo: "/venta/grupo",

    balance_vendedor: "/balance/vendedor"
  };

  if (routes[page]) {
    window.location.href = routes[page];
  }
}

/* =========================
   MONTANT → PAGO / COBRO
   ========================= */

let currentVendor = "";
let currentAmount = 0;

function parseAmount(value) {
  if (typeof value === "number") return value;
  let clean = String(value).replace(/,/g, "").trim();
  return parseFloat(clean) || 0;
}

function formatAmount(value) {
  const num = Math.abs(parseAmount(value));
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/*
  Itilizasyon nan tablo a:
  onclick="handleBalanceClick('Paul', '-1798.48')"
  onclick="handleBalanceClick('Wisly', '38647.50')"
*/
function handleBalanceClick(vendor, amount) {
  currentVendor = vendor;
  currentAmount = parseAmount(amount);

  if (currentAmount < 0) {
    openPagoModal(vendor, Math.abs(currentAmount));
  } else if (currentAmount > 0) {
    openCobroModal(vendor, currentAmount);
  } else {
    alert("Balance sa a se 0.00");
  }
}

/* =========================
   MODAL PAGO
   ========================= */

function openPagoModal(vendor, amount) {
  const modal = document.getElementById("modalPago");
  if (!modal) return;

  const title = document.getElementById("pagoTitle");
  const vendorInput = document.getElementById("pagoVendor");
  const balanceInput = document.getElementById("pagoBalance");
  const montoInput = document.getElementById("pagoMonto");
  const fechaInput = document.getElementById("pagoFecha");
  const comentarioInput = document.getElementById("pagoComentario");

  if (title) title.textContent = "Realizar Pago";
  if (vendorInput) vendorInput.value = vendor;
  if (balanceInput) balanceInput.value = formatAmount(amount);
  if (montoInput) montoInput.value = "";
  if (fechaInput && !fechaInput.value) fechaInput.value = todayISO();
  if (comentarioInput) comentarioInput.value = "";

  modal.style.display = "flex";
}

function closePagoModal() {
  const modal = document.getElementById("modalPago");
  if (modal) modal.style.display = "none";
}

/* =========================
   MODAL COBRO / DEBITAR
   ========================= */

function openCobroModal(vendor, amount) {
  const modal = document.getElementById("modalCobro");
  if (!modal) return;

  const title = document.getElementById("cobroTitle");
  const vendorInput = document.getElementById("cobroVendor");
  const balanceInput = document.getElementById("cobroBalance");
  const montoInput = document.getElementById("cobroMonto");
  const fechaInput = document.getElementById("cobroFecha");
  const comentarioInput = document.getElementById("cobroComentario");

  if (title) title.textContent = "Realizar Cobro";
  if (vendorInput) vendorInput.value = vendor;
  if (balanceInput) balanceInput.value = formatAmount(amount);
  if (montoInput) montoInput.value = "";
  if (fechaInput && !fechaInput.value) fechaInput.value = todayISO();
  if (comentarioInput) comentarioInput.value = "";

  modal.style.display = "flex";
}

function closeCobroModal() {
  const modal = document.getElementById("modalCobro");
  if (modal) modal.style.display = "none";
}

/* =========================
   UTIL
   ========================= */

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return yyyy + "-" + mm + "-" + dd;
}

/* =========================
   FÈMEN MODAL SI PEZE DEYÒ
   ========================= */

window.addEventListener("click", function(e) {
  const pago = document.getElementById("modalPago");
  const cobro = document.getElementById("modalCobro");

  if (e.target === pago) closePagoModal();
  if (e.target === cobro) closeCobroModal();
});

/* =========================
   EVENT BOUTON YO
   ========================= */

document.addEventListener("DOMContentLoaded", function() {
  const menuBtn = document.getElementById("menuBtn");
  const menuCloseBtn = document.getElementById("menuCloseBtn");
  const overlay = document.getElementById("menuOverlay");

  if (menuBtn) menuBtn.addEventListener("click", openSideMenu);
  if (menuCloseBtn) menuCloseBtn.addEventListener("click", closeSideMenu);
  if (overlay) overlay.addEventListener("click", closeSideMenu);
});

function cleanAmount(txt) {
  return parseFloat(String(txt).replace(/,/g, "").trim()) || 0;
}

document.addEventListener("click", function(e) {
  const balanceCell = e.target.closest(".result-ok, .result-bad");
  if (!balanceCell) return;

  const row = balanceCell.closest("tr");
  if (!row) return;

  const vendorCell = row.querySelector(".vendor-name");
  if (!vendorCell) return;

  const vendor = vendorCell.textContent.trim();
  const amount = cleanAmount(balanceCell.textContent);

  if (balanceCell.classList.contains("result-bad") || amount < 0) {
    openPagoModal(vendor, Math.abs(amount));
  } else {
    openCobroModal(vendor, Math.abs(amount));
  }
});

</script>

</body>
</html>
  `);
});

module.exports = router;




