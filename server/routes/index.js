const expres = require('express');
const app = expres();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./producto'))

module.exports = app;