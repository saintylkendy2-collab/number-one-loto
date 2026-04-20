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
      <div class="summary">Glise agoch/adwat pou wè RESULTADO.</div>
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
</script>

</body>
</html>
  `);
});

module.exports = router;




