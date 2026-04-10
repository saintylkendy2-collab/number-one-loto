app.get('/play', (req, res) => {
const users = loadUsers();
const user = req.cookies.user;

if (!user || !users[user]) {
return res.redirect('/');
}

res.send(`
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body {
font-family: Arial;
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
margin: 0;
background: #f5f5f5;
}

.box {
width: 95%;
max-width: 500px;
text-align: center;
background: white;
padding: 20px;
border-radius: 10px;
box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

h3, h4 {
margin: 5px 0;
}

textarea {
width: 100%;
height: 180px;
font-size: 18px;
padding: 10px;
margin-top: 10px;
}

button {
width: 100%;
padding: 15px;
font-size: 20px;
margin-top: 10px;
border: none;
border-radius: 5px;
background: black;
color: white;
}
</style>
</head>

<body>
<div class="box">
<h3>VANDÈ: ${users[user].nom}</h3>
<h4>ID: ${user}</h4>

<form method="POST" action="/print">
<textarea name="data" placeholder="Egzanp:
BOR 58 250
BOR 85 100
MAR 25*36 15"></textarea>
<button type="submit">GENERATE</button>
</form>

<form method="POST" action="/logout">
<button type="submit">LOGOUT</button>
</form>
</div>
</body>
</html>
`);
});