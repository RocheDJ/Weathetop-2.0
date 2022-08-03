"use strict";
const _ = require("lodash");
const logger = require("../utils/logger");
const Windsector = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];

const stationUtils = {
/* C to F conversion
 */
  cTof(celsius)
  {
    var cTemp = celsius;
    var cToFahr = cTemp * 9 / 5 + 32;
    return cToFahr;
  },

  /*
  * Return average Value of a list of doubles
  */
  average(List, lstDouble) {
    let dReturn = 0.0;
    let dTotal = 0;
    dTotal = 0;
    for (let iX = 0; iX < lstDouble.size(); iX++) {
      dTotal = dTotal + lstDouble.get(iX);
    }
    dReturn = dTotal / lstDouble.size();
    return dReturn;
  }, /*
     * Return the slope or trend for an array code based on formula outlined in
     * https://study.com/academy/lesson/what-is-a-trend-line-in-math-definition-equation-analysis.html
     */

  dTrend(yList, xList) {
    let dReturnValue = 0;

    //get the average of the x coordinates (time stamp)
    let yAvg = average(yList);
    //get the average of the y coordinates (the value we are trending)
    let xAvg = average(xList);

    let sumNumerator = 0;
    let sumDenominator = 0;
    //for each point get
    for (let i = 0; i < yList.size(); i++) {
      //the differences between each y-coordinate and the average of all of the y-coordinates
      let y = yList.get(i);
      // the differences between each x-coordinate and the average of all of the x-coordinates
      let x = xList.get(i);
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
  sBeauFortFromKph(dWindSpeed){
    let sReturn = "---";
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
  trendTemperature(iNoOfReadings) {
  let iReturnValue = 0;
  let xValues =[]; //date time stamp
  let yValues=[]; //Value
  aReadings;// array of readings
  //xValues = new ArrayList<>();
  //yValues = new ArrayList<>();

  // sort by date in descending order for trending last x readings
  Collections.sort(this.readings, new Reading.CompareLogDate(true));
  //Check so we trend only what we have if we have less than the requested number of readings
  if (this.readings.size() < iNoOfReadings) {
    iNoOfReadings = this.readings.size();
  }
  for (let iX = 0; iX < iNoOfReadings; iX++) {
    let mReading = this.readings.get(iX);
    yValues.add(mReading.temperature);
    xValues.add(Double.valueOf(mReading.getId()));
  }
  let dTrendValue = StationUtilities.dTrend(xValues, yValues);
  if (dTrendValue > 0) {
    iReturnValue = 1;
  } else if (dTrendValue < 0) {
    iReturnValue = -1;
  } else {
    iReturnValue = 0;
  }

  return iReturnValue;
}

};
module.exports = stationUtils;

