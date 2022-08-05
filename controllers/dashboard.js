"use strict";
const uuid = require('uuid');
const logger = require("../utils/logger");
const stationStore = require('../models/station-store');
const accounts = require ('./accounts.js');
const stationUtils = require('../utils/stationUtils');
const sortArrayOfObjects = require("../utils/sort");
const _ = require("lodash");
//ToDo: in dashboard make tiles smaller and vary icons


const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const myStations = stationStore.getUserStationsSorted(loggedInUser.id);
    const viewData = {
      title: 'Weather Station Dashboard',
      stations: myStations,
      firstName: loggedInUser.firstName,
      lastName: loggedInUser.lastName,
    };
    logger.info('About to render Dashboard',  stationStore.getUserStations(loggedInUser.id));
    response.render('dashboard', viewData);
  },
  deleteStation(request, response) {
    const stationId = request.params.id;
    logger.debug(`Deleting Station ${stationId}`);
    stationStore.removeStation(stationId);
    response.redirect('/dashboard/');
  },
  addStation(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newStation = {
      id: uuid.v1(),
      userid: loggedInUser.id,
      name: _.upperFirst(request.body.name),
      latitude :request.body.latitude,
      longitude :request.body.longitude,
      readings: [],
    };
    logger.debug('Creating a new Station', newStation);
    stationStore.addStation(newStation);
    response.redirect('/dashboard');
  },
};

module.exports = dashboard;