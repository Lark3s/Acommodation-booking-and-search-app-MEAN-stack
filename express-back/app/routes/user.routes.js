const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {

  // CRUD routes
  var router = require("express").Router();

  // Role-based access routes
  router.get("/all", controller.allAccess);
  router.get("/user", [authJwt.verifyToken], controller.userBoard);


  router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);

  // Create a new User
  router.post("/", [authJwt.verifyToken, authJwt.isAdmin], controller.create);

  // Retrieve all Users
  router.get("/", controller.findAll);

  // Retrieve a single User with id
  router.get("/id/:id", [authJwt.verifyToken], controller.findOneById);

  // Retreive a single User with Username
  router.get("/username/:username", [authJwt.verifyToken], controller.findByUsername);

  // Update a User with id
  router.put("/id/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.update);

  // Delete a User with id
  router.delete("/id/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.delete);

  // Delete all Users
  router.delete("/", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteAll);

  router.put("/change-password", [authJwt.verifyToken], controller.changePassword);

  app.use("/api/users", router);
};
