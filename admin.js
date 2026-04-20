const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Lista de Vendedores</title>
<style>
*{
  box-sizing:border-box;
  margin:0;
  padding:0;
  -webkit-tap-highlight-color:transparent;
}
body{
  font-family:Arial,sans-serif;
  background:#1e2235;
  color:#fff;
  min-height:100vh;
}
.container{
  padding:15px;
}
.header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:14px;
}
h2{
  font-size:28px;
}
.add-btn{
  background:#6c63ff;
  color:#fff;
  border:none;
  border-radius:10px;
  padding:12px 18px;
  font-size:18px;
  cursor:pointer;
}
.table-box{
  background:#2a2f4a;
  border-radius:12px;
  overflow:auto;
}
table{
  width:100%;
  border-collapse:collapse;
  min-width:720px;
}
th,td{
  padding:14px 12px;
  text-align:left;
  border-bottom:1px solid #444b69;
  font-size:18px;
}
th{
  background:#3a3f5a;
  color:#fff;
}
tr:hover{
  background:#343955;
}
.action-btn{
  border:none;
  background:transparent;
  font-size:22px;
  cursor:pointer;
  margin-right:10px;
}
.edit-btn{
  color:#7d6cff;
}
.delete-btn{
  color:#7d6cff;
}
.modal-backdrop{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.45);
  display:none;
  align-items:center;
  justify-content:center;
  padding:15px;
}
.modal-backdrop.show{
  display:flex;
}
.modal{
  width:100%;
  max-width:450px;
  background:#2a2f4a;
  border-radius:16px;
  padding:18px;
}
.modal h3{
  margin-bottom:14px;
  font-size:24px;
}
.modal input{
  width:100%;
  height:52px;
  margin-bottom:10px;
  border:none;
  border-radius:10px;
  padding:0 14px;
  font-size:17px;
  background:#20243d;
  color:#fff;
}
.modal-actions{
  display:flex;
  justify-content:flex-end;
  gap:10px;
  margin-top:8px;
}
.modal-btn{
  border:none;
  border-radius:10px;
  padding:12px 16px;
  font-size:16px;
  cursor:pointer;
}
.cancel-btn{
  background:#555c7a;
  color:#fff;
}
.save-btn{
  background:#6c63ff;
  color:#fff;
}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h2>Lista de Vendedores</h2>
    <button class="add-btn" onclick="openAddModal()">➕ Ajouter vendeur</button>
  </div>

  <div class="table-box">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Zona</th>
          <th>App</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="tableBody"></tbody>
    </table>
  </div>
</div>

<div id="modalBackdrop" class="modal-backdrop">
  <div class="modal">
    <h3 id="modalTitle">Ajouter vendeur</h3>
    <input id="vendorId" type="text" placeholder="ID">
    <input id="vendorName" type="text" placeholder="Nombre">
    <input id="vendorZona" type="text" placeholder="Zona">
    <input id="vendorApp" type="text" placeholder="App" value="2.9.32">
    <div class="modal-actions">
      <button class="modal-btn cancel-btn" onclick="closeModal()">Annuler</button>
      <button class="modal-btn save-btn" onclick="saveVendor()">Enregistrer</button>
    </div>
  </div>
</div>

<script>
let vendors = [
  {id:"NOC100", name:"Rodolphe 8", zona:"Brasser Dollar", app:"2.9.32"},
  {id:"NOC101", name:"Odil", zona:"Junior", app:"2.9.32"},
  {id:"NOC102", name:"Evens", zona:"Junior", app:"2.9.32"},
  {id:"NOC103", name:"Michel1", zona:"Michel", app:"2.9.32"}
];

let editingIndex = -1;

function renderVendors(){
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  vendors.forEach((v, i) => {
    tbody.innerHTML += \`
      <tr>
        <td>\${v.id}</td>
        <td>\${v.name}</td>
        <td>\${v.zona}</td>
        <td>\${v.app}</td>
        <td>
          <button class="action-btn edit-btn" onclick="openEditModal(\${i})">✏️</button>
          <button class="action-btn delete-btn" onclick="deleteVendor(\${i})">🗑️</button>
        </td>
      </tr>
    \`;
  });
}

function openAddModal(){
  editingIndex = -1;
  document.getElementById("modalTitle").textContent = "Ajouter vendeur";
  document.getElementById("vendorId").value = "";
  document.getElementById("vendorName").value = "";
  document.getElementById("vendorZona").value = "";
  document.getElementById("vendorApp").value = "2.9.32";
  document.getElementById("modalBackdrop").classList.add("show");
}

function openEditModal(index){
  editingIndex = index;
  const v = vendors[index];
  document.getElementById("modalTitle").textContent = "Modifier vendeur";
  document.getElementById("vendorId").value = v.id;
  document.getElementById("vendorName").value = v.name;
  document.getElementById("vendorZona").value = v.zona;
  document.getElementById("vendorApp").value = v.app;
  document.getElementById("modalBackdrop").classList.add("show");
}

function closeModal(){
  document.getElementById("modalBackdrop").classList.remove("show");
}

function saveVendor(){
  const id = document.getElementById("vendorId").value.trim();
  const name = document.getElementById("vendorName").value.trim();
  const zona = document.getElementById("vendorZona").value.trim();
  const app = document.getElementById("vendorApp").value.trim();

  if(!id || !name || !zona || !app){
    alert("Ranpli tout chan yo");
    return;
  }

  const data = { id, name, zona, app };

  if(editingIndex >= 0){
    vendors[editingIndex] = data;
  }else{
    vendors.push(data);
  }

  closeModal();
  renderVendors();
}

function deleteVendor(index){
  if(confirm("Supprimer vendeur ?")){
    vendors.splice(index, 1);
    renderVendors();
  }
}

renderVendors();
</script>
</body>
</html>
  `);
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server ap mache sou http://localhost:4000");
});
