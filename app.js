const express = require('express');
const app = express();
app.use(express.static("public"));

app.get('/', function (req, res) {
    res.sendfile('public/html/index.html');
});

app.listen(8080, () => console.log("Listening on port 8080"));