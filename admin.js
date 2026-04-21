const express = require("express");
const router = express.Router();

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
      min-height:110px;
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
      color:#79d98d;
      font-weight:600;
      cursor:pointer;
    }
    .result-bad{
      color:#d98b8b;
      font-weight:600;
      cursor:pointer;
    }
    .summary{
      padding:12px 14px;
      color:#aeb6d2;
      font-size:13px;
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

    .editor-wrap{
      background:transparent;
    }
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

    .single-limit-grid{
      margin-top:10px;
    }

    .add-row{
      display:grid;
      grid-template-columns:190px 1fr 110px;
      gap:0;
      margin:10px 0 18px;
    }
    .add-row .field-select,
    .add-row .field-input{
      border-radius:0;
    }
    .add-row .field-select{
      border-radius:12px 0 0 12px;
      border-right:none;
    }
    .add-row .field-input{
      border-right:none;
    }
    .plus-box{
      height:52px;
      border:2px solid #6d63ff;
      border-radius:0 12px 12px 0;
      display:flex;
      align-items:center;
      justify-content:center;
      color:#6d63ff;
      font-size:28px;
      cursor:pointer;
      background:transparent;
    }

    .connections-head{
      display:flex;
      justify-content:flex-end;
      margin-bottom:10px;
      padding-right:10px;
    }
    .circle-refresh{
      width:82px;
      height:82px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      color:#6d63ff;
      font-size:40px;
      background:rgba(255,255,255,.03);
      margin:0 auto 10px 0;
      cursor:pointer;
    }
    .clone-wrap{
      display:flex;
      justify-content:center;
      padding:28px 0 10px;
    }
    .clone-btn{
      min-width:280px;
      height:74px;
      border-radius:14px;
      border:2px solid #3fc9e8;
      color:#3fc9e8;
      background:transparent;
      font-size:24px;
      cursor:pointer;
    }

    .modal-backdrop{
      position:fixed;
      inset:0;
      background:rgba(0,0,0,.45);
      display:none;
      align-items:center;
      justify-content:center;
      z-index:2000;
      padding:20px;
    }
    .modal-backdrop.show{display:flex;}
    .modal-card{
      width:100%;
      max-width:640px;
      background:#343754;
      border-radius:18px;
      padding:34px 24px 22px;
      text-align:center;
      box-shadow:0 14px 40px rgba(0,0,0,.35);
    }
    .modal-icon{
      font-size:92px;
      color:#d98b3c;
      margin-bottom:18px;
    }
    .modal-title{
      font-size:34px;
      color:#dfe4ff;
      font-weight:700;
      margin-bottom:12px;
    }
    .modal-text{
      font-size:18px;
      color:#cfd4ee;
      margin-bottom:26px;
    }
    .modal-actions{
      display:flex;
      justify-content:center;
      gap:20px;
    }
    .modal-btn{
      min-width:160px;
      height:62px;
      border:none;
      border-radius:14px;
      font-size:20px;
      cursor:pointer;
    }
    .modal-btn.primary{
      background:linear-gradient(90deg,#6d63ff,#7d73ff);
      color:#fff;
    }
    .modal-btn.secondary{
      background:#4a4f69;
      color:#d7dcef;
    }

    .empty-state{
      color:#9ea5cb;
      font-size:15px;
      text-align:center;
      padding:20px;
    }

    @media (max-width:700px){
      .square-btn,.editor-top-btn{width:132px;height:70px}
      .triple-grid{
        grid-template-columns:1fr;
      }
      .add-row{
        grid-template-columns:120px 1fr 80px;
      }
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

    <!-- VENTAS PAGE -->
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

    <!-- VENDORS LIST PAGE -->
    <div id="vendorsPage" class="page-block hidden">
      <div class="page-title">Vendedores</div>

      <div class="action-row">
        <div></div>
        <div class="action-buttons">
          <button class="square-btn" onclick="openNewVendor()">+</button>
          <button class="square-btn purple" onclick="renderVendorTable()">↻</button>
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

    <!-- VENDOR EDITOR PAGE -->
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
        <!-- DATOS -->
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
            <div class="phone-wrap">
              <div class="phone-code">🇭🇹 +509 ▼</div>
              <input id="vd_telefono" class="phone-input" placeholder="35 15 3152" />
            </div>
          </div>
          <div class="field-group">
            <div class="field-label">Dirección</div>
            <input id="vd_direccion" class="field-input" />
          </div>
          <div class="field-group">
            <div class="field-label">Estatus</div>
            <select id="vd_estatus" class="field-select">
              <option>Bloqueado</option>
              <option>Activo</option>
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

        <!-- CONFIG -->
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

        <!-- COMISION -->
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

<!-- PREMIOS -->
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


<!-- LIMITE DE VENTAS -->
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


<!-- CONEXIONES -->
<div class="editor-section vendor-tab-panel hidden" id="tab-conexiones">

  <div class="table-card">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>LAST CONNECTION</th>
          <th>PIN</th>
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

<!-- CLONAR -->
<div class="editor-section vendor-tab-panel hidden" id="tab-clonar">

  <div style="display:flex;justify-content:center;margin-top:40px;">
    <button class="btn-primary" onclick="cloneVendor()">Clonar Vendedor</button>
  </div>

</div>

      </div> <!-- FIN editor-card -->
    </div> <!-- FIN vendorEditorPage -->

  </div> <!-- FIN appPage -->

<script>
/* =========================
   DATA DEMO
========================= */
let currentPage = "ventas";
let currentVendorIndex = null;

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

const vendors = [
  {
    id:"NOC06",
    clave:"1234",
    nombre:"Gg",
    apellido:"",
    cedula:"",
    telefono:"35 15 3152",
    direccion:"",
    estatus:"Activo",
    sexo:"Hombre",
    zona:"Junior",

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
      borlette:["55","20","10"],
      mariage:["1000","1000","1000"],
      loto3:["500","",""],
      loto4:["5000","",""],
      loto5:["25000","",""],
      loto5o2:["","",""],
      loto5o3:["","",""]
    },

    limites:{
      loteria:"TODAS",
      applyAll:true,
      borlette:"3000",
      mariage:"500",
      loto3:"750",
      loto4_l1:"150",
      loto4_l2:"150",
      loto4_l3:"150",
      loto5_l1:"25",
      loto5_l2:"25",
      loto5_l3:"25",
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

    conexiones:[
      {
        id:"H10S",
        last:"21/04/2026 10:24 AM",
        pin:"282",
        co:true,
        on:true,
        st:true
      }
    ],

    app:"2.9.33",
    conexion:"21/04 10:40 am"
  },

  {
    id:"NOC100",
    clave:"1234",
    nombre:"Rodolphe 8",
    apellido:"",
    cedula:"",
    telefono:"",
    direccion:"",
    estatus:"Bloqueado",
    sexo:"Hombre",
    zona:"Brasser Dollar",
    config:{
      limiteDiario:"0",credito:"0",deshabilitarLoterias:"",deshabilitarJugadas:"",
      mezclaNumeros:"0",habilitarCuadre:false,ventasWhatsapp:false,usarNombreTicket:false,
      deshabilitarDecimales:"0",deshabilitarTerminales:"0",habilitarPrepago:false,
      activarBono:false,bonoTipo:"Mariage"
    },
    comision:{
      retener:false,general:"0",borlette:"0",mariage:"0",loto3:"0",loto4:"0",
      loto5:"0",loto5o2:"0",loto5o3:"0",zona:"0",porLoteria:false
    },
    premios:{
      habilitar:true,loteria:"TODAS",applyAll:true,
      borlette:["","",""],mariage:["","",""],loto3:["","",""],
      loto4:["","",""],loto5:["","",""],loto5o2:["","",""],loto5o3:["","",""]
    },
    limites:{
      loteria:"TODAS",applyAll:true,borlette:"0",mariage:"0",loto3:"0",
      loto4_l1:"0",loto4_l2:"0",loto4_l3:"0",loto5_l1:"0",loto5_l2:"0",loto5_l3:"0",
      limitarNumeros:[],bloqueoNumeros:[],
      limitarCantidad:{borlette:"0",mariage:"0",loto3:"0",loto4:"0",loto5:"0",loto5o2:"0",loto5o3:"0"}
    },
    conexiones:[],
    app:"2.9.32",
    conexion:"20/04 10:11 pm"
  },

  {
    id:"NOC101",
    clave:"1234",
    nombre:"Odil",
    apellido:"",
    cedula:"",
    telefono:"",
    direccion:"",
    estatus:"Activo",
    sexo:"Hombre",
    zona:"Junior",
    config:{
      limiteDiario:"0",credito:"0",deshabilitarLoterias:"",deshabilitarJugadas:"",
      mezclaNumeros:"0",habilitarCuadre:false,ventasWhatsapp:false,usarNombreTicket:false,
      deshabilitarDecimales:"0",deshabilitarTerminales:"0",habilitarPrepago:false,
      activarBono:false,bonoTipo:"Mariage"
    },
    comision:{
      retener:false,general:"0",borlette:"0",mariage:"0",loto3:"0",loto4:"0",
      loto5:"0",loto5o2:"0",loto5o3:"0",zona:"0",porLoteria:false
    },
    premios:{
      habilitar:true,loteria:"TODAS",applyAll:true,
      borlette:["","",""],mariage:["","",""],loto3:["","",""],
      loto4:["","",""],loto5:["","",""],loto5o2:["","",""],loto5o3:["","",""]
    },
    limites:{
      loteria:"TODAS",applyAll:true,borlette:"0",mariage:"0",loto3:"0",
      loto4_l1:"0",loto4_l2:"0",loto4_l3:"0",loto5_l1:"0",loto5_l2:"0",loto5_l3:"0",
      limitarNumeros:[],bloqueoNumeros:[],
      limitarCantidad:{borlette:"0",mariage:"0",loto3:"0",loto4:"0",loto5:"0",loto5o2:"0",loto5o3:"0"}
    },
    conexiones:[],
    app:"2.9.32",
    conexion:"21/04 10:46 am"
  },

  {
    id:"NOC110",
    clave:"1234",
    nombre:"Densert",
    apellido:"",
    cedula:"",
    telefono:"35 15 3152",
    direccion:"",
    estatus:"Activo",
    sexo:"Hombre",
    zona:"Junior",

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
      activarBono:true,
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
      borlette:["55","20","10"],
      mariage:["1000","1000","1000"],
      loto3:["500","",""],
      loto4:["5000","",""],
      loto5:["25000","",""],
      loto5o2:["","",""],
      loto5o3:["","",""]
    },

    limites:{
      loteria:"TODAS",
      applyAll:true,
      borlette:"3000",
      mariage:"500",
      loto3:"750",
      loto4_l1:"150",
      loto4_l2:"150",
      loto4_l3:"150",
      loto5_l1:"25",
      loto5_l2:"25",
      loto5_l3:"25",
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

    conexiones:[
      {
        id:"H10S",
        last:"21/04/2026 10:24 AM",
        pin:"282",
        co:true,
        on:true,
        st:true
      }
    ],

    app:"2.9.32",
    conexion:"21/04 10:24 am"
  }
];


/* =========================
   CLOCK
========================= */
function updateClock(){
  const d = new Date();
  const h = String(d.getHours()).padStart(2,"0");
  const m = String(d.getMinutes()).padStart(2,"0");
  const box = document.getElementById("clockBox");
  if(box) box.textContent = h + ":" + m;
}
setInterval(updateClock,1000);
updateClock();


/* =========================
   LOGIN
========================= */
function loginMaster(){
  const userEl = document.getElementById("username");
  const passEl = document.getElementById("password");
  const user = userEl ? userEl.value.trim() : "";
  const pass = passEl ? passEl.value.trim() : "";

  if(user === "Number" && pass === "1234"){
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("appPage").classList.remove("hidden");
    goPage("vendors");
  }else{
    alert("Login incorrect");
  }
}


/* =========================
   SIDE MENU
========================= */
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


/* =========================
   PAGE NAVIGATION
========================= */
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


/* =========================
   HELPERS
========================= */
function safe(v){
  return v == null ? "" : String(v);
}

function byId(id){
  return document.getElementById(id);
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


/* =========================
   LOAD SELECTS
========================= */
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
  const ids = ["premios_loteria","limites_loteria"];
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


/* =========================
   VENDORS LIST FILTER
========================= */
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
    const okGrupo = !grupoFilter || safe(v.zona) === grupoFilter;
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

    const statusDot = v.estatus === "Activo"
      ? '<span class="status-dot green">●</span>'
      : '<span class="status-dot gray">●</span>';

    tbody.innerHTML += \`
      <tr class="clickable-row" onclick="openVendorByIndex(\${originalIndex})">
        <td>\${statusDot}<strong>\${safe(v.id)}</strong></td>
        <td>\${safe(v.nombre)}</td>
        <td>\${safe(v.zona)}</td>
        <td>\${safe(v.app)}</td>
        <td>\${safe(v.conexion)}</td>
        <td>✓</td>
        <td>✓</td>
        <td>\${v.estatus === "Activo" ? "✓" : ""}</td>
        <td>
          <button class="mini-btn" onclick="event.stopPropagation();openVendorByIndex(\${originalIndex})">✎</button>
        </td>
        <td>
          <button class="mini-btn" onclick="event.stopPropagation();deleteVendorByIndex(\${originalIndex})">🗑</button>
        </td>
        <td></td>
      </tr>
    \`;
  });
}


/* =========================
   OPEN NEW / EDIT VENDOR
========================= */
function blankVendor(){
  return {
    id:"",
    clave:"",
    nombre:"",
    apellido:"",
    cedula:"",
    telefono:"",
    direccion:"",
    estatus:"Bloqueado",
    sexo:"-",
    zona:"",

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


/* =========================
   FILL FORM
========================= */
function fillVendorForm(v){
  byId("vd_id").value = safe(v.id);
  byId("vd_clave").value = safe(v.clave);
  byId("vd_nombre").value = safe(v.nombre);
  byId("vd_apellido").value = safe(v.apellido);
  byId("vd_cedula").value = safe(v.cedula);
  byId("vd_telefono").value = safe(v.telefono);
  byId("vd_direccion").value = safe(v.direccion);
  byId("vd_estatus").value = safe(v.estatus || "Bloqueado");
  byId("vd_sexo").value = safe(v.sexo || "-");
  byId("vd_zona").value = safe(v.zona);

  byId("cfg_limite_diario").value = safe(v.config.limiteDiario);
  byId("cfg_credito").value = safe(v.config.credito);
  byId("cfg_deshabilitar_loterias").value = safe(v.config.deshabilitarLoterias);
  byId("cfg_deshabilitar_jugadas").value = safe(v.config.deshabilitarJugadas);
  byId("cfg_mezcla_numeros").value = safe(v.config.mezclaNumeros);
  byId("cfg_decimales").value = safe(v.config.deshabilitarDecimales);
  byId("cfg_terminales").value = safe(v.config.deshabilitarTerminales);
  byId("cfg_bono").value = safe(v.config.bonoTipo);

  setSwitchValue("sw_cuadre", v.config.habilitarCuadre);
  setSwitchValue("sw_whatsapp", v.config.ventasWhatsapp);
  setSwitchValue("sw_nombre_ticket", v.config.usarNombreTicket);
  setSwitchValue("sw_prepago", v.config.habilitarPrepago);
  setSwitchValue("sw_bono", v.config.activarBono);

  byId("com_general").value = safe(v.comision.general);
  byId("com_borlette").value = safe(v.comision.borlette);
  byId("com_mariage").value = safe(v.comision.mariage);
  byId("com_loto3").value = safe(v.comision.loto3);
  byId("com_loto4").value = safe(v.comision.loto4);
  byId("com_loto5").value = safe(v.comision.loto5);
  byId("com_loto5o2").value = safe(v.comision.loto5o2);
  byId("com_loto5o3").value = safe(v.comision.loto5o3);
  byId("com_zona").value = safe(v.comision.zona);

  setSwitchValue("sw_retener_comision", v.comision.retener);
  setSwitchValue("sw_comision_loteria", v.comision.porLoteria);

  byId("premios_loteria").value = safe(v.premios.loteria || "TODAS");
  setSwitchValue("sw_premios_habilitar", v.premios.habilitar);
  setSwitchValue("sw_premios_apply", v.premios.applyAll);

  byId("prem_borlette_1").value = safe(v.premios.borlette[0]);
  byId("prem_borlette_2").value = safe(v.premios.borlette[1]);
  byId("prem_borlette_3").value = safe(v.premios.borlette[2]);

  byId("prem_mariage_1").value = safe(v.premios.mariage[0]);
  byId("prem_mariage_2").value = safe(v.premios.mariage[1]);
  byId("prem_mariage_3").value = safe(v.premios.mariage[2]);

  byId("prem_l3_1").value = safe(v.premios.loto3[0]);
  byId("prem_l3_2").value = safe(v.premios.loto3[1]);
  byId("prem_l3_3").value = safe(v.premios.loto3[2]);

  byId("prem_l4_1").value = safe(v.premios.loto4[0]);
  byId("prem_l4_2").value = safe(v.premios.loto4[1]);
  byId("prem_l4_3").value = safe(v.premios.loto4[2]);

  byId("prem_l5_1").value = safe(v.premios.loto5[0]);
  byId("prem_l5_2").value = safe(v.premios.loto5[1]);
  byId("prem_l5_3").value = safe(v.premios.loto5[2]);

  byId("limites_loteria").value = safe(v.limites.loteria || "TODAS");
  setSwitchValue("sw_limites_apply", v.limites.applyAll);

  byId("lim_borlette").value = safe(v.limites.borlette);
  byId("lim_mariage").value = safe(v.limites.mariage);
  byId("lim_l3").value = safe(v.limites.loto3);

  byId("lim_l4_l1").value = safe(v.limites.loto4_l1);
  byId("lim_l4_l2").value = safe(v.limites.loto4_l2);
  byId("lim_l4_l3").value = safe(v.limites.loto4_l3);

  byId("lim_l5_l1").value = safe(v.limites.loto5_l1);
  byId("lim_l5_l2").value = safe(v.limites.loto5_l2);
  byId("lim_l5_l3").value = safe(v.limites.loto5_l3);

  byId("lim_cant_borlette").value = safe(v.limites.limitarCantidad.borlette);
  byId("lim_cant_mariage").value = safe(v.limites.limitarCantidad.mariage);
  byId("lim_cant_l3").value = safe(v.limites.limitarCantidad.loto3);
  byId("lim_cant_l4").value = safe(v.limites.limitarCantidad.loto4);
  byId("lim_cant_l5").value = safe(v.limites.limitarCantidad.loto5);
  byId("lim_cant_l5o2").value = safe(v.limites.limitarCantidad.loto5o2);
  byId("lim_cant_l5o3").value = safe(v.limites.limitarCantidad.loto5o3);

  renderConexiones(v.conexiones || []);
}


/* =========================
   READ FORM
========================= */
function readVendorForm(){
  return {
    id: byId("vd_id").value.trim(),
    clave: byId("vd_clave").value.trim(),
    nombre: byId("vd_nombre").value.trim(),
    apellido: byId("vd_apellido").value.trim(),
    cedula: byId("vd_cedula").value.trim(),
    telefono: byId("vd_telefono").value.trim(),
    direccion: byId("vd_direccion").value.trim(),
    estatus: byId("vd_estatus").value,
    sexo: byId("vd_sexo").value,
    zona: byId("vd_zona").value,

    config:{
      limiteDiario: byId("cfg_limite_diario").value,
      credito: byId("cfg_credito").value,
      deshabilitarLoterias: byId("cfg_deshabilitar_loterias").value,
      deshabilitarJugadas: byId("cfg_deshabilitar_jugadas").value,
      mezclaNumeros: byId("cfg_mezcla_numeros").value,
      habilitarCuadre: getSwitchValue("sw_cuadre"),
      ventasWhatsapp: getSwitchValue("sw_whatsapp"),
      usarNombreTicket: getSwitchValue("sw_nombre_ticket"),
      deshabilitarDecimales: byId("cfg_decimales").value,
      deshabilitarTerminales: byId("cfg_terminales").value,
      habilitarPrepago: getSwitchValue("sw_prepago"),
      activarBono: getSwitchValue("sw_bono"),
      bonoTipo: byId("cfg_bono").value
    },

    comision:{
      retener: getSwitchValue("sw_retener_comision"),
      general: byId("com_general").value,
      borlette: byId("com_borlette").value,
      mariage: byId("com_mariage").value,
      loto3: byId("com_loto3").value,
      loto4: byId("com_loto4").value,
      loto5: byId("com_loto5").value,
      loto5o2: byId("com_loto5o2").value,
      loto5o3: byId("com_loto5o3").value,
      zona: byId("com_zona").value,
      porLoteria: getSwitchValue("sw_comision_loteria")
    },

    premios:{
      habilitar: getSwitchValue("sw_premios_habilitar"),
      loteria: byId("premios_loteria").value,
      applyAll: getSwitchValue("sw_premios_apply"),
      borlette:[byId("prem_borlette_1").value, byId("prem_borlette_2").value, byId("prem_borlette_3").value],
      mariage:[byId("prem_mariage_1").value, byId("prem_mariage_2").value, byId("prem_mariage_3").value],
      loto3:[byId("prem_l3_1").value, byId("prem_l3_2").value, byId("prem_l3_3").value],
      loto4:[byId("prem_l4_1").value, byId("prem_l4_2").value, byId("prem_l4_3").value],
      loto5:[byId("prem_l5_1").value, byId("prem_l5_2").value, byId("prem_l5_3").value],
      loto5o2:["","",""],
      loto5o3:["","",""]
    },

    limites:{
      loteria: byId("limites_loteria").value,
      applyAll: getSwitchValue("sw_limites_apply"),
      borlette: byId("lim_borlette").value,
      mariage: byId("lim_mariage").value,
      loto3: byId("lim_l3").value,
      loto4_l1: byId("lim_l4_l1").value,
      loto4_l2: byId("lim_l4_l2").value,
      loto4_l3: byId("lim_l4_l3").value,
      loto5_l1: byId("lim_l5_l1").value,
      loto5_l2: byId("lim_l5_l2").value,
      loto5_l3: byId("lim_l5_l3").value,
      limitarNumeros: [],
      bloqueoNumeros: [],
      limitarCantidad:{
        borlette: byId("lim_cant_borlette").value,
        mariage: byId("lim_cant_mariage").value,
        loto3: byId("lim_cant_l3").value,
        loto4: byId("lim_cant_l4").value,
        loto5: byId("lim_cant_l5").value,
        loto5o2: byId("lim_cant_l5o2").value,
        loto5o3: byId("lim_cant_l5o3").value
      }
    },

    conexiones: currentVendorIndex != null ? (vendors[currentVendorIndex].conexiones || []) : [],
    app: currentVendorIndex != null ? vendors[currentVendorIndex].app : "2.9.32",
    conexion: currentVendorIndex != null ? vendors[currentVendorIndex].conexion : ""
  };
}


/* =========================
   SAVE / DELETE / CLONE
========================= */
function saveVendor(){
  const vendor = readVendorForm();

  if(!vendor.id || !vendor.nombre){
    alert("ID y Nombre son obligatorios");
    return;
  }

  if(currentVendorIndex === null){
    vendors.push(vendor);
  }else{
    vendors[currentVendorIndex] = vendor;
  }

  alert("Vendedor guardado ✔");
  goPage("vendors");
}

function deleteVendorByIndex(index){
  if(!confirm("Eliminar vendedor?")) return;
  vendors.splice(index,1);
  renderVendorTable();
}

function cloneVendor(){
  const vendor = readVendorForm();

  if(!vendor.id){
    alert("Selecciona un vendedor");
    return;
  }

  vendor.id = vendor.id + "_copy";
  vendor.nombre = vendor.nombre + "_copy";

  vendors.push(vendor);
  alert("Copiar vendedor ✔");
  goPage("vendors");
}


/* =========================
   CONNECTIONS
========================= */
function renderConexiones(rows){
  const tbody = byId("conexiones_table");
  if(!tbody) return;

  tbody.innerHTML = "";

  if(!rows.length){
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No hay conexiones</td></tr>';
    return;
  }

  rows.forEach((c,i)=>{
    tbody.innerHTML += \`
      <tr>
        <td>\${safe(c.id)}</td>
        <td>\${safe(c.last)}</td>
        <td>\${safe(c.pin)}</td>
        <td>\${c.co ? "✔" : ""}</td>
        <td>\${c.on ? "✔" : ""}</td>
        <td>\${c.st ? "✔" : ""}</td>
        <td>
          <button class="mini-btn" onclick="blockConn(\${i})">⛔</button>
          <button class="mini-btn" onclick="deleteConn(\${i})">🗑</button>
          <button class="mini-btn" onclick="pinConn(\${i})">PIN</button>
        </td>
      </tr>
    \`;
  });
}

function blockConn(i){
  alert("Bloquear conexión " + i);
}
function deleteConn(i){
  alert("Eliminar conexión " + i);
}
function pinConn(i){
  alert("PIN conexión " + i);
}


/* =========================
   TAB SWITCH
========================= */
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


/* =========================
   SWITCH CLICK
========================= */
function bindSwitches(){
  document.querySelectorAll(".switch").forEach(sw=>{
    if(sw.dataset.bound === "1") return;
    sw.dataset.bound = "1";
    sw.addEventListener("click",function(){
      sw.classList.toggle("on");
    });
  });
}


/* =========================
   MODAL PAGO / COBRO
========================= */
function cleanAmount(txt){
  return parseFloat(String(txt).replace(/,/g,"").trim()) || 0;
}

function formatAmount(value){
  const num = Math.abs(cleanAmount(value));
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

function openPagoModal(vendor, amount){
  const modal = byId("modalPago");
  if(!modal) return;

  const title = byId("pagoTitle");
  const vendorInput = byId("pagoVendor");
  const balanceInput = byId("pagoBalance");
  const montoInput = byId("pagoMonto");
  const fechaInput = byId("pagoFecha");
  const comentarioInput = byId("pagoComentario");

  if(title) title.textContent = "Realizar Pago";
  if(vendorInput) vendorInput.value = vendor;
  if(balanceInput) balanceInput.value = formatAmount(amount);
  if(montoInput) montoInput.value = "";
  if(fechaInput) fechaInput.value = todayISO();
  if(comentarioInput) comentarioInput.value = "";

  modal.style.display = "flex";
}

function closePagoModal(){
  const modal = byId("modalPago");
  if(modal) modal.style.display = "none";
}

function openCobroModal(vendor, amount){
  const modal = byId("modalCobro");
  if(!modal) return;

  const title = byId("cobroTitle");
  const vendorInput = byId("cobroVendor");
  const balanceInput = byId("cobroBalance");
  const montoInput = byId("cobroMonto");
  const fechaInput = byId("cobroFecha");
  const comentarioInput = byId("cobroComentario");

  if(title) title.textContent = "Realizar Cobro";
  if(vendorInput) vendorInput.value = vendor;
  if(balanceInput) balanceInput.value = formatAmount(amount);
  if(montoInput) montoInput.value = "";
  if(fechaInput) fechaInput.value = todayISO();
  if(comentarioInput) comentarioInput.value = "";

  modal.style.display = "flex";
}

function closeCobroModal(){
  const modal = byId("modalCobro");
  if(modal) modal.style.display = "none";
}

document.addEventListener("click", function(e){
  const balanceCell = e.target.closest(".balance-positive, .balance-negative, .result-ok, .result-bad");
  if(!balanceCell) return;

  const row = balanceCell.closest("tr");
  if(!row) return;

  const vendorCell = row.querySelector(".vendor-name");
  if(!vendorCell) return;

  const vendor = vendorCell.textContent.trim();
  const amount = cleanAmount(balanceCell.textContent);

  if(
    balanceCell.classList.contains("balance-negative") ||
    balanceCell.classList.contains("result-bad") ||
    amount < 0
  ){
    openPagoModal(vendor, Math.abs(amount));
  }else if(amount > 0){
    openCobroModal(vendor, Math.abs(amount));
  }
});


/* =========================
   MENU BUTTONS + FILTERS
========================= */
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
  renderVendorTable();
});


/* =========================
   START DEFAULT
========================= */
goPage("vendors");

/* =========================
   FIX BUTTONS VENDORES
========================= */

// bouton ➕ (new vendor)
document.addEventListener("DOMContentLoaded", function(){

  const btnAdd = document.querySelector(".btn-add-vendor");
  const btnRefresh = document.querySelector(".btn-refresh-vendor");

  if(btnAdd){
    btnAdd.onclick = function(){
      openNewVendor();
    };
  }

  if(btnRefresh){
    btnRefresh.onclick = function(){
      renderVendorTable();
    };
  }

});


/* =========================
   CLICK ROW = OPEN EDIT
========================= */

document.addEventListener("click", function(e){
  const row = e.target.closest(".clickable-row");
  if(!row) return;

  const index = row.getAttribute("data-index");
  if(index !== null){
    openVendorByIndex(parseInt(index));
  }
});


/* =========================
   REBUILD TABLE (IMPORTANT)
========================= */

function renderVendorTable(){
  const tbody = document.getElementById("vendorsTableBody");
  if(!tbody) return;

  tbody.innerHTML = "";

vendors.forEach((v,i)=>{
  const statusDot = v.estatus === "Activo"
    ? '<span style="color:#4cd964">●</span>'
    : '<span style="color:#aaa">●</span>';

  tbody.innerHTML +=
    '<tr class="clickable-row" data-index="' + i + '">' +
      '<td>' + statusDot + ' <strong>' + v.id + '</strong></td>' +
      '<td>' + v.nombre + '</td>' +
      '<td>' + v.zona + '</td>' +
      '<td>' + v.app + '</td>' +
      '<td>' + v.conexion + '</td>' +
    '</tr>';
});

</script>

</body>
</html>
  `);
});

module.exports = router;






