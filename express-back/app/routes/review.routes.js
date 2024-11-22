module.exports = app => {
  const reviews = require("../controllers/review.controller.js");
  const { authJwt } = require("../middlewares");
    
    var router = require("express").Router();
  
    // Create a new Review
    router.post("/", [authJwt.verifyToken], reviews.create);
  
    // Retrieve all Reviews
    router.get("/", reviews.findAll);
  
    // Retrieve a single Review with id
    router.get("/:id", reviews.findOne);

    // Retrieve a single Review with accommodation id
    router.get("/accommodations/:id", reviews.findAllByAccommodationId);
  
    // Update a Review with id
    router.put("/:id", [authJwt.verifyToken], reviews.update);
  
    // Delete a Review with id
    router.delete("/:id", [authJwt.verifyToken], reviews.delete);
  
    // Delete all Reviews
    router.delete("/", [authJwt.verifyToken], reviews.deleteAll);
  
    app.use("/api/reviews", router);
  };
