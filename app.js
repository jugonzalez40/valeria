const express = require('express');
const server = express();
const cors = require('cors');

server.use(cors());
server.use(express.static(__dirname));
server.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
 });


 server.listen(8081, () => {

 })