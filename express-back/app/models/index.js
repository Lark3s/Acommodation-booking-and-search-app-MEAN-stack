const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.url = dbConfig.url;

db.users = require("./user.model");
db.roles = require("./role.model");

db.accommodations = require("./accommodation.model.js");
db.bookings = require("./booking.model.js");
db.reviews = require("./review.model.js");

db.refreshToken = require("./refreshToken.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;