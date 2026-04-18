app.get("/master/vendors", (req, res) => {
res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Master Vendors</title>
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

.page{
max-width:100%;
min-height:100vh;
padding:10px 8px 24px;
}

.topbar{
display:flex;
align-items:center;
justify-content:space-between;
gap:10px;
background:#2a2f4a;
border-radius:12px;
padding:14px 14px;
margin-bottom:16px;
box-shadow:0 6px 20px rgba(0,0,0,.15);
}

.top-left,
.top-right{
display:flex;
align-items:center;
gap:14px;
}

.icon-btn{
font-size:28px;
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
font-size:22px;
position:relative;
color:#444;
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
font-weight:400;
color:#9ea5cb;
margin:6px 0 12px;
}

.actions{
display:flex;
justify-content:flex-end;
gap:14px;
margin-bottom:12px;
}

.action-btn{
width:110px;
height:58px;
border-radius:12px;
border:2px solid #31c7ff;
background:transparent;
color:#46d0ff;
font-size:32px;
display:flex;
align-items:center;
justify-content:center;
cursor:pointer;
}

.action-btn.secondary{
border-color:#6b5ef7;
color:#7b6dff;
}

.filters{
display:grid;
grid-template-columns:1fr;
gap:10px;
margin-bottom:12px;
}

.filter-input,
.filter-select{
width:100%;
height:62px;
border-radius:12px;
border:2px solid rgba(192,198,240,.16);
background:#2a2f4a;
color:#dfe3ff;
font-size:22px;
padding:0 16px;
outline:none;
}

.filter-input::placeholder{
color:#8f96bf;
}

.table-card{
background:#2a2f4a;
border-radius:14px;
padding:0;
overflow:hidden;
box-shadow:0 6px 20px rgba(0,0,0,.12);
}

.table-wrap{
overflow:auto;
}

table{
width:100%;
min-width:900px;
border-collapse:collapse;
}

thead th{
background:#4a4f69;
color:#f0f2ff;
padding:16px 12px;
font-size:18px;
font-weight:600;
text-align:left;
white-space:nowrap;
border-right:1px solid rgba(255,255,255,.08);
}

tbody td{
padding:16px 12px;
font-size:17px;
color:#cfd4ee;
border-top:1px solid rgba(255,255,255,.08);
border-right:1px solid rgba(255,255,255,.06);
white-space:nowrap;
}

tbody tr:nth-child(even){
background:#313652;
}

.vendor-id{
font-weight:700;
color:#e1e4f7;
}

.dot{
display:inline-block;
width:10px;
height:10px;
border-radius:50%;
margin-right:8px;
vertical-align:middle;
background:#8a8fae;
}

.dot.online{
background:#39d46a;
}

.status-ok{
font-weight:700;
text-align:center;
}

.actions-cell{
display:flex;
align-items:center;
gap:14px;
font-size:22px;
color:#816fff;
}

.pagination{
display:flex;
align-items:center;
justify-content:center;
gap:14px;
padding:18px 12px 22px;
}

.page-btn{
min-width:44px;
height:44px;
padding:0 14px;
border:none;
border-radius:999px;
background:transparent;
color:#8c93bc;
font-size:18px;
cursor:pointer;
}

.page-btn.active{
background:#6f63f4;
color:#fff;
}

.page-btn:disabled{
opacity:.35;
cursor:not-allowed;
}

.summary{
padding:12px 14px 0;
color:#9ea5cb;
font-size:15px;
}

@media (max-width:700px){
.page{
padding:8px 6px 20px;
}

.topbar{
padding:12px;
}

.page-title{
font-size:22px;
}

.filter-input,
.filter-select{
height:56px;
font-size:18px;
}

thead th{
font-size:16px;
padding:14px 10px;
}

tbody td{
font-size:16px;
padding:14px 10px;
}

.action-btn{
width:92px;
height:52px;
font-size:28px;
}
}
</style>
</head>
<body>
<div class="page">
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

  <div class="page-title">Vendedores</div>

  <div class="actions">
    <button class="action-btn">+</button>
    <button class="action-btn secondary" onclick="resetFilters()">↻</button>
  </div>

  <div class="filters">
    <input id="searchInput" class="filter-input" type="text" placeholder="Rechercher ID ou Nom" oninput="applyFilters()">
    <select id="groupFilter" class="filter-select" onchange="applyFilters()">
      <option value="">- GRUPO -</option>
    </select>
    <select id="statusFilter" class="filter-select" onchange="applyFilters()">
      <option value="">- ESTADO -</option>
      <option value="online">Online</option>
      <option value="offline">Offline</option>
    </select>
  </div>

  <div class="table-card">
    <div class="summary" id="summaryBox">0 résultats</div>
    <div class="table-wrap">
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
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody id="vendorsTbody"></tbody>
      </table>
    </div>

    <div class="pagination" id="pagination"></div>
  </div>
</div>

<script>
const LIMIT = 25;
let currentPage = 1;

const vendors = [
{id:"NOC100", name:"Rodolphe 8", zone:"Brasser Dollar", app:"2.9.32", connection:"17/04 10:14 pm", limit:true, pago:true, status:"online"},
{id:"NOC101", name:"Odil", zone:"Junior", app:"2.9.32", connection:"17/04 10:18 pm", limit:true, pago:true, status:"offline"},
{id:"NOC102", name:"Evens", zone:"Junior", app:"2.9.32", connection:"17/04 10:13 pm", limit:true, pago:true, status:"offline"},
{id:"NOC103", name:"Michel1", zone:"Michel", app:"2.9.32", connection:"17/04 11:00 pm", limit:true, pago:true, status:"offline"},
{id:"NOC104", name:"Piman", zone:"Junior", app:"2.9.32", connection:"09/04 09:31 am", limit:true, pago:true, status:"offline"},
{id:"NOC105", name:"Mackenson", zone:"Junior", app:"2.9.32", connection:"17/04 08:52 pm", limit:true, pago:true, status:"offline"},
{id:"NOC106", name:"Michel2", zone:"Michel", app:"2.9.34", connection:"17/04 11:57 pm", limit:true, pago:true, status:"offline"},
{id:"NOC107", name:"Paul", zone:"Junior", app:"2.9.32", connection:"17/04 08:44 pm", limit:true, pago:true, status:"offline"},
{id:"NOC108", name:"J1", zone:"Junior", app:"2.9.36", connection:"15/04 08:31 pm", limit:true, pago:true, status:"offline"},
{id:"NOC109", name:"Tizo", zone:"Junior", app:"2.9.32", connection:"17/04 11:57 pm", limit:true, pago:true, status:"online"},
{id:"NOC110", name:"Densert", zone:"Junior", app:"2.9.32", connection:"17/04 10:04 pm", limit:true, pago:true, status:"offline"},
{id:"NOC111", name:"Etzer", zone:"Junior", app:"2.9.32", connection:"17/04 10:29 pm", limit:true, pago:true, status:"offline"},
{id:"NOC112", name:"Titi", zone:"Junior", app:"2.9.32", connection:"17/04 09:20 pm", limit:true, pago:true, status:"offline"},
{id:"NOC113", name:"Sony", zone:"Junior", app:"2.9.32", connection:"17/04 08:00 pm", limit:true, pago:true, status:"offline"},
{id:"NOC114", name:"Rodolphe1", zone:"Brasser Dollar", app:"2.9.26", connection:"17/04 11:06 pm", limit:true, pago:true, status:"offline"},
{id:"NOC115", name:"Christopher", zone:"Anderson", app:"2.9.32", connection:"17/04 10:13 pm", limit:true, pago:true, status:"offline"},
{id:"NOC116", name:"Polisaint", zone:"Junior", app:"2.9.32", connection:"17/04 10:34 pm", limit:true, pago:true, status:"offline"},
{id:"NOC117", name:"Elixon2", zone:"Junior", app:"2.9.26", connection:"11/04 10:07 pm", limit:true, pago:true, status:"offline"},
{id:"NOC118", name:"Doirin", zone:"Junior", app:"2.9.32", connection:"17/04 11:56 pm", limit:true, pago:true, status:"online"},
{id:"NOC119", name:"Michel4", zone:"Michel", app:"2.9.35", connection:"17/04 10:13 pm", limit:true, pago:true, status:"offline"},
{id:"NOC120", name:"Klodi", zone:"Junior", app:"2.9.32", connection:"17/04 03:29 pm", limit:true, pago:true, status:"offline"},
{id:"NOC121", name:"Rodolph6", zone:"Brasser Dollar", app:"2.9.32", connection:"17/04 11:56 pm", limit:true, pago:true, status:"online"},
{id:"NOC122", name:"Angelo", zone:"Junior", app:"2.9.32", connection:"17/04 08:49 pm", limit:true, pago:true, status:"offline"},
{id:"NOC123", name:"Fritho", zone:"Junior", app:"2.9.32", connection:"17/04 11:56 pm", limit:true, pago:true, status:"offline"},
{id:"NOC124", name:"Benito", zone:"Junior", app:"2.9.32", connection:"17/04 08:58 pm", limit:true, pago:true, status:"offline"},
{id:"NOC125", name:"Timessi", zone:"Junior", app:"2.9.32", connection:"17/04 11:22 pm", limit:true, pago:true, status:"online"},
{id:"NOC126", name:"Patrick", zone:"Maya", app:"2.9.33", connection:"17/04 09:11 pm", limit:true, pago:true, status:"offline"},
{id:"NOC127", name:"Maya", zone:"Maya", app:"2.9.31", connection:"17/04 07:55 pm", limit:true, pago:true, status:"offline"},
{id:"NOC128", name:"Joslin", zone:"Junior", app:"2.9.30", connection:"16/04 11:15 pm", limit:true, pago:true, status:"offline"},
{id:"NOC129", name:"Judler1", zone:"Junior", app:"2.9.33", connection:"17/04 10:40 pm", limit:true, pago:true, status:"online"},
{id:"NOC130", name:"Judler2", zone:"Junior", app:"2.9.33", connection:"17/04 10:39 pm", limit:true, pago:true, status:"offline"},
{id:"NOC131", name:"Judler3", zone:"Junior", app:"2.9.33", connection:"17/04 10:38 pm", limit:true, pago:true, status:"offline"},
{id:"NOC132", name:"Michel5", zone:"Michel", app:"2.9.34", connection:"17/04 11:35 pm", limit:true, pago:true, status:"online"},
{id:"NOC133", name:"Anderson1", zone:"Anderson", app:"2.9.30", connection:"16/04 06:41 pm", limit:true, pago:true, status:"offline"},
{id:"NOC134", name:"Anderson2", zone:"Anderson", app:"2.9.30", connection:"16/04 06:42 pm", limit:true, pago:true, status:"offline"},
{id:"NOC135", name:"Anderson4", zone:"Anderson", app:"2.9.30", connection:"16/04 06:43 pm", limit:true, pago:true, status:"online"},
{id:"NOC136", name:"Rodolphe2", zone:"Brasser Dollar", app:"2.9.28", connection:"12/04 08:21 pm", limit:true, pago:true, status:"offline"},
{id:"NOC137", name:"Rodolphe3", zone:"Brasser Dollar", app:"2.9.28", connection:"12/04 08:22 pm", limit:true, pago:true, status:"offline"},
{id:"NOC138", name:"Rodolphe4", zone:"Brasser Dollar", app:"2.9.28", connection:"12/04 08:23 pm", limit:true, pago:true, status:"online"},
{id:"NOC139", name:"Rodolphe5", zone:"Brasser Dollar", app:"2.9.28", connection:"12/04 08:24 pm", limit:true, pago:true, status:"offline"},
{id:"NOC140", name:"Michel3", zone:"Michel", app:"2.9.35", connection:"17/04 10:12 pm", limit:true, pago:true, status:"offline"},
{id:"NOC141", name:"Bizon", zone:"Junior", app:"2.9.29", connection:"14/04 04:10 pm", limit:true, pago:true, status:"offline"},
{id:"NOC142", name:"Blanchard", zone:"Junior", app:"2.9.29", connection:"14/04 04:11 pm", limit:true, pago:true, status:"offline"},
{id:"NOC143", name:"Edson", zone:"Printer", app:"2.9.29", connection:"14/04 04:12 pm", limit:true, pago:true, status:"online"},
{id:"NOC144", name:"Emanuel", zone:"Junior", app:"2.9.29", connection:"14/04 04:13 pm", limit:true, pago:true, status:"offline"},
{id:"NOC145", name:"Gasner", zone:"Junior", app:"2.9.29", connection:"14/04 04:14 pm", limit:true, pago:true, status:"offline"},
{id:"NOC146", name:"Voidieu", zone:"Junior", app:"2.9.29", connection:"14/04 04:15 pm", limit:true, pago:true, status:"offline"},
{id:"NOC147", name:"Kenol", zone:"Junior", app:"2.9.29", connection:"14/04 04:16 pm", limit:true, pago:true, status:"online"},
{id:"NOC148", name:"Maxime", zone:"Junior", app:"2.9.29", connection:"14/04 04:17 pm", limit:true, pago:true, status:"offline"},
{id:"NOC149", name:"Dieunoula", zone:"Junior", app:"2.9.29", connection:"14/04 04:18 pm", limit:true, pago:true, status:"offline"},
{id:"NOC150", name:"Michelet", zone:"Michel", app:"2.9.35", connection:"17/04 10:16 pm", limit:true, pago:true, status:"online"}
];

let filteredVendors = [...vendors];

function updateClock(){
  const d = new Date();
  let h = d.getHours();
  let m = d.getMinutes();
  h = String(h).padStart(2, "0");
  m = String(m).padStart(2, "0");
  document.getElementById("clockBox").textContent = h + ":" + m;
}
setInterval(updateClock, 1000);
updateClock();

function fillGroups(){
  const select = document.getElementById("groupFilter");
  const groups = [...new Set(vendors.map(v => v.zone))].sort();

  groups.forEach(g => {
    const op = document.createElement("option");
    op.value = g;
    op.textContent = g;
    select.appendChild(op);
  });
}

function applyFilters(){
  const text = document.getElementById("searchInput").value.trim().toLowerCase();
  const group = document.getElementById("groupFilter").value;
  const status = document.getElementById("statusFilter").value;

  filteredVendors = vendors.filter(v => {
    const matchesText =
      !text ||
      v.id.toLowerCase().includes(text) ||
      v.name.toLowerCase().includes(text);

    const matchesGroup = !group || v.zone === group;
    const matchesStatus = !status || v.status === status;

    return matchesText && matchesGroup && matchesStatus;
  });

  currentPage = 1;
  renderVendors();
}

function resetFilters(){
  document.getElementById("searchInput").value = "";
  document.getElementById("groupFilter").value = "";
  document.getElementById("statusFilter").value = "";
  filteredVendors = [...vendors];
  currentPage = 1;
  renderVendors();
}

function getPageData(){
  const start = (currentPage - 1) * LIMIT;
  return filteredVendors.slice(start, start + LIMIT);
}

function renderPagination(){
  const totalPages = Math.max(1, Math.ceil(filteredVendors.length / LIMIT));
  const box = document.getElementById("pagination");
  box.innerHTML = "";

  const prev = document.createElement("button");
  prev.className = "page-btn";
  prev.textContent = "«";
  prev.disabled = currentPage === 1;
  prev.onclick = function(){
    if(currentPage > 1){
      currentPage--;
      renderVendors();
    }
  };
  box.appendChild(prev);

  for(let i = 1; i <= totalPages; i++){
    const btn = document.createElement("button");
    btn.className = "page-btn" + (i === currentPage ? " active" : "");
    btn.textContent = i;
    btn.onclick = function(){
      currentPage = i;
      renderVendors();
    };
    box.appendChild(btn);
  }

  const next = document.createElement("button");
  next.className = "page-btn";
  next.textContent = "»";
  next.disabled = currentPage === totalPages;
  next.onclick = function(){
    if(currentPage < totalPages){
      currentPage++;
      renderVendors();
    }
  };
  box.appendChild(next);
}

function renderVendors(){
  const tbody = document.getElementById("vendorsTbody");
  const pageData = getPageData();

  tbody.innerHTML = "";

  pageData.forEach(v => {
    const tr = document.createElement("tr");
    tr.innerHTML = \`
      <td class="vendor-id"><span class="dot \${v.status === "online" ? "online" : ""}"></span>\${v.id}</td>
      <td>\${v.name}</td>
      <td>\${v.zone}</td>
      <td>\${v.app}</td>
      <td>\${v.connection}</td>
      <td class="status-ok">\${v.limit ? "✓" : "✕"}</td>
      <td class="status-ok">\${v.pago ? "✓" : "✕"}</td>
      <td class="status-ok">\${v.status === "online" ? "✓" : "•"}</td>
      <td class="actions-cell"><span>✎</span><span>🗑</span></td>
    \`;
    tbody.appendChild(tr);
  });

  document.getElementById("summaryBox").textContent =
    filteredVendors.length + " résultats • Page " + currentPage;

  renderPagination();
}

fillGroups();
renderVendors();
</script>
</body>
</html>
`);
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server ap mache sou http://localhost:4000");
});

