"use strict";

const express = require("express");
const router = express.Router();
const accounts = require('./controllers/accounts.js');
const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");
const station = require('./controllers/station.js');
const edituser = require('./controllers/edituser.js');

router.get("/dashboard", dashboard.index);
router.get("/about", about.index);
router.get('/station/:id', station.index);
router.get('/station/:id/deletereading/:readingid', station.deleteReading);
router.get('/deleteStation/:id/', dashboard.deleteStation)
router.post('/station/:id/addreading', station.addReading);
router.post('/station/:id/addautoreading', station.addAutoReading);

router.post('/dashboard/addstation', dashboard.addStation);

router.get('/', accounts.index);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);

router.get('/edituser', edituser.index);
router.post('/updateUser', accounts.updateUser);
module.exports = router;
