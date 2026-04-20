const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/master/vendors", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Master Vendors</title>

    <style>
      body {
        margin:0;
        font-family: Arial, sans-serif;
        background: linear-gradient(180deg,#20243d,#1c2033);
        color:#fff;
      }

      .container {
        padding:20px;
      }

      .header {
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:20px;
      }

      h1 {
        font-size:20px;
      }

      button {
        background:#6c63ff;
        border:none;
        padding:10px 15px;
        color:white;
        border-radius:8px;
        cursor:pointer;
      }

      table {
        width:100%;
        border-collapse:collapse;
      }

      th, td {
        padding:12px;
        border-bottom:1px solid rgba(255,255,255,0.1);
        text-align:left;
      }

      .actions {
        display:flex;
        gap:10px;
      }

      .edit {
        cursor:pointer;
        color:yellow;
      }

      .delete {
        cursor:pointer;
        color:red;
      }

      input {
        padding:8px;
        margin:5px;
        border-radius:5px;
        border:none;
      }
    </style>
  </head>

  <body>

  <div class="container">

    <div class="header">
      <h1>Admin - Vendors</h1>
      <button onclick="addVendor()">+ Ajouter</button>
    </div>

    <div>
      <input id="id" placeholder="ID">
      <input id="name" placeholder="Nom">
      <input id="zone" placeholder="Zone">
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Zone</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody id="list"></tbody>
    </table>

  </div>

<script>

let vendors = [
  {id:"NOC100", name:"Rodolphe 8", zone:"Brasser"},
  {id:"NOC101", name:"Odil", zone:"Junior"}
];

function render(){
  let html = "";
  vendors.forEach((v,i)=>{
    html += \`
      <tr>
        <td>\${v.id}</td>
        <td>\${v.name}</td>
        <td>\${v.zone}</td>
        <td class="actions">
          <span class="edit" onclick="edit(\${i})">✏️</span>
          <span class="delete" onclick="remove(\${i})">🗑️</span>
        </td>
      </tr>
    \`;
  });
  document.getElementById("list").innerHTML = html;
}

function addVendor(){
  const id = document.getElementById("id").value;
  const name = document.getElementById("name").value;
  const zone = document.getElementById("zone").value;

  if(!id || !name) return alert("Ranpli yo!");

  vendors.push({id,name,zone});
  render();
}

function remove(i){
  vendors.splice(i,1);
  render();
}

function edit(i){
  const v = vendors[i];
  document.getElementById("id").value = v.id;
  document.getElementById("name").value = v.name;
  document.getElementById("zone").value = v.zone;

  vendors.splice(i,1);
  render();
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
