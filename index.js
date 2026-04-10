const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
res.send(`
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body {
font-size: 22px;
padding: 20px;
text-align: center;
}

input, button, textarea {
width: 100%;
padding: 16px;
font-size: 20px;
margin-top: 10px;
}
</style>
</head>
<body>
<h2>NUMBER ONE LOTO</h2>

<form method="POST" action="/print">
<textarea name="data" rows="10" placeholder="Egzanp:
BOR 58 250
BOR 85 100
MAR 25*36 15"></textarea>
<button type="submit">GENERATE</button>
</form>
</body>
</html>
`);
});

app.post("/print", (req, res) => {
const data = req.body.data;

res.send(`
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body {
font-family: monospace;
text-align: center;
padding: 10px;
}

.ticket {
width: 300px;
margin: auto;
border: 1px dashed black;
padding: 10px;
}

pre {
font-size: 18px;
text-align: left;
}

button {
width: 100%;
padding: 14px;
font-size: 18px;
margin-top: 10px;
}
</style>
</head>

<body>
<div class="ticket">
<h3>NUMBER ONE LOTO</h3>
<pre>${data}</pre>
<p>Bon chans 🍀</p>
</div>

<button onclick="window.print()">PRINT</button>
<button onclick="window.location.href='/'">BACK</button>
</body>
</html>
`);
});

app.listen(3000, () => {
console.log("Server ap mache sou http://localhost:3000");
});