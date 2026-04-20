app.get("/master/vendors", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Master Ventas</title>
  <style>
    *{
      box-sizing:border-box;
      margin:0;
      padding:0;
      -webkit-tap-highlight-color:transparent;
    }

    body{
      font-family:Arial,sans-serif;
      background:linear-gradient(180deg,#20243d 0%, #1c2037 100%);
      color:#d9ddf3;
      min-height:100vh;
    }

    .hidden{
      display:none !important;
    }

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
      max-width:720px;
      background:#2a2f4a;
      border-radius:18px;
      padding:34px 26px;
      box-shadow:0 12px 28px rgba(0,0,0,.22);
    }

    .login-title{
      font-size:30px;
      font-weight:700;
      margin-bottom:26px;
      color:#eef1ff;
      text-align:center;
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
      background:#1f233b;
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

    .login-hint{
      margin-top:16px;
      text-align:center;
      color:#a9b0d8;
      font-size:14px;
    }

    /* APP PAGE */
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
      box-shadow:0 6px 20px rgba(0,0,0,.15);
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
    }

    .page-title{
      font-size:26px;
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

    .filter-input, .filter-select{
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

    .filter-input::placeholder{
      color:#9ea5cb;
    }

    .table-card{
      background:#2a2f4a;
      border-radius:14px;
      overflow:hidden;
      box-shadow:0 6px 20px rgba(0,0,0,.12);
    }

    .table-scroll{
      overflow-x:auto;
      overflow-y:hidden;
      -webkit-overflow-scrolling:touch;
    }

    table{
      width:100%;
      min-width:860px;
      border-collapse:collapse;
    }

    thead th{
      background:#4a4f69;
      color:#f0f2ff;
      padding:15px 12px;
      font-size:17px;
      font-weight:600;
      text-align:left;
      white-space:nowrap;
      border-right:1px solid rgba(255,255,255,.08);
    }

    tbody td{
      padding:15px 12px;
      font-size:16px;
      color:#cfd4ee;
      border-top:1px solid rgba(255,255,255,.08);
      border-right:1px solid rgba(255,255,255,.06);
      white-space:nowrap;
    }

    tbody tr:nth-child(even){
      background:#313652;
    }

    .vendor-name{
      font-weight:700;
      color:#eef1ff;
    }

    .money{
      font-weight:700;
      color:#dfe4ff;
    }

    .result-ok{
      color:#67d57b;
      font-weight:700;
    }

    .result-bad{
      color:#ff8484;
      font-weight:700;
    }

    .summary{
      padding:12px 14px;
      color:#9ea5cb;
      font-size:14px;
    }

    @media (max-width:700px){
      .login-card{
        padding:26px 18px;
      }

      .login-title{
        font-size:24px;
      }

      .filter-input, .filter-select{
        height:54px;
        font-size:16px;
      }

      thead th{
        font-size:15px;
      }

      tbody td{
        font-size:15px;
      }
    }
  </style>
</head>
<body>

  <!-- LOGIN PAGE -->
  <div class="login-page" id="loginPage">
    <div class="login-card">
      <div class="login-title">Master Login</div>

      <div class="login-field-label">Username</div>
      <input id="username" type="text" placeholder="Username" class="login-input" />

      <div class="login-field-label">Password</div>
      <input id="password" type="password" placeholder="••••••••" class="login-input" />

      <button class="login-btn" onclick="loginMaster()">Ingresar</button>

      <div class="login-hint">
        Username: <b>Number</b> &nbsp; | &nbsp; Password: <b>1234</b>
      </div>
    </div>
  </div>

  <!-- APP PAGE -->
  <div class="app-page hidden" id="appPage">
    <div class="topbar">
      <div class="top-left">
        <div class="icon-btn">☰</div>
        <div class="icon-btn">⌕</div>
      </div>

      <div class="top-right">
        <div class="clock-pill" id="clockBox">1:43</div>
        <div class="icon-btn">☼</div>
        <div class="avatar">👤</div>
      </div>
    </div>

    <div class="page-title">Ventas</div>

    <div class="filters">
      <input class="filter-input" type="date" />
      <input class="filter-input" type="text" placeholder="Zona" />
      <input class="filter-input" type="text" placeholder="Vendedor" />
      <input class="filter-input" type="text" placeholder="Lotería" />
      <input class="filter-input" type="text" placeholder="Jugada" />
      <select class="filter-select">
        <option>Comisión</option>
        <option>3%</option>
        <option>5%</option>
        <option>8%</option>
        <option>10%</option>
      </select>
    </div>

    <div class="table-card">
      <div class="summary">Glise agoch/adwat pou wè RESULTADO si ekran an piti.</div>

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
              <td class="money">1,250 G</td>
              <td class="money">62.50 G</td>
              <td class="money">0 G</td>
              <td class="result-ok">+1,187.50 G</td>
            </tr>
            <tr>
              <td class="vendor-name">Edras</td>
              <td class="money">980 G</td>
              <td class="money">49.00 G</td>
              <td class="money">150 G</td>
              <td class="result-ok">+781.00 G</td>
            </tr>
            <tr>
              <td class="vendor-name">Paul</td>
              <td class="money">600 G</td>
              <td class="money">30.00 G</td>
              <td class="money">200 G</td>
              <td class="result-ok">+370.00 G</td>
            </tr>
            <tr>
              <td class="vendor-name">Mackenson</td>
              <td class="money">450 G</td>
              <td class="money">22.50 G</td>
              <td class="money">300 G</td>
              <td class="result-ok">+127.50 G</td>
            </tr>
            <tr>
              <td class="vendor-name">Odil</td>
              <td class="money">700 G</td>
              <td class="money">35.00 G</td>
              <td class="money">800 G</td>
              <td class="result-bad">-135.00 G</td>
            </tr>
            <tr>
              <td class="vendor-name">Rodolphe 8</td>
              <td class="money">1,900 G</td>
              <td class="money">95.00 G</td>
              <td class="money">500 G</td>
              <td class="result-ok">+1,305.00 G</td>
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
    }else{
      alert("Login incorrect");
    }
  }
</script>

</body>
</html>
  `);
});
