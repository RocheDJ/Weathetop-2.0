'use strict';

const logger = require('../utils/logger');
const stationStore = require('../models/station-store');
const uuid = require('uuid');

const station = {
    index(request, response) {
        const stationId = request.params.id;
        logger.debug('Station id = ', stationId);
        const viewData = {
            name: 'Station',
            station: stationStore.getStation(stationId),
        };

        response.render('station', viewData);
    },

    deleteReading(request, response) {
        const stationId = request.params.id;
        const readingId = request.params.readingid;
        logger.debug(`Deleting Reading ${readingId} from Station ${stationId}`);
        stationStore.removeReading(stationId, readingId);
        response.redirect('/station/' + stationId);
    },

    addReading(request, response) {
        const stationId = request.params.id;
        let station = stationStore.getStation(stationId);
        const newReading = {
            id: uuid.v1(),
            code: Number(request.body.code),
            temperature: Number(request.body.temperature),
            pressure: Number(request.body.pressure),//Number converts the string to a number
            windSpeed: Number(request.body.windSpeed),//Number converts the string to a number
            windDirection: Number(request.body.windDirection),//Number converts the string to a number
        };
        stationStore.addReading(stationId, newReading);
        logger.debug('New Reading = ', newReading);
        response.redirect('/station/' + stationId);
    },
};

module.exports = station;