const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');

const path = require('path');

const cookieSession = require("cookie-session");

const dbConfig = require("./app/config/db.config");

const app = express();

app.use(cookieParser());

var corsOptions = {
  origin: ["http://localhost:8081"],
  credentials: true,
};


app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "app-session",
    keys: ["COOKIE_SECRET"], 
    httpOnly: true
  })
);

// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = require("./app/models");
const Role = db.roles;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`)
  .then(() => {
    console.log("Connected to the database!");
    initial();
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });


//routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/accommodation.routes")(app);
require("./app/routes/booking.routes")(app);
require("./app/routes/review.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount()
    .then(count => {
      if (count === 0) {
        const roles = ["user", "moderator", "admin"];
        const rolePromises = roles.map(role => new Role({ name: role }).save());
        
        return Promise.all(rolePromises);
      }
    })
    .then(() => {
      console.log("Roles initialized successfully.");
    })
    .catch(err => {
      console.log("Error initializing roles:", err);
    });
}