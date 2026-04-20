const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/master/vendors", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Master Vendors</title>

<style>
body{
  margin:0;
  font-family:Arial;
  background:#1e293b;
  color:white;
}

.container{
  padding:20px;
}

.top{
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.btn{
  background:#6366f1;
  border:none;
  padding:10px 15px;
  border-radius:10px;
  color:white;
  cursor:pointer;
}

table{
  width:100%;
  margin-top:20px;
  border-collapse:collapse;
}

th, td{
  padding:12px;
  text-align:left;
}

tr{
  background:#334155;
  margin-bottom:5px;
}

.actions button{
  background:none;
  border:none;
  font-size:18px;
  cursor:pointer;
}
</style>

</head>

<body>

<div class="container">

  <div class="top">
    <h2>Lista de Vendedores</h2>
    <button class="btn" onclick="addVendor()">+ Ajouter vendeur</button>
  </div>

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

<script>

let vendors = [
  {id:"NOC100", name:"Rodolphe 8", zone:"Brasser Dollar", app:"2.9.32"},
  {id:"NOC101", name:"Odil", zone:"Junior", app:"2.9.32"}
];

function render(){
  let html = "";

  vendors.forEach((v,i)=>{
    html += \`
      <tr>
        <td>\${v.id}</td>
        <td>\${v.name}</td>
        <td>\${v.zone}</td>
        <td>\${v.app}</td>
        <td class="actions">
          <button onclick="editVendor(\${i})">✏️</button>
          <button onclick="deleteVendor(\${i})">🗑️</button>
        </td>
      </tr>
    \`;
  });

  document.getElementById("tableBody").innerHTML = html;
}

function addVendor(){
  let name = prompt("Nom:");
  if(!name) return;

  vendors.push({
    id:"NOC"+Math.floor(Math.random()*1000),
    name:name,
    zone:"Zone X",
    app:"2.9.32"
  });

  render();
}

function deleteVendor(i){
  vendors.splice(i,1);
  render();
}

function editVendor(i){
  let name = prompt("Modifier nom:", vendors[i].name);
  if(name){
    vendors[i].name = name;
    render();
  }
}

render();

</script>

</body>
</html>
`);
});



app.listen(4000, "0.0.0.0", () => {
  console.log("Server ap mache sou http://localhost:4000");
});
