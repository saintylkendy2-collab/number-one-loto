const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
res.send(`
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Login Vendeur</title>

<style>
body {
margin: 0;
font-family: Arial, sans-serif;
background: #f2f2f2;
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
}

.container {
width: 90%;
max-width: 380px;
background: white;
padding: 25px;
border-radius: 12px;
box-shadow: 0 4px 10px rgba(0,0,0,0.1);
text-align: center;
}

h1 {
margin-bottom: 25px;
font-size: 24px;
}

input {
width: 100%;
padding: 15px;
margin-bottom: 15px;
font-size: 18px;
border-radius: 8px;
border: 1px solid #ccc;
}

button {
width: 100%;
padding: 16px;
font-size: 20px;
border: none;
border-radius: 8px;
background: #1e73ff;
color: white;
}

button:active {
background: #155cd1;
}

.error {
color: red;
margin-bottom: 10px;
}
</style>
</head>

<body>

<div class="container">
<h1>Connexion Vendeur</h1>

<form method="POST" action="/login">
<input type="text" name="id" placeholder="ID vendeur" required>
<input type="password" name="password" placeholder="Mot de passe" required>

<button type="submit">CONNEXION</button>
</form>
</div>

</body>
</html>
`);
});
app.post("/login", (req, res) => {
const id = req.body.id;
const password = req.body.password;

if (id === "NOC100" && password === "1234") {
res.redirect("/dashboard");
} else {
res.send("Identifiant ou mot de passe incorrect ❌");
}
});
app.post("/print", (req, res) => {
const raw = req.body.data || "";

const lines = raw
.split("\n")
.map(line => line.trim())
.filter(line => line.length > 0);

let total = 0;

const formattedLines = lines.map(line => {
const parts = line.split(/\s+/);

if (parts.length >= 3) {
const type = parts[0].toUpperCase();
const number = parts[1];
const amount = parseInt(parts[2], 10) || 0;
total += amount;
return `${type.padEnd(4, " ")} ${number.padEnd(8, " ")} ${amount} G`;
}

if (parts.length === 2) {
const number = parts[0];
const amount = parseInt(parts[1], 10) || 0;
total += amount;
return `BOR ${number.padEnd(8, " ")} ${amount} G`;
}

return line;
});

const now = new Date();
const dateStr = now.toLocaleDateString("fr-FR");
const timeStr = now.toLocaleTimeString("fr-FR", {
hour: "2-digit",
minute: "2-digit"
});

res.send(`
<html>
<head>
<meta charset="UTF-8">
<style>
body {
font-family: monospace;
font-size: 12px;
margin: 0;
padding: 4px;
width: 58mm;
}

pre {
margin: 0;
white-space: pre-wrap;
word-break: break-word;
}

button {
display: none;
}
</style>
</head>
<body>
<pre>
NUMBER ONE LOTO
Dat: ${dateStr} Le: ${timeStr}

${formattedLines.join("\n")}

----------------------
TOTAL: ${total} G

Bon chans
</pre>
</body>
</html>
`);
});
app.get("/dashboard", (req, res) => {
res.send("<h2>Bienvenue Vendeur ✅</h2>");
});
app.listen(3000, () => {
console.log("Server ap mache sou http://localhost:3000");
});