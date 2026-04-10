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
<body style="font-size:24px;">
<pre>${data}</pre>
<br>
<a href="/">BACK</a>
</body>
</html>
`);
});

app.listen(3000, () => {
console.log("Server ap mache sou http://localhost:3000");
});