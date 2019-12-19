const express = require('express');
const app = express();
// const path = require('path');
// const music = require('musicmatch')({ apikey: "802224f7ee4779fbc74a6ebaf2347221	" });
// var allowCrossDomain = function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', "*");
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// }

app.use(express.static("public"));

app.get('/', function (req, res) {
    res.sendfile('public/html/index.html');
});

// app.configure(function () {
//     app.use(allowCrossDomain);
//     //some other code
// });

app.listen(8080, () => console.log("Listening on port 8080"));