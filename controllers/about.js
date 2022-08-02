"use strict";

const logger = require("../utils/logger");

const about = {
  index(request, response) {
    logger.info("about rendering");
    const viewData = {
      title: "Version 2 Web app for WeatherTop 1000 by WeatherTop Inc."
    };
    response.render("about", viewData);
  }
};

module.exports = about;
