"use strict";
const _ = require("lodash");
const logger = require("../utils/logger");
const sortArrayOfObjects = require("./sort");

const Windsector = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];

const stationUtils = {
  /* C to F conversion
   */
  cTof(celsius) {
    var cTemp = celsius;
    var cToFahr = cTemp * 9 / 5 + 32;
    return cToFahr;
  },

  /*
  * Return average Value of a list of doubles
  */
  average(nList) {
    let dReturn = 0.0;
    let dTotal = 0;
    dTotal = 0;
    for (let iX = 0; iX < nList.length; iX++) {
      if (nList[iX]){
        dTotal = dTotal + nList[iX];
      }

    }
    dReturn = dTotal / nList.length;
    return dReturn;
  },
  /*
     * Return the slope or trend for an array code based on formula outlined in
     * https://study.com/academy/lesson/what-is-a-trend-line-in-math-definition-equation-analysis.html
     */

  dTrend(xList, yList) {
    let dReturnValue = 0;
    //get the average of the x coordinates (time stamp)
    let xAvg = this.average(xList);
    //get the average of the y coordinates (the value we are trending)
    let yAvg = this.average(yList);

    let sumNumerator = 0;
    let sumDenominator = 0;
    //for each point get
    for (let i = 0; i < yList.length; i++) {
      //the differences between each y-coordinate and the average of all of the y-coordinates
      let y = yList[i];
      // the differences between each x-coordinate and the average of all of the x-coordinates
      let x = xList[i];
      let yDiff = y - yAvg;
      let xDiff = x - xAvg;
      // multiply columns 1 and 2
      let numerator = xDiff * yDiff;
      let denominator = xDiff * xDiff;
      sumNumerator += numerator;
      sumDenominator += denominator;
    }
    //Calculate the slope (m) of your trend line by dividing the total for Column 3 by the total for Column 4
    let dSlope = sumNumerator / sumDenominator;

    dReturnValue = dSlope;
    return dReturnValue;
  },

  /*
   * Return The string compass heading from decimal degrees
     Construct an array of strings that are the wind directions
      converted from example on https://www.campbellsci.com/blog/convert-wind-directions
   */

  sCompasHeading(iWindDir) {
    let sReturn = "---";
    /*
      convert wind direction to integer values that correspond with the 17 index values within our array.
     */
    try {
      let iIndex = 0;
      iWindDir = _.toNumber(iWindDir);
      if (iWindDir > 360) {
        iIndex = iWindDir % 360; // use modular division to get remainder if >360
      } else {
        iIndex = iWindDir;
      }
      let dIndex = (iIndex / 22.5);
      iIndex = parseInt(Math.round(dIndex));
      sReturn = Windsector[iIndex];
    } catch (eX) {
      logger.error("sCompasHeading Error --" + eX.message);
    }
    return sReturn;
  },

  /*
  Return the Beaufort String or force value from the wind speed
    */
  sBeauFortFromKph(dWindSpeed) {
    let sReturn = "---";
    const xAsLabel =true;
    try {
      //start from max and work down returning after each check
      if (dWindSpeed >= 103) {
        if (xAsLabel) {
          return "Violent Storm";
        } else {
          return "Force 11";
        }
      }
      if (dWindSpeed >= 89) {
        if (xAsLabel) {
          return "Strong storm";
        } else {
          return "Force 10";
        }
      }
      if (dWindSpeed >= 75) {
        if (xAsLabel) {
          return "Severe Gale";
        } else {
          return "Force 9";
        }
      }
      if (dWindSpeed >= 62) {
        if (xAsLabel) {
          return "Gale";
        } else {
          return "Force 8";
        }
      }
      if (dWindSpeed >= 50) {
        if (xAsLabel) {
          return "Near Gale";
        } else {
          return "Force 7";
        }
      }
      if (dWindSpeed >= 39) {
        if (xAsLabel) {
          return "Strong Breeze";
        } else {
          return "Force 6";
        }
      }
      if (dWindSpeed >= 29) {
        if (xAsLabel) {
          return "Fresh Breeze";
        } else {
          return "Force 5";
        }
      }
      if (dWindSpeed >= 20) {
        if (xAsLabel) {
          return "Moderate Breeze";
        } else {
          return "Force 4";
        }
      }
      if (dWindSpeed >= 12) {
        if (xAsLabel) {
          return "Gentle Breeze";
        } else {
          return "Force 3";
        }
      }
      if (dWindSpeed >= 6) {
        if (xAsLabel) {
          return "Light Breeze";
        } else {
          return "Force 2";
        }
      }
      if (dWindSpeed >= 1) {
        if (xAsLabel) {
          return "Light Air";
        } else {
          return "Force 1";
        }
      }
      if (dWindSpeed >= 0) {
        if (xAsLabel) {
          return "Calm";
        } else {
          return "Force 0";
        }
      }
    } catch (eX) {
      logger.error("sBeauFortFromKph Error --" + eX.message);
    }

  },

  /*
   * Return Integer representing Trend of temp values Integer + Positive, - Negative , 0 Static
   */

  //set max number of readings to trend
  trendValue(iNoOfReadings, aReadings,key) {
    let iReturnValue = 0;
    let xValues = []; //date time stamp
    let yValues = []; //Value
    //ToDo: Start here tomorrow-
    // sort by date in descending order for trending last x readings
    aReadings = sortArrayOfObjects(aReadings, "epocDate","desc");
    //Check so we trend only what we have if we have less than the requested number of readings
    if (aReadings.length < iNoOfReadings) {
      iNoOfReadings = aReadings.length;
    }

    for (let iX = 0; iX < iNoOfReadings; iX++) {
      let mReading = aReadings[iX];
      switch(key){
        case "temperature":
          yValues.push(mReading.temperature);
          break;
        case "pressure":
          yValues.push(mReading.pressure);
          break;
        case "windSpeed":
          yValues.push(mReading.windSpeed);
          break;
      }
      xValues.push(mReading.epocDate);
    }
    let dTrendValue = this.dTrend(xValues, yValues);
    if (dTrendValue > 0) {
      iReturnValue = 1;
    } else if (dTrendValue < 0) {
      iReturnValue = -1;
    } else {
      iReturnValue = 0;
    }

    return iReturnValue;
  },
  /*
   Return current wind chill as string Based Appendix A - v of specifications
   */
  sWindChill(dWindKph, dTemperature) {
    let sReturn = "---";
    try {
      let dWindChill = 13.12 + (0.6215 * dTemperature) - 11.37 * (Math.pow(dWindKph, 0.16)) + 0.3965 * dTemperature * Math.pow(dWindKph, 0.16);//funny cals but ok
      let sReturn = String.format("Feels like %.2f", dWindChill); // Limit number to 2 decimal places fro display
    } catch (eX) {
      logger.error("sWindChill Error --" + eX.message);
    }
    return sReturn;
  }

};
module.exports = stationUtils;

