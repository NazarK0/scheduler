const path = require('path')
const express = require("express");
const bodyparser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const configDB = require('../config/database')
const routes = require('./www/routes');
const authentication = require('./authentication')

mongoose.connect(configDB.url, configDB.options);
const app = express();

app.use(morgan('dev'))
app.locals.basedir = path.join(__dirname, "public");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

authentication(app, mongoose)

app.set('view engine', 'pug')
routes(app);

module.exports = app;