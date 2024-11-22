const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Find user by username
  const usernameCheck = User.findOne({ username: req.body.username });

  // Find user by email
  const emailCheck = User.findOne({ email: req.body.email });

  // Perform both checks concurrently
  Promise.all([usernameCheck, emailCheck])
    .then(([usernameResult, emailResult]) => {
      if (usernameResult) {
        return res.status(400).send({ message: "Failed! Username is already in use!" });
      }
      if (emailResult) {
        return res.status(400).send({ message: "Failed! Email is already in use!" });
      }
      // Proceed to the next middleware or request handler
      next();
    })
    .catch(err => {
      return res.status(500).send({ message: err.message });
    });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    const roleChecks = req.body.roles.map(role => {
      return new Promise((resolve, reject) => {
        if (!ROLES.includes(role)) {
          reject(`Failed! Role ${role} does not exist!`);
        } else {
          resolve();
        }
      });
    });

    Promise.all(roleChecks)
      .then(() => {
        next();
      })
      .catch(err => {
        res.status(400).send({ message: err });
      });
  } else {
    next();
  }
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;