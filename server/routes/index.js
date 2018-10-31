const expres = require('express');
const app = expres();

app.use(require('./usuario'));
app.use(require('./login'));

module.exports = app;