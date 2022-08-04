'use strict';

const logger = require('../utils/logger');
const stationStore = require('../models/station-store');
const uuid = require('uuid');
const LocalDateTime = require("lodash");

function padWithZero(num, targetLength) {
    return String(num).padStart(targetLength, '0')
}

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
        let now = LocalDateTime.now();
        //format that date and time as string
        const DateUTC = new Date(now).toUTCString();
        // format("yyyy-MM-dd HH:mm:ss");
        const sDate =  (new Date(DateUTC).getFullYear()+ "-" +padWithZero(new Date(DateUTC).getMonth(),2)+"-"+padWithZero(new Date(DateUTC).getDate(),2)
          + " " +padWithZero(new Date(DateUTC).getHours(),2) +":"+padWithZero(new Date(DateUTC).getMinutes(),2)+":"+padWithZero(new Date(DateUTC).getSeconds(),2));
       // const sDate =  now.toTimeString()

        const newReading = {
            id: uuid.v1(),
            code: Number(request.body.code),
            temperature: Number(request.body.temperature),
            pressure: Number(request.body.pressure),//Number converts the string to a number
            windSpeed: Number(request.body.windSpeed),//Number converts the string to a number
            windDirection: Number(request.body.windDirection),//Number converts the string to a number
            readingDate : sDate,
            epocDate: now
        };
        stationStore.addReading(stationId, newReading);
        logger.debug('New Reading = ', newReading);
        response.redirect('/station/' + stationId);
    },
};

module.exports = station;