module.exports = app => {
    const accommodations = require("../controllers/accommodation.controller.js");
    const upload = require('../middlewares/upload');

    var router = require("express").Router();
  
    // Create a new Accommodation
    router.post("/", upload, accommodations.create);
  
    // Retrieve all Accommodations
    router.get("/", accommodations.findAllByFilter);

    // Search by title
    router.get("/title", accommodations.searchByTitle);

    // Retrieve all Accommodations
    router.get("/all", accommodations.findAll);
  
    // Retrieve a single Accommodation with id
    router.get("/:id", accommodations.findOne);
  
    // Update an Accommodation with id
    router.put("/:id", accommodations.update);
  
    // Delete an Accommodation with id
    router.delete("/:id", accommodations.delete);
  
    // Delete all Accommodations
    router.delete("/", accommodations.deleteAll);

    router.get("/user/:userId", accommodations.findAllByUser);
  
    app.use("/api/accommodations", router);
  };
  