const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const VENDEURS_FILE = path.join(__dirname, "vendeurs.json");
console.log("ADMIN VENDEURS_FILE =", VENDEURS_FILE);

const TICKETS_FILE = path.join(__dirname, "tickets.json");

function readTicketsArray() {
  try {
    if (!fs.existsSync(TICKETS_FILE)) {
      fs.writeFileSync(TICKETS_FILE, JSON.stringify([], null, 2), "utf8");
    }

    const raw = fs.readFileSync(TICKETS_FILE, "utf8").trim();
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Erreur lecture tickets.json :", err);
    return [];
  }
}

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

function parseAmount(val) {
  if (val == null || val === "") return 0;
  const num = Number(String(val).replace(/,/g, "").trim());
  return Number.isFinite(num) ? num : 0;
}

function formatAmount(val) {
  const num = parseAmount(val);
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function todayFR() {
  return new Date().toLocaleDateString("fr-FR");
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

function normalizeVendor(data = {}) {
  const nombre = String(data.nombre || data.nom || "").trim();
  const zona = String(data.zona || data.groupe || "").trim();
  const clave = String(data.clave || data.password || "").trim();

  return {
    nom: nombre,
    nombre,
    groupe: zona,
    zona,
    password: clave,
    clave,
    estatus: String(data.estatus || "Activo"),
    app: String(data.app || "2.9.32"),
    conexion: String(data.conexion || ""),
    apellido: String(data.apellido || ""),
    cedula: String(data.cedula || ""),
    telefono: String(data.telefono || ""),
    direccion: String(data.direccion || ""),
    sexo: String(data.sexo || "-"),

    // Données ventes / balance
    venta: parseAmount(data.venta),
    premiosMonto: parseAmount(data.premiosMonto),
    balance: parseAmount(data.balance),
movimientos: Array.isArray(data.movimientos)
  ? data.movimientos.map((m) => ({
      id: m.id || Date.now(),
      tipo: String(m.tipo || ""),
      monto: parseAmount(m.monto),
      fecha: String(m.fecha || todayFR()),
      hora: String(m.hora || m.heure || m.time || ""),
      comentario: String(m.comentario || "")
    }))
  : [],

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

    conexiones: Array.isArray(data.conexiones)
      ? data.conexiones.map(normalizeConnection)
      : []
  };
}

function objectToArray(obj) {
  return Object.keys(obj).map((id) => {
    const v = normalizeVendor(obj[id] || {});
    return {
      id,
      ...v
    };
  });
}

function getCommissionRate(vendor) {
  const general =
    parseAmount(vendor?.comision?.general) ||
    parseAmount(vendor?.comision?.zona) ||
    0;
  return general;
}

function getVentaStats(vendor, id) {
  const venta = parseAmount(vendor.venta);
  const premios = parseAmount(vendor.premiosMonto);
  const rate = getCommissionRate(vendor);
  const comision = (venta * rate) / 100;
  const resultado = venta - comision - premios;
  const balance = parseAmount(vendor.balance) + resultado;

  return {
    id,
    nombre: vendor.nombre || vendor.nom || id,
    zona: vendor.zona || vendor.groupe || "",
    venta,
    comision,
    premios,
    resultado,
    balance,
    movimientos: vendor.movimientos || [],
    estatus: vendor.estatus || "Activo"
  };
}

function buildVentasRows(obj) {
  return Object.keys(obj)
    .map((id) => getVentaStats(normalizeVendor(obj[id]), id))
    .filter((row) => row.venta > 0 || row.premios > 0 || row.comision > 0 || row.resultado !== 0)
    .sort((a, b) => b.resultado - a.resultado);
}

function buildBalanceRows(obj) {
  return Object.keys(obj)
    .map((id) => getVentaStats(normalizeVendor(obj[id]), id))
    .sort((a, b) => b.balance - a.balance);
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

router.get("/api/reportes/ventas", (req, res) => {
  try {
    const start = String(req.query.start || "").trim();
    const end = String(req.query.end || "").trim();

    const vendeurs = readVendeursObject();
    const tickets = readTicketsArray();
    const map = {};

    function ticketDay(t) {
      if (t.dateLabel) {
        const p = String(t.dateLabel).split("/");
        if (p.length === 3) {
          return p[2] + "-" + p[1].padStart(2, "0") + "-" + p[0].padStart(2, "0");
        }
      }

      const d = new Date(t.createdAt || Date.now());
      return d.getFullYear() + "-" +
        String(d.getMonth() + 1).padStart(2, "0") + "-" +
        String(d.getDate()).padStart(2, "0");
    }

    tickets.forEach((t) => {
      const d = ticketDay(t);

      if (start && d < start) return;
      if (end && d > end) return;

      const id = String(t.vendeur || "").trim().toUpperCase();
      if (!id) return;

      const vendor = normalizeVendor(vendeurs[id] || {});
      const status = String(t.status || "").trim().toUpperCase();

      if (!map[id]) {
        map[id] = {
          id,
          nombre: vendor.nombre || vendor.nom || id,
          zona: vendor.zona || vendor.groupe || "",
          venta: 0,
          comision: 0,
          premios: 0,
          resultado: 0,
          estatus: vendor.estatus || "Activo"
        };
      }

      if (status !== "ANILE") {
        map[id].venta += parseAmount(t.total);
      }

      if (status === "GANYE") {
        map[id].premios += parseAmount(t.premio);
      }
    });

    Object.keys(map).forEach((id) => {
      const vendor = normalizeVendor(vendeurs[id] || {});
      const rate = getCommissionRate(vendor);
      map[id].comision = (map[id].venta * rate) / 100;
      map[id].resultado = map[id].venta - map[id].comision - map[id].premios;
    });

    res.json(Object.values(map));
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

router.get("/api/reportes/balance", (req, res) => {
  try {
    const date = String(req.query.date || "").trim();

    function toISODate(value) {
      if (!value) return "";
      const s = String(value).trim();

      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

      const p = s.split("/");
      if (p.length === 3) {
        return p[2] + "-" + p[1].padStart(2, "0") + "-" + p[0].padStart(2, "0");
      }

      const d = new Date(s);
      if (isNaN(d.getTime())) return "";
      return d.getFullYear() + "-" +
        String(d.getMonth() + 1).padStart(2, "0") + "-" +
        String(d.getDate()).padStart(2, "0");
    }

    function movementEffect(m) {
      const tipo = String(m.tipo || "").toLowerCase();
      const monto = parseAmount(m.monto);
      return tipo === "cobro" ? monto : -monto;
    }

    function ticketDay(t) {
      if (t.dateLabel) return toISODate(t.dateLabel);

      const d = new Date(t.createdAt || Date.now());
      return d.getFullYear() + "-" +
        String(d.getMonth() + 1).padStart(2, "0") + "-" +
        String(d.getDate()).padStart(2, "0");
    }

    const selectedDate = date || toISODate(new Date());
    const vendeurs = readVendeursObject();
    const tickets = readTicketsArray();
    const map = {};

    Object.keys(vendeurs).forEach((id) => {
      const vendor = normalizeVendor(vendeurs[id] || {});
      const movimientos = Array.isArray(vendor.movimientos) ? vendor.movimientos : [];

      const allMovementsTotal = movimientos.reduce((s, m) => {
        return s + movementEffect(m);
      }, 0);

      const baseBalance = parseAmount(vendor.balance) - allMovementsTotal;

      const movementsUntilDate = movimientos.reduce((s, m) => {
        const d = toISODate(m.fecha);
        if (selectedDate && d && d > selectedDate) return s;
        return s + movementEffect(m);
      }, 0);

      map[id] = {
        id,
        nombre: vendor.nombre || vendor.nom || id,
        zona: vendor.zona || vendor.groupe || "",
        balance: baseBalance + movementsUntilDate,
        estatus: vendor.estatus || "Activo"
      };
    });

    tickets.forEach((t) => {
      const id = String(t.vendeur || "").trim().toUpperCase();
      if (!id) return;

      const d = ticketDay(t);
      if (selectedDate && d && d > selectedDate) return;

      if (!map[id]) {
        map[id] = {
          id,
          nombre: id,
          zona: "",
          balance: 0,
          estatus: "Activo"
        };
      }

      const vendor = normalizeVendor(vendeurs[id] || {});
      const rate = getCommissionRate(vendor);
      const status = String(t.status || "").trim().toUpperCase();

      if (status !== "ANILE") {
        const venta = parseAmount(t.total);
        const premios = status === "GANYE" ? parseAmount(t.premio) : 0;
        const comision = (venta * rate) / 100;
        map[id].balance += venta - comision - premios;
      }
    });

    res.json(Object.values(map));
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

router.get("/api/vendors/:id", (req, res) => {
  try {
    const id = String(req.params.id || "").trim().toUpperCase();
    const obj = readVendeursObject();
    const vendor = obj[id];

    if (!vendor) {
      return res.status(404).json({ message: "Vendeur introuvable" });
    }

    res.json({
      balance: vendor.balance || 0,
      movimientos: vendor.movimientos || []
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
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

router.delete("/api/vendors/:id/movimientos/:mid", (req, res) => {
  try {
    const id = String(req.params.id).toUpperCase();
    const mid = Number(req.params.mid);

    const obj = readVendeursObject();
    const vendor = normalizeVendor(obj[id]);

    if (!vendor) {
      return res.status(404).json({ ok: false });
    }

    const index = vendor.movimientos.findIndex(m => m.id === mid);

    if (index === -1) {
      return res.status(404).json({ ok: false });
    }

    const movement = vendor.movimientos[index];

    // 🔥 RESTORE BALANCE
    if (movement.tipo === "cobro") {
      vendor.balance -= movement.monto;
    } else {
      vendor.balance += movement.monto;
    }

    vendor.movimientos.splice(index, 1);

    obj[id] = vendor;
    writeVendeursObject(obj);

    res.json({ ok: true, balance: vendor.balance });

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

router.post("/api/vendors/:id/balance-action", (req, res) => {
  try {
    const id = String(req.params.id || "").trim().toUpperCase();
    const { tipo, monto, fecha, comentario } = req.body;

    const obj = readVendeursObject();
    if (!obj[id]) {
      return res.status(404).json({ ok: false });
    }

    const vendor = normalizeVendor(obj[id]);

const now = new Date();

const movement = {
  id: Date.now(),
  tipo,
  monto: parseAmount(monto),
  fecha: fecha || todayFR(),
  hora: now.getHours().toString().padStart(2,"0") + ":" + now.getMinutes().toString().padStart(2,"0"),
  comentario: comentario || ""
};

    // 🔥 AJUSTE BALANCE
    if (tipo === "cobro") {
      vendor.balance += movement.monto;
    } else {
      vendor.balance -= movement.monto;
    }

    vendor.movimientos.push(movement);

    obj[id] = vendor;
    writeVendeursObject(obj);

    res.json({ ok: true, balance: vendor.balance });

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

function writeTicketsArray(data) {
  fs.writeFileSync(TICKETS_FILE, JSON.stringify(data, null, 2), "utf8");
}

router.get("/api/reportes/tickets", (req, res) => {
  try {
    const tickets = readTicketsArray();
    res.json(tickets);
  } catch (err) {
    console.error("Erreur report tickets :", err);
    res.status(500).json([]);
  }
});

router.post("/api/tickets/:id/anile", (req, res) => {
  try {
    const ticketId = String(req.params.id || "").trim();
    const tickets = readTicketsArray();

    const index = tickets.findIndex(t => String(t.id || "").trim() === ticketId);

    if (index === -1) {
      return res.status(404).json({ ok: false, message: "Ticket introuvable" });
    }

    tickets[index].status = "ANILE";
    tickets[index].anilePar = "ADMIN";
    tickets[index].anileAt = new Date().toISOString();

    writeTicketsArray(tickets);

    res.json({ ok: true, ticket: tickets[index] });
  } catch (err) {
    console.error("Erreur anile ticket :", err);
    res.status(500).json({ ok: false, message: "Erreur anile ticket" });
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
.submenu-item.active{
 background:linear-gradient(90deg,#6d63ff,#7d73ff);
 color:#fff;
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
.filter-input,.filter-select,.date-range input,.field-input,.field-select,.field-textarea{
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
.field-textarea{
 min-height:120px;
 padding:12px 16px;
 font-size:16px;
 resize:vertical;
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
 color:#2fbf71;
 font-weight:700;
 cursor:pointer;
}

.balance-positive{
 color:#2fbf71;
 font-weight:700;
 font-size:16px;
 cursor:pointer;
}

#transactionsPage .balance-positive{
 color:#7b72ff;
}

#ventasTable tfoot td {
  padding: 18px 14px;
  font-weight: 800;
  vertical-align: middle;
}

.result-bad,.balance-negative{
 color:#ff6767;
 font-weight:700;
 cursor:pointer;
}
.page-block{background:transparent;}
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
.conn-actions-wrap,.balance-actions-wrap{
 position:static;
 display:inline-block;
}
.conn-menu-btn,.balance-menu-btn{
 border:none;
 background:transparent;
 color:#cfd5f0;
 font-size:24px;
 cursor:pointer;
 line-height:1;
}

.balance-menu{
 display:none;
 position:fixed;
 min-width:180px;
 background:#3a3f5a;
 border-radius:12px;
 box-shadow:0 10px 28px rgba(0,0,0,.28);
 padding:8px 0;
 z-index:99999;
}
 .conn-menu.show,.balance-menu.show{
 display:block;
}
.conn-menu-item,.balance-menu-item{
 padding:12px 16px;
 cursor:pointer;
 font-size:16px;
 color:#e5e9f8;
}
.conn-menu-item:hover,.balance-menu-item:hover{
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
.modal-overlay{
 position:fixed;
 inset:0;
 background:rgba(0,0,0,.45);
 display:none;
 align-items:center;
 justify-content:center;
 z-index:12000;
 padding:18px;
}
.modal-card{
 width:100%;
 max-width:760px;
 background:#313553;
 border-radius:18px;
 padding:24px;
 position:relative;
}
.modal-close{
 position:absolute;
 top:10px;
 right:14px;
 font-size:34px;
 color:#d7dcef;
 cursor:pointer;
}
.modal-title{
 font-size:20px;
 margin-bottom:16px;
}
.modal-actions{
 display:flex;
 justify-content:flex-end;
 gap:12px;
 margin-top:16px;
}
.modal-btn{
 min-width:150px;
 height:54px;
 border:none;
 border-radius:12px;
 cursor:pointer;
 font-size:18px;
 font-weight:700;
}
.modal-btn.cancel{
 background:#4a4f69;
 color:#d7dcef;
}
.modal-btn.ok{
 background:linear-gradient(90deg,#6c6cff,#7a5cff);
 color:#fff;
}
#tab-conexiones .table-card{overflow:visible;}
#tab-conexiones .table-scroll{
 overflow-x:auto;
 overflow-y:visible;
 -webkit-overflow-scrolling:touch;
}
@media (max-width:700px){
 .square-btn,.editor-top-btn{width:132px;height:70px}
 .triple-grid{grid-template-columns:1fr;}
 .tab{padding:16px 22px;font-size:17px;}
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

  <div class="side-menu-item" id="menu-config" onclick="toggleSubmenu('configMenu')">
    <span>Configuración</span><span>></span>
  </div>
  <div id="configMenu" class="submenu-box">
    <div class="submenu-item">Grupo</div>
  </div>

  <div class="side-menu-item" id="menu-limites" onclick="toggleSubmenu('limitesMenu')">
    <span>Límites</span><span>></span>
  </div>
  <div id="limitesMenu" class="submenu-box">
    <div class="submenu-item">Ajustes</div>
    <div class="submenu-item">Estadísticas</div>
  </div>

  <div class="side-menu-item" id="menu-loterias"><span>Loterías</span></div>
  <div class="side-menu-item" id="menu-vendors" onclick="goPage('vendors')"><span>Vendedores</span></div>
  <div class="side-menu-item" id="menu-cuenta"><span>Mi Cuenta</span></div>

  <div class="side-menu-section">MONITOREO</div>
  <div class="side-menu-item" id="menu-tickets" onclick="goPage('tickets')">
  <span>Tickets</span>
</div>
  <div class="side-menu-item"><span>Sorteos</span></div>

  <div class="side-menu-section">REPORTES</div>
  <div class="side-menu-item" id="menu-venta" onclick="toggleSubmenu('ventaMenu')">
    <span>Venta</span><span>></span>
  </div>
  <div id="ventaMenu" class="submenu-box">
  <div class="submenu-item" onclick="goPage('ventas')">General</div>
  <div class="submenu-item" onclick="goPage('loteria')">Lotería</div>
  <div class="submenu-item" onclick="goPage('jugada')">Jugada</div>
  <div class="submenu-item" onclick="goPage('numero')">Número</div>
  <div class="submenu-item" onclick="goPage('grupo')">Grupo</div>
</div>

  <div class="side-menu-section">FLUJO DE EFECTIVO</div>
  <div class="side-menu-item" onclick="goPage('transactions')">
  <span>Transactions</span>
</div>

  <div class="side-menu-item" id="menu-balance" onclick="toggleSubmenu('balanceMenu')">
    <span>Balance</span><span>></span>
  </div>
  <div id="balanceMenu" class="submenu-box">
    <div class="submenu-item" id="submenu-balance-vendor" onclick="goPage('balance_vendor')">Vendedor</div>
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
        <select id="ventasZonaFilter" class="filter-select"></select>
      </div>

      <div class="filter-group">
        <label class="filter-label">Vendedor</label>
        <select id="ventasVendorFilter" class="filter-select"></select>
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
        <select id="ventasComisionFilter" class="filter-select">
          <option value="">Todas</option>
          <option value="3">3%</option>
          <option value="5">5%</option>
          <option value="8">8%</option>
          <option value="10">10%</option>
        </select>
      </div>
    </div>

    <div class="table-card">
      <div class="table-scroll">
       <table id="ventasTable">
          <thead>
            <tr>
              <th>VENDEDOR</th>
              <th>VENTA</th>
              <th>COMISIÓN</th>
              <th>PREMIOS</th>
              <th>RESULTADO</th>
            </tr>
          </thead>
          <tbody id="ventasTableBody"></tbody>
          <tfoot id="ventasTableFoot"></tfoot>
        </table>
      </div>
    </div>
  </div>

  <div id="balanceVendorPage" class="page-block hidden">
    <div class="page-title">Balance Vendedores</div>
<div id="balanceTotalTop" style="font-size:26px;font-weight:800;color:#79d98d;margin:6px 4px 14px;">
  0.00
</div>

    <div class="filters">
      <div class="filter-group">
        <label class="filter-label">Grupo</label>
        <select id="balanceGrupoFilter" class="filter-select"></select>
      </div>
      <div class="filter-group">
        <label class="filter-label">Vendedor</label>
        <select id="balanceVendorFilter" class="filter-select"></select>
      </div>
      <div class="filter-group">
        <label class="filter-label">Fecha</label>
        <input type="date" id="balanceFecha" class="filter-input">
      </div>
    </div>

    <div class="table-card">
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>VENDEDOR</th>
              <th>BALANCE</th>
              <th>FECHA</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="balanceTableBody"></tbody>
        </table>
      </div>
    </div>
  </div>

 <div id="ticketsPage" class="page-block hidden">
  <div class="page-title">Tickets y Jugadas</div>
<div class="tabs-scroll">
  <div class="tabs tickets-tabs">
    <div class="tab active" onclick="showTicketsTab('tickets')">TICKETS</div>
    <div class="tab" onclick="showTicketsTab('jugadas')">JUGADAS</div>
    <div class="tab" onclick="showTicketsTab('loterias')">LOTERIAS</div>
    <div class="tab" onclick="showTicketsTab('vendedores')">VENDEDORES</div>
  </div>
</div>

<div style="padding:0;">
  <div id="ticketsFilters"></div>
</div>

<div class="table-card">
  <div class="table-scroll">
    <table>
      <thead id="ticketsHead"></thead>
      <tbody id="ticketsBody"></tbody>
    </table>
  </div>
</div>
</div>

<div id="transactionsPage" class="page-block hidden">
  <div class="page-title">Transactions</div>

  <div class="filters">
    <div class="filter-group">
      <div class="date-range">
        <div>
          <label>Desde</label>
          <input type="date" id="transactionStart">
        </div>
        <div>
          <label>Hasta</label>
          <input type="date" id="transactionEnd">
        </div>
      </div>
    </div>

    <div class="filter-group">
      <label class="filter-label">Grupo</label>
      <select id="transactionGrupoFilter" class="filter-select"></select>
    </div>

    <div class="filter-group">
      <label class="filter-label">Vendedor</label>
      <select id="transactionVendorFilter" class="filter-select"></select>
    </div>
  </div>

  <div class="table-card" style="padding:14px;">
    <div style="display:flex;justify-content:space-between;gap:10px;font-size:20px;font-weight:700;">
      <div class="result-bad">Pagos<br><span id="totalPagos">0.00</span></div>
      <div class="result-ok">Cobros<br><span id="totalCobros">0.00</span></div>
      <div class="balance-positive">Resultado<br><span id="totalResultado">0.00</span></div>
    </div>
  </div>

  <div class="table-card">
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th>FECHA</th>
            <th>MONTO</th>
            <th>TRANSACCIÓN</th>
            <th>AGENTE</th>
            <th>REALIZADO POR</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="transactionsTableBody"></tbody>
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
        <div class="field-group">
          <div class="field-label">Venta del día</div>
          <input id="vd_venta" class="field-input" value="0" />
        </div>
        <div class="field-group">
          <div class="field-label">Premios del día</div>
          <input id="vd_premiosMonto" class="field-input" value="0" />
        </div>
        <div class="field-group">
          <div class="field-label">Balance actual</div>
          <input id="vd_balance" class="field-input" value="0" />
        </div>
      </div>

      <div class="editor-section vendor-tab-panel hidden" id="tab-config">
        <div class="field-group">
          <div class="field-label">Límite Diario</div>
          <input id="cfg_limite_diario" class="field-input" value="0" />
        </div>
        <div class="field-group">
          <div class="field-label">Crédito</div>
          <input id="cfg_credito" class="field-input" value="0" />
        </div>
        <div class="field-group">
          <div class="field-label">Deshabilitar Loterías</div>
          <input id="cfg_deshabilitar_loterias" class="field-input" />
        </div>
        <div class="field-group">
          <div class="field-label">Deshabilitar Jugadas</div>
          <input id="cfg_deshabilitar_jugadas" class="field-input" />
        </div>
        <div class="field-group">
          <div class="field-label">Mezcla de números</div>
          <input id="cfg_mezcla_numeros" class="field-input" value="0" />
        </div>

        <div class="switch-row"><div id="sw_cuadre" class="switch"></div><div class="switch-label">Habilitar Cuadre</div></div>
        <div class="switch-row"><div id="sw_whatsapp" class="switch"></div><div class="switch-label">Ventas por WhatsApp</div></div>
        <div class="switch-row"><div id="sw_nombre_ticket" class="switch"></div><div class="switch-label">Usar nombre en Ticket</div></div>

        <div class="field-group">
          <div class="field-label">Deshabilitar Decimales</div>
          <input id="cfg_decimales" class="field-input" value="0" />
        </div>

        <div class="field-group">
          <div class="field-label">Deshabilitar Terminales</div>
          <input id="cfg_terminales" class="field-input" value="0" />
        </div>

        <div class="switch-row"><div id="sw_prepago" class="switch"></div><div class="switch-label">Habilitar Prepago</div></div>
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

<div id="balanceModal" class="modal-overlay">
  <div class="modal-card">
    <div class="modal-close" onclick="closeBalanceModal()">×</div>
    <div class="modal-title" id="balanceModalTitle">Balance</div>

    <div class="field-group">
      <div class="field-label">Vendedor</div>
      <input id="balanceVendorName" class="field-input" readonly />
    </div>

    <div class="field-group">
      <div class="field-label">Balance actual</div>
      <input id="balanceActual" class="field-input" readonly />
    </div>

    <div class="field-group">
      <div class="field-label">Monto</div>
      <input id="balanceMonto" class="field-input" placeholder="0.00" />
    </div>

    <div class="field-group">
      <div class="field-label">Fecha</div>
      <input id="balanceFechaInput" type="date" class="field-input" />
    </div>

    <div class="field-group">
      <div class="field-label">Comentario</div>
      <textarea id="balanceComentario" class="field-textarea"></textarea>
    </div>

    <div class="modal-actions">
      <button class="modal-btn cancel" onclick="closeBalanceModal()">Cerrar</button>
      <button class="modal-btn ok" onclick="submitBalanceAction()">Procesar</button>
    </div>
  </div>
</div>

<script>
let currentPage = "ventas";
let currentVendorIndex = null;
let vendors = [];
let ventasRows = [];
let balanceRows = [];
let currentBalanceAction = "";
let currentBalanceVendorId = "";

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

function parseAmount(val){
  if(val == null || val === "") return 0;
  const num = Number(String(val).replace(/,/g,"").trim());
  return Number.isFinite(num) ? num : 0;
}

function formatAmount(val){
  const num = parseAmount(val);
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function todayISO(){
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  return yyyy + "-" + mm + "-" + dd;
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

function resetMenuActive(){
  document.querySelectorAll(".side-menu-item, .submenu-item").forEach(el => {
    el.classList.remove("active");
  });
}

function setMenuActive(page){
  resetMenuActive();

  if(page === "ventas"){
    if(byId("menu-venta")) byId("menu-venta").classList.add("active");
    if(byId("ventaMenu")) byId("ventaMenu").classList.add("open");
    if(byId("submenu-ventas")) byId("submenu-ventas").classList.add("active");
  }else if(page === "vendors" || page === "editor"){
    if(byId("menu-vendors")) byId("menu-vendors").classList.add("active");
  }else if(page === "balance_vendor"){
    if(byId("menu-balance")) byId("menu-balance").classList.add("active");
    if(byId("balanceMenu")) byId("balanceMenu").classList.add("open");
    if(byId("submenu-balance-vendor")) byId("submenu-balance-vendor").classList.add("active");
  }
}

async function loadVendorsFromServer(){
  try{
    const res = await fetch("/api/vendors");
    const data = await res.json();
    vendors = Array.isArray(data) ? data : [];
    renderVendorTable();
    fillVentasVendorSelect();
    fillBalanceVendorSelect();
    fillTransactionFilters();
  }catch(err){
    console.error(err);
    vendors = [];
    renderVendorTable();
  }
}

async function loadVentasReport(){
  try{
    const start = getValue("fechaInicio") || todayISO();
    const end = getValue("fechaFin") || start;

    setValue("fechaInicio", start);
    setValue("fechaFin", end);

    const res = await fetch(
      "/api/reportes/ventas?start=" + encodeURIComponent(start) +
      "&end=" + encodeURIComponent(end)
    );

    const data = await res.json();
    ventasRows = Array.isArray(data) ? data : [];
    renderVentasTable();
  }catch(err){
    console.error(err);
    ventasRows = [];
    renderVentasTable();
  }
}

async function loadBalanceReport(){
  try{
    const fecha = getValue("balanceFecha") || todayISO();
    setValue("balanceFecha", fecha);

    const res = await fetch(
      "/api/reportes/balance?date=" + encodeURIComponent(fecha)
    );

    const data = await res.json();
    balanceRows = Array.isArray(data) ? data : [];
    renderBalanceTable();
  }catch(err){
    console.error(err);
    balanceRows = [];
    renderBalanceTable();
  }
}


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
    loadVentasReport();
    loadBalanceReport();
    goPage("ventas");
  } else {
    alert("Login incorrect");
  }
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

function toggleSubmenu(id){
  const box = byId(id);
  if(!box) return;
  box.classList.toggle("open");
}

let ticketsRows = [];
let ticketsTab = "tickets";

async function loadTicketsReport(){
  const res = await fetch("/api/reportes/tickets?reload=" + Date.now());
  const data = await res.json();
  ticketsRows = Array.isArray(data) ? data : [];
  renderTicketsReport();
}

function showTicketsTab(tab){
  ticketsTab = tab;

  document.querySelectorAll("#ticketsPage .tab").forEach(function(t){
    t.classList.remove("active");
  });

  var tabs = document.querySelectorAll("#ticketsPage .tab");
  if(tab === "tickets" && tabs[0]) tabs[0].classList.add("active");
  if(tab === "jugadas" && tabs[1]) tabs[1].classList.add("active");
  if(tab === "loterias" && tabs[2]) tabs[2].classList.add("active");
  if(tab === "vendedores" && tabs[3]) tabs[3].classList.add("active");

  renderTicketsReport();
}

function getStatusIcon(status) {
  if (!status) return "";

  status = status.toUpperCase();

  if (status.includes("PEDI")) {
    return '<span style="color:#ff4d4d;">✖</span>';
  }

  if (status.includes("ANATAN")) {
    return '<span style="color:#7c4dff;">🕒</span>';
  }

  if (status.includes("ANILE")) {
    return '<span style="color:#999;">🚫</span>';
  }

  if (status.includes("GANYE")) {
    return '<span style="color:#4caf50;">✔</span>';
  }

  return status;
}


function renderTicketsReport(){
  var filters = byId("ticketsFilters");
  var head = byId("ticketsHead");
  var body = byId("ticketsBody");
  if(!filters || !head || !body) return;

  var oldId = safe(byId("ticketFilterId") ? byId("ticketFilterId").value : "");
  var oldDate = safe(byId("ticketFilterDate") ? byId("ticketFilterDate").value : "") || todayISO();
  var oldVendor = safe(byId("ticketFilterVendor") ? byId("ticketFilterVendor").value : "");
  var oldStatus = safe(byId("ticketFilterStatus") ? byId("ticketFilterStatus").value : "");

  var vendorOptions = '<option value="">-</option>';
  vendors.forEach(function(v){
    vendorOptions += '<option value="' + safe(v.id) + '">' + safe(v.nombre || v.nom || v.id) + '</option>';
  });

  filters.innerHTML =
    '<label>ID</label>' +
    '<input class="filter-input" id="ticketFilterId" oninput="renderTicketsReport()" value="' + oldId + '">' +

    '<label>Fecha</label>' +
    '<input type="date" class="filter-input" id="ticketFilterDate" onchange="renderTicketsReport()" value="' + oldDate + '">' +

    '<label>Vendedor</label>' +
    '<select class="filter-select" id="ticketFilterVendor" onchange="renderTicketsReport()">' +
      vendorOptions +
    '</select>' +

    '<label>Estatus</label>' +
    '<select class="filter-select" id="ticketFilterStatus" onchange="renderTicketsReport()">' +
      '<option value="">-</option>' +
      '<option value="ANATAN">AN ATAN</option>' +
      '<option value="GANYE">GANYE</option>' +
      '<option value="PEDI">PEDI</option>' +
      '<option value="ANILE">ANILE</option>' +
    '</select>';

  setValue("ticketFilterVendor", oldVendor);
  setValue("ticketFilterStatus", oldStatus);

  var rows = ticketsRows.slice();

  rows = rows.filter(function(t){
    var d;

    if(t.createdAt){
      d = new Date(t.createdAt);
    }else if(t.dateLabel){
      var p = String(t.dateLabel).split("/");
      if(p.length === 3){
        d = new Date(p[2] + "-" + p[1].padStart(2,"0") + "-" + p[0].padStart(2,"0"));
      }else{
        d = new Date();
      }
    }else{
      d = new Date();
    }

    var day = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");

    if(oldId && !safe(t.id).toLowerCase().includes(oldId.toLowerCase())) return false;
    if(oldDate && day !== oldDate) return false;
    if(oldVendor && safe(t.vendeur) !== oldVendor) return false;
    if(oldStatus && safe(t.status).toUpperCase() !== oldStatus) return false;

    return true;
  });

  head.innerHTML =
    '<tr>' +
      '<th>ID</th>' +
      '<th>FECHA</th>' +
      '<th>VENDEDOR</th>' +
      '<th>JUGS</th>' +
      '<th>MONTO</th>' +
      '<th>PREMIO</th>' +
      '<th>ESTADO</th>' +
      '<th></th>' +
    '</tr>';

  if(!rows.length){
    body.innerHTML = '<tr><td colspan="8" class="empty-state">Pa gen tickets pou dat sa</td></tr>';
    return;
  }

  body.innerHTML = rows.map(function(t){
    return '<tr>' +
      '<td>🖨 ' + safe(t.id) + '</td>' +
      '<td>' + safe(t.createdAtLabel || t.dateLabel || "") + '</td>' +
      '<td>' + safe(t.vendeurNom || t.vendeur) + '</td>' +
      '<td>' + (Array.isArray(t.jeux) ? t.jeux.length : 0) + '</td>' +
      '<td>' + formatAmount(t.total) + '</td>' +
      '<td>' + formatAmount(t.premio) + '</td>' +
      '<td style="text-align:center;">' + getStatusIcon(t.status || "ANATAN") + '</td>' +
     '<td><button class="mini-btn" data-id="' + safe(t.id) + '">🔍</button></td>' + 
    '</tr>';
  }).join("");
}

function goPage(page){
  currentPage = page;

  const today = todayISO();

  setValue("fechaInicio", today);
  setValue("fechaFin", today);

  setValue("transactionStart", today);
  setValue("transactionEnd", today);

  setValue("balanceFecha", today);

  const ventasPage = byId("ventasPage");
  const ticketsPage = byId("ticketsPage");
  const vendorsPage = byId("vendorsPage");
  const editorPage = byId("vendorEditorPage");
  const balancePage = byId("balanceVendorPage");
  const transactionsPage = byId("transactionsPage");

  if(ventasPage) ventasPage.classList.add("hidden");
  if(ticketsPage) ticketsPage.classList.add("hidden");
  if(vendorsPage) vendorsPage.classList.add("hidden");
  if(editorPage) editorPage.classList.add("hidden");
  if(balancePage) balancePage.classList.add("hidden");
  if(transactionsPage) transactionsPage.classList.add("hidden");

  if(page === "ventas"){
    if(ventasPage) ventasPage.classList.remove("hidden");
    loadVentasReport();

  }else if(page === "ventas_loteria"){
    if(ventasPage) ventasPage.classList.remove("hidden");
    loadVentasLoteria();

  }else if(page === "ventas_jugada"){
    if(ventasPage) ventasPage.classList.remove("hidden");
    loadVentasJugada();

  }else if(page === "ventas_numero"){
    if(ventasPage) ventasPage.classList.remove("hidden");
    loadVentasNumero();

  }else if(page === "ventas_grupo"){
    if(ventasPage) ventasPage.classList.remove("hidden");
    loadVentasGrupo();

  }else if(page === "tickets"){
    if(ticketsPage) ticketsPage.classList.remove("hidden");
    loadTicketsReport();

  }else if(page === "vendors"){
    if(vendorsPage) vendorsPage.classList.remove("hidden");
    renderVendorTable();

  }else if(page === "editor"){
    if(editorPage) editorPage.classList.remove("hidden");

  }else if(page === "balance_vendor"){
    if(balancePage) balancePage.classList.remove("hidden");
    loadBalanceReport();

  }else if(page === "transactions"){
    if(transactionsPage) transactionsPage.classList.remove("hidden");
    renderTransactionsTable();
  }

  setMenuActive(page);
  closeSideMenu();
}

function renderTransactionsTable(){

  const tbody = byId("transactionsTableBody");
  if(!tbody) return;

  const start = getValue("transactionStart");
  const end = getValue("transactionEnd");
  const grupoFilter = getValue("transactionGrupoFilter");
  const vendorFilter = getValue("transactionVendorFilter");

  tbody.innerHTML = "";

  let rows = [];
  let totalPagos = 0;
  let totalCobros = 0;

  vendors.forEach(function(v){

    const movimientos = Array.isArray(v.movimientos) ? v.movimientos : [];

    movimientos.forEach(function(m){

      const fecha = safe(m.fecha);
      const tipo = String(m.tipo || "").toLowerCase();
      const monto = parseAmount(m.monto);
      const vendorId = v.id;
      const zona = safe(v.zona || v.groupe);

      if(start && fecha < start) return;
      if(end && fecha > end) return;
      if(grupoFilter && zona !== grupoFilter) return;
      if(vendorFilter && vendorId !== vendorFilter) return;

      if(tipo === "pago") totalPagos += monto;
      else totalCobros += monto;

      rows.push({
  vendorId,
  vendorName: v.nombre || v.nom || vendorId,
  id: m.id,
  tipo: safe(m.tipo).toLowerCase(),
  monto: parseAmount(m.monto),
  fecha,
  comentario: safe(m.comentario),
hora: safe(m.hora || m.heure || m.time || "")
});

    });

  });

  rows.sort(function(a,b){
    return String(b.fecha).localeCompare(String(a.fecha));
  });

  if(!rows.length){
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Pa gen transaction</td></tr>';
  }

  rows.forEach(function(r){

    const cls = r.tipo === "pago" ? "result-bad" : "result-ok";
    const label = r.tipo === "debitar" ? "DEBITAR" : r.tipo.toUpperCase();

    const tr = document.createElement("tr");

    const tdFecha = document.createElement("td");
    tdFecha.textContent = safe(r.fecha);

    const tdMonto = document.createElement("td");
    tdMonto.textContent = formatAmount(r.monto);

    const tdType = document.createElement("td");
    tdType.className = cls;
    tdType.textContent = label;

    const tdVendor = document.createElement("td");
    tdVendor.textContent = safe(r.vendorName);

    const tdBy = document.createElement("td");
    tdBy.textContent = "Admin";

const tdAction = document.createElement("td");

const searchBtn = document.createElement("button");
searchBtn.className = "mini-btn";
searchBtn.innerText = "🔍";
searchBtn.onclick = function(){
  alert(
    "Vendeur: " + safe(r.vendorName) +
    " | Type: " + (r.tipo === "pago" ? "PAGOS" : "COBROS") +
    " | Montant: " + formatAmount(r.monto) +
    " | Date: " + safe(r.fecha) +
    " | Heure: " + safe(r.hora || r.time || "")
  );
};

const btn = document.createElement("button");
btn.className = "mini-btn";
btn.innerText = "🗑";
btn.onclick = function(){
  deleteMovimiento(r.vendorId, r.id);
};

tdAction.appendChild(searchBtn);
tdAction.appendChild(btn);

    tr.appendChild(tdFecha);
    tr.appendChild(tdMonto);
    tr.appendChild(tdType);
    tr.appendChild(tdVendor);
    tr.appendChild(tdBy);
    tr.appendChild(tdAction);

    tbody.appendChild(tr);

  });

  const resultado = totalCobros - totalPagos;

  if(byId("totalPagos")) byId("totalPagos").textContent = formatAmount(totalPagos);
  if(byId("totalCobros")) byId("totalCobros").textContent = formatAmount(totalCobros);
  if(byId("totalResultado")) byId("totalResultado").textContent = formatAmount(resultado);

}

function fillVentasVendorSelect(){
  const el = byId("ventasVendorFilter");
  if(!el) return;
  const current = el.value;
  el.innerHTML = "";
  el.appendChild(makeOption("","- VENDEDOR -"));

  vendors.forEach(v=>{
    el.appendChild(makeOption(v.id, v.nombre || v.nom || v.id));
  });

  if(current) el.value = current;
}

function fillBalanceVendorSelect(){
  const el = byId("balanceVendorFilter");
  if(!el) return;
  const current = el.value;
  el.innerHTML = "";
  el.appendChild(makeOption("","- VENDEDOR -"));

  vendors.forEach(v=>{
    el.appendChild(makeOption(v.id, v.nombre || v.nom || v.id));
  });

  if(current) el.value = current;
}

function loadGrupoSelects(){
  const ids = ["vendorFilterGrupo","vd_zona","ventasZonaFilter","balanceGrupoFilter","transactionGrupoFilter"];

  ids.forEach(id=>{
    const el = byId(id);
    if(!el) return;

    const old = el.value;
    el.innerHTML = "";
    el.appendChild(makeOption("", "- GRUPO -"));

    gruposList.forEach(g=>{
      el.appendChild(makeOption(g, g));
    });

    el.value = old;
  });
}

function fillTransactionFilters(){
  const vendor = byId("transactionVendorFilter");
  if(!vendor) return;

  const old = vendor.value;
  vendor.innerHTML = "";
  vendor.appendChild(makeOption("", "- VENDEDOR -"));

  vendors.forEach(v=>{
    vendor.appendChild(makeOption(v.id, v.nombre || v.nom || v.id));
  });

  vendor.value = old;
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

function renderVentasTable(){
  const tbody = byId("ventasTableBody");
  const tfoot = byId("ventasTableFoot");
  if(!tbody || !tfoot) return;

  const zonaFilter = getValue("ventasZonaFilter");
  const vendorFilter = getValue("ventasVendorFilter");
  const comFilter = getValue("ventasComisionFilter");

  const rows = ventasRows.filter(r=>{
    const okZona = !zonaFilter || safe(r.zona) === zonaFilter;
    const okVendor = !vendorFilter || safe(r.id) === vendorFilter;
    const rate = vendors.find(v => v.id === r.id)?.comision?.general || "";
    const okCom = !comFilter || String(parseAmount(rate)) === String(parseAmount(comFilter));
    return okZona && okVendor && okCom;
  });

  tbody.innerHTML = "";
  tfoot.innerHTML = "";

  if(!rows.length){
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Pa gen vant pou moman an</td></tr>';
    return;
  }

  let totalVenta = 0;
  let totalComision = 0;
  let totalPremios = 0;
  let totalResultado = 0;

  rows.forEach((r, i)=>{
    totalVenta += parseAmount(r.venta);
    totalComision += parseAmount(r.comision);
    totalPremios += parseAmount(r.premios);
    totalResultado += parseAmount(r.resultado);

    const cls = parseAmount(r.resultado) >= 0 ? "result-ok" : "result-bad";

    tbody.innerHTML += \`
      <tr>
        <td class="vendor-name">\${i + 1}) \${safe(r.nombre)}</td>
        <td class="money">\${formatAmount(r.venta)}</td>
        <td class="money">\${formatAmount(r.comision)}</td>
        <td class="money">\${formatAmount(r.premios)}</td>
        <td class="\${cls}">\${parseAmount(r.resultado) < 0 ? "-" : ""}\${formatAmount(Math.abs(r.resultado))}</td>
      </tr>
    \`;
  });

tfoot.innerHTML =
  '<tr>' +
    '<td class="vendor-name"></td>' +
    '<td class="money">' + formatAmount(totalVenta) + '</td>' +
    '<td class="money">' + formatAmount(totalComision) + '</td>' +
    '<td class="money">' + formatAmount(totalPremios) + '</td>' +
    '<td class="' + (totalResultado >= 0 ? 'result-ok' : 'result-bad') + '">' +
      formatAmount(totalResultado) +
    '</td>' +
  '</tr>';
}

function toggleBalanceMenu(id, e){
  if(e) e.stopPropagation();

  const menu = byId("balance_menu_" + id);
  if(!menu) return;

  const wasOpen = menu.classList.contains("show");
  closeAllBalanceMenus();

  if(wasOpen) return;

  const btn = e ? e.currentTarget : null;
  if(!btn) return;

  const rect = btn.getBoundingClientRect();
  const menuWidth = 180;
  const menuHeight = 96;
  const gap = 8;

  let left = rect.left - menuWidth - gap;
  let top = rect.top - 10;

  if(left < 8){
    left = rect.right + gap;
  }

  if(left + menuWidth > window.innerWidth - 8){
    left = window.innerWidth - menuWidth - 8;
  }

  if(top + menuHeight > window.innerHeight - 8){
    top = window.innerHeight - menuHeight - 8;
  }

  if(top < 8){
    top = 8;
  }

  menu.style.left = left + "px";
  menu.style.top = top + "px";
  menu.style.right = "auto";
  menu.style.bottom = "auto";

  menu.classList.add("show");
}

function renderBalanceTable(){
  const tbody = byId("balanceTableBody");
  if(!tbody) return;

  const grupoFilter = getValue("balanceGrupoFilter");
  const vendorFilter = getValue("balanceVendorFilter");
  const fecha = getValue("balanceFecha") || todayISO();

  const rows = balanceRows.filter(r => {
    const id = safe(r.id || r.vendeur);
    const zona = safe(r.zona || r.groupe);

    const okGrupo = !grupoFilter || zona === grupoFilter;
    const okVendor = !vendorFilter || id === vendorFilter;

    return okGrupo && okVendor;
  });

  tbody.innerHTML = "";

  let totalBalance = 0;

  if(!rows.length){
    tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Pa gen done balance pou moman an</td></tr>';

    const totalTop = byId("balanceTotalTop");
    if(totalTop){
      totalTop.textContent = "0.00";
      totalTop.style.color = "#79d98d";
    }

    return;
  }

  rows.forEach(r => {
    const id = safe(r.id || r.vendeur);
    const nombre = safe(r.nombre || r.nom || id);

    const bal = parseAmount(
      r.balanceFinal !== undefined ? r.balanceFinal :
      r.balance !== undefined ? r.balance :
      r.resultado !== undefined ? r.resultado :
      0
    );

    totalBalance += bal;

    const cls = bal >= 0 ? "balance-positive" : "balance-negative";
    const cleanVal = (bal < 0 ? "-" : "") + formatAmount(Math.abs(bal));

    const tr = document.createElement("tr");

    const tdName = document.createElement("td");
    tdName.className = "vendor-name";
    tdName.textContent = nombre;

    const tdBalance = document.createElement("td");
    tdBalance.className = cls;
    tdBalance.textContent = cleanVal;

    const tdFecha = document.createElement("td");
    tdFecha.textContent = fecha;

    const tdAction = document.createElement("td");

    const wrap = document.createElement("div");
    wrap.className = "balance-actions-wrap";

    const btn = document.createElement("button");
    btn.className = "balance-menu-btn";
    btn.textContent = "⋮";
    btn.onclick = function(e){
      toggleBalanceMenu(id, e);
    };

    const menu = document.createElement("div");
    menu.className = "balance-menu";
    menu.id = "balance_menu_" + id;

    const pago = document.createElement("div");
    pago.className = "balance-menu-item";
    pago.textContent = "Pago";
    pago.onclick = function(){
      openBalanceModal(id, nombre, "pago", bal);
    };

    const debitar = document.createElement("div");
    debitar.className = "balance-menu-item";
    debitar.textContent = "Debitar";
    debitar.onclick = function(){
      openBalanceModal(id, nombre, "debitar", bal);
    };

    menu.appendChild(pago);
    menu.appendChild(debitar);

    wrap.appendChild(btn);
    wrap.appendChild(menu);
    tdAction.appendChild(wrap);

    tr.appendChild(tdName);
    tr.appendChild(tdBalance);
    tr.appendChild(tdFecha);
    tr.appendChild(tdAction);

    tbody.appendChild(tr);
  });

  const totalTop = byId("balanceTotalTop");
  if(totalTop){
    totalTop.textContent =
      (totalBalance < 0 ? "-" : "") + formatAmount(Math.abs(totalBalance));

    totalTop.style.color = totalBalance < 0 ? "#ff6767" : "#79d98d";
  }
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
    venta:0,
    premiosMonto:0,
    balance:0,
    movimientos:[],
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
  setValue("vd_venta", parseAmount(v.venta));
  setValue("vd_premiosMonto", parseAmount(v.premiosMonto));
  setValue("vd_balance", parseAmount(v.balance));

  setValue("cfg_limite_diario", cfg.limiteDiario || "0");
  setValue("cfg_credito", cfg.credito || "0");
  setValue("cfg_deshabilitar_loterias", cfg.deshabilitarLoterias || "");
  setValue("cfg_deshabilitar_jugadas", cfg.deshabilitarJugadas || "");
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
    venta: parseAmount(getValue("vd_venta", "0")),
    premiosMonto: parseAmount(getValue("vd_premiosMonto", "0")),
    balance: parseAmount(getValue("vd_balance", "0")),

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

    movimientos: current ? (Array.isArray(current.movimientos) ? current.movimientos : []) : [],
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

    const text = await res.text();
    let data = {};

    try{
      data = JSON.parse(text);
    }catch(e){
      alert("Server pa voye JSON. Repons lan: " + text);
      return;
    }

    if(!res.ok){
      alert(data.message || ("Erreur HTTP " + res.status));
      return;
    }

    alert("Vendedor guardado ✔");
    await loadVendorsFromServer();
    await loadVentasReport();
    await loadBalanceReport();
    goPage("vendors");

  }catch(err){
    console.error("Erreur save vendor:", err);
    alert("Erreur save vendor: " + err.message);
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
    await loadVentasReport();
    await loadBalanceReport();
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
  vendor.movimientos = [];
  vendor.venta = 0;
  vendor.premiosMonto = 0;

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
    await loadVentasReport();
    await loadBalanceReport();
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

function closeAllBalanceMenus(){
  document.querySelectorAll(".balance-menu").forEach(el => el.classList.remove("show"));
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

function openBalanceModal(vendorId, vendorName, tipo, currentBalance){
  currentBalanceVendorId = vendorId;
  currentBalanceAction = tipo;

  closeAllBalanceMenus();
  byId("balanceModal").style.display = "flex";
  byId("balanceModalTitle").textContent =
    tipo === "cobro" ? "Realizar Cobro" :
    tipo === "pago" ? "Realizar Pago" :
    "Debitar";

  setValue("balanceVendorName", vendorName);
  setValue("balanceActual", formatAmount(currentBalance));
  setValue("balanceMonto", "");
  setValue("balanceFechaInput", todayISO());
  setValue("balanceComentario", "");
}

function closeBalanceModal(){
  currentBalanceVendorId = "";
  currentBalanceAction = "";
  byId("balanceModal").style.display = "none";
}

async function submitBalanceAction(){
  if(!currentBalanceVendorId || !currentBalanceAction) return;

  const monto = parseAmount(getValue("balanceMonto"));
  const fecha = getValue("balanceFechaInput");
  const comentario = getValue("balanceComentario");

  if(monto <= 0){
    alert("Monto invalide");
    return;
  }

  try{
    const res = await fetch("/api/vendors/" + encodeURIComponent(currentBalanceVendorId) + "/balance-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipo: currentBalanceAction,
        monto,
        fecha,
        comentario
      })
    });

    const data = await res.json();

    if(!res.ok){
      alert(data.message || "Erreur balance");
      return;
    }

    closeBalanceModal();
    await loadVendorsFromServer();
    await loadVentasReport();
    await loadBalanceReport();
    alert("Balance mis à jour");
  }catch(err){
    console.error(err);
    alert("Erreur balance");
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
  if(!e.target.closest(".balance-actions-wrap")){
    closeAllBalanceMenus();
  }
});

document.addEventListener("DOMContentLoaded", function(){
const transactionGrupoFilter = byId("transactionGrupoFilter");
const transactionVendorFilter = byId("transactionVendorFilter");
const transactionStart = byId("transactionStart");
const transactionEnd = byId("transactionEnd");

if(transactionGrupoFilter) transactionGrupoFilter.addEventListener("change", renderTransactionsTable);
if(transactionVendorFilter) transactionVendorFilter.addEventListener("change", renderTransactionsTable);
if(transactionStart) transactionStart.addEventListener("change", renderTransactionsTable);
if(transactionEnd) transactionEnd.addEventListener("change", renderTransactionsTable);

if(transactionStart && !transactionStart.value) transactionStart.value = todayISO();
if(transactionEnd && !transactionEnd.value) transactionEnd.value = todayISO();

const fechaInicio = byId("fechaInicio");
const fechaFin = byId("fechaFin");

if(fechaInicio && !fechaInicio.value) fechaInicio.value = todayISO();
if(fechaFin && !fechaFin.value) fechaFin.value = todayISO();

if(fechaInicio) fechaInicio.addEventListener("change", loadVentasReport);
if(fechaFin) fechaFin.addEventListener("change", loadVentasReport);

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

  const ventasZonaFilter = byId("ventasZonaFilter");
  const ventasVendorFilter = byId("ventasVendorFilter");
  const ventasComisionFilter = byId("ventasComisionFilter");

  if(ventasZonaFilter) ventasZonaFilter.addEventListener("change", renderVentasTable);
  if(ventasVendorFilter) ventasVendorFilter.addEventListener("change", renderVentasTable);
  if(ventasComisionFilter) ventasComisionFilter.addEventListener("change", renderVentasTable);

  const balanceGrupoFilter = byId("balanceGrupoFilter");
  const balanceVendorFilter = byId("balanceVendorFilter");
  const balanceFecha = byId("balanceFecha");

  if(balanceGrupoFilter) balanceGrupoFilter.addEventListener("change", renderBalanceTable);
  if(balanceVendorFilter) balanceVendorFilter.addEventListener("change", renderBalanceTable);
  if(balanceFecha) balanceFecha.addEventListener("change", loadBalanceReport);

  if(balanceFecha) balanceFecha.value = todayISO();

  loadGrupoSelects();
  loadLoteriasSelects();
  bindSwitches();
  loadVendorsFromServer();
  loadVentasReport();
  loadBalanceReport();
});

goPage("ventas");

async function deleteMovimiento(vendorId, movimientoId){
  if(!confirm("Ou vle siprime transaction sa?")) return;

  try{
    const res = await fetch(
      "/api/vendors/" + encodeURIComponent(vendorId) +
      "/movimientos/" + encodeURIComponent(movimientoId),
      { method: "DELETE" }
    );

    const data = await res.json();

    if(!res.ok){
      alert(data.message || "Erreur delete transaction");
      return;
    }

    await loadVendorsFromServer();
    await loadVentasReport();
    await loadBalanceReport();

    alert("Transaction supprimée ✔");
  }catch(err){
    console.error(err);
    alert("Erreur delete transaction");
  }
}

function openTicketDetail(ticketId){
  var ticket = ticketsRows.find(function(t){
    return String(t.id) === String(ticketId);
  });

  if(!ticket){
    alert("Ticket introuvable");
    return;
  }

  alert(
    "Ticket: " + safe(ticket.id) + "\n" +
    "Vendeur: " + safe(ticket.vendeurNom || ticket.vendeur) + "\n" +
    "Total: " + formatAmount(ticket.total) + "\n" +
    "Premio: " + formatAmount(ticket.premio)
  );
}

async function cancelTicket(ticketId){

  if(!confirm("Ou vle anile ticket sa?")) return;

  try{
   const res = await fetch("/api/tickets/" + encodeURIComponent(ticketId) + "/cancel", {
      method: "POST"
    });

    const data = await res.json();

    if(!res.ok){
      alert(data.message || "Erreur annulation");
      return;
    }

    alert("Ticket annulé ✔");

    await loadTicketsReport();
    await loadVentasReport();
    await loadBalanceReport();

  }catch(err){
    console.error(err);
    alert("Erreur serveur");
  }
}

document.addEventListener("click", function(e){
  const btn = e.target.closest("#ticketsBody .mini-btn");
  if(!btn) return;

  e.preventDefault();
  e.stopPropagation();

  const id = btn.getAttribute("data-id");
  openTicketDetail(id);
});

</script>

</body>
</html>
`);
});

module.exports = router;