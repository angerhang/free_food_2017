"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const api_1 = require("./routes/api");
const app = express();
const port = 3000;
app.use(express.static('public'));
app.use('/api', api_1.apiRoute);
app.listen(port);
console.log('Server up and running. Listening on port ' + port);
//# sourceMappingURL=server.js.map