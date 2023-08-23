const express = require('express');
const bodyParser = require('body-parser');
const cool = require('cool-ascii-faces');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const path = require('path');
const app = express();

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect('mongodb://admin:Secret123@ds044979.mlab.com:44979/studdit', { useNewUrlParser: true });
}

app.use(express.static(path.join(__dirname, 'public')))
    .get('/cool', (req, res) => res.send(cool()));

app.use(bodyParser.json());
routes(app);

app.use((err, req, res, next) => {
    res.status(422).send({ error: err.message });
});

module.exports = app;