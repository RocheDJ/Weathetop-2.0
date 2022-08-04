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

  updateCurrentValues(id){
    const station = this.getStation(id);
    const readingsDesc = sortArrayOfObjects(station.readings,"","desc"); // sort in descending latest date is in index 0
    const recentReading =readingsDesc[0];
    station.current_windDirection = stationUtils.sCompasHeading(recentReading.windDirection);
    station.current_temp_c = recentReading.temperature;
    station.current_temp_f = stationUtils.cTof(recentReading.temperature);
    station.current_BeauFort = stationUtils.sBeauFortFromKph(recentReading.windSpeed);
    station.current_WindChill = stationUtils.sWindChill(recentReading.windSpeed,recentReading.temperature);
    //trend the temp
    let tTrend = stationUtils.trendValue(3,station.readings,"temperature");
    if(tTrend ==1){
      station.trend_temp_up = true;
      station.trend_temp_down = false;
    }else{
      if(tTrend ==-1){
        station.trend_temp_up = false;
        station.trend_temp_down = true;
      } else{
        station.trend_temp_up = false;
        station.trend_temp_down = false;
      }
    }
  //trend the pressure
    tTrend = stationUtils.trendValue(3,station.readings,"pressure");
    if(tTrend ==1){
      station.trend_pressure_up = true;
      station.trend_pressure_down = false;
    }else{
      if(tTrend ==-1){
        station.trend_pressure_up = false;
        station.trend_pressure_down = true;
      } else{
        station.trend_pressure_up = false;
        station.trend_pressure_down = false;
      }
    }
    //trend the wind speed
    tTrend = stationUtils.trendValue(3,station.readings,"windSpeed");
    if(tTrend ==1){
      station.trend_wind_up = true;
      station.trend_wind_down = false;
    }else{
      if(tTrend ==-1){
        station.trend_wind_up = false;
        station.trend_wind_down = true;
      } else{
        station.trend_wind_up = false;
        station.trend_wind_down = false;
      }
    }
  },

  addReading(id, reading) {
    const station = this.getStation(id);
    station.readings.push(reading);
    this.updateCurrentValues(id);
    this.store.save();
  },

  removeReading(id, readingId) {
    const station = this.getStation(id);
    const readings = station.readings;
    _.remove(readings, { id: readingId });
    this.updateCurrentValues(id);
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