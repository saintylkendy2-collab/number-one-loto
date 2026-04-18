const path = require("path");
app.use("/master", express.static(path.join(__dirname, "master")));


const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vendedores</title>

    <style>
      body{
        margin:0;
        font-family:Arial,sans-serif;
        background:#1e2235;
        color:#fff;
      }

      .container{
        padding:15px;
      }

      h2{
        margin-bottom:15px;
      }

      table{
        width:100%;
        border-collapse:collapse;
        background:#2a2f4a;
      }

      th,td{
        padding:10px;
        text-align:left;
        border-bottom:1px solid #444;
      }

      th{
        background:#3a3f5a;
      }

      tr:hover{
        background:#3a3f5a;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <h2>Lista de Vendedores</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Zona</th>
            <th>App</th>
          </tr>
        </thead>

        <tbody>
          <tr><td>NOC100</td><td>Rodolphe 8</td><td>Brasser Dollar</td><td>2.9.32</td></tr>
          <tr><td>NOC101</td><td>Odil</td><td>Junior</td><td>2.9.32</td></tr>
          <tr><td>NOC102</td><td>Evens</td><td>Junior</td><td>2.9.32</td></tr>
          <tr><td>NOC103</td><td>Michel1</td><td>Michel</td><td>2.9.32</td></tr>
        </tbody>
      </table>
    </div>
  </body>
  </html>
  `);
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Admin ap mache sou http://localhost:4000");
});