"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");
const sortArrayOfObjects = require("../utils/sort");
const stationUtils = require("../utils/stationUtils");

const stationStore = {

  store: new JsonStore("./models/station-store.json", { stationCollection: [] }),
  collection: "stationCollection",

  getAllStations() {
    return this.store.findAll(this.collection);
  },

  getStation(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  addStation(station) {
    this.store.add(this.collection, station);
    this.store.save();
  },

  removeStation(id) {
    const station = this.getStation(id);
    this.store.remove(this.collection, station);
    this.store.save();
  },

  removeAllStations() {
    this.store.removeAll(this.collection);
    this.store.save();
  },

  addReading(id, reading) {
    const station = this.getStation(id);
    station.readings.push(reading);
    //Todo: make sure current reading is actually greater than the last
    station.current_windDirection = stationUtils.sCompasHeading(reading.windDirection);
    station.current_temp_c = reading.temperature;
    station.current_temp_f = stationUtils.cTof(reading.temperature);
    station.current_BeauFort = stationUtils.sBeauFortFromKph(reading.windSpeed);
    let tTrend = stationUtils.trendTemperature(3);
    if(tTrend ===1){
      station.trend_pressure_up = true;
      station.trend_pressure_down = false;
    }else{
      if(tTrend ===-1){
        station.trend_pressure_up = false;
        station.trend_pressure_down = true;
      } else{
        station.trend_pressure_up = false;
        station.trend_pressure_down = false;
      }
    }

    this.store.save();
  },

  removeReading(id, readingId) {
    const station = this.getStation(id);
    const readings = station.readings;
    _.remove(readings, { id: readingId });
    this.store.save();
  },

  getUserStations(userid) {
    return this.store.findBy(this.collection, { userid: userid });
  },

  getUserStationsSorted(userid) {
    const retStations = this.getUserStations(userid);
    return sortArrayOfObjects(retStations, "name");
  },


  // return the last updated reading for this station
  getStationsCurrentData(userid) {
    const stations = this.getUserStationsSorted(userid);// get all stations for user in order as displaied

    let stationreadings = [];
    for (let iX = 0; iX < stations.length; iX++) {
      let readings = stations[iX].readings;
      if (readings) {
        let allStationreadings = sortArrayOfObjects(readings, "date");// go through the statins and get the current readings
        let currentReading = allStationreadings[allStationreadings.length - 1];
        if (currentReading) {
          stationreadings.push(currentReading);
        }
      } else {
        stationreadings.push([]);
      }
    }
    return stationreadings;
  }

};

module.exports = stationStore;