const db = require("../models");
const User = db.users;

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.username || !req.body.email || !req.body.password) {
    res.status(400).send({ message: "Username, email, and password are required!" });
    return;
  }

  // Create a User
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    roles: req.body.roles,

  });

  // Save User in the database
  user
    .save(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User."
      });
    });
};

// Retrieve all Users from the database.
exports.findAll = async (req, res) => {
  try {
    // Extract pagination parameters from query string
    const { page = 1, limit = 10, sortField = 'createdAt', sortOrder = 'desc'  } = req.query;

    console.log(req.query);
    // Calculate pagination values
    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNum - 1) * pageSize;
    console.log(pageNum);
    console.log(skip);  
    console.log(pageSize);
    console.log(typeof sortOrder);

    // Create sort object using the sortField and sortOrder
    const sortOptions = {};

    if (sortOrder == '') {
      sortOptions['createdAt'] = -1;
    } else {
      sortOptions[sortField] = sortOrder.toLowerCase() === 'asc' ? 1 : -1; // Convert 'asc' to 1 and 'desc' to -1
    }
    console.log('sortOptions',sortOptions);

    // Find users with pagination
    const users = await User.find()
      .populate('roles')
      .sort(sortOptions) // Sorting by creation date in descending order
      .skip(skip)
      .limit(pageSize);

      
    // Get the total number of documents for pagination
    const totalUsers = await User.countDocuments();

    // Send paginated results and pagination information
    res.send({
      users,
      totalPages: Math.ceil(totalUsers / pageSize),
      currentPage: pageNum,
      totalItems: totalUsers
      
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving users."
    });
  }
};

// Retrieve all Users from the database.
exports.findAllNoPagination = (req, res) => {
  User.find()
    .populate('roles')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users."
      });
    });
};


// Find a single User with an id
exports.findOneById = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .populate('roles')
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found User with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: "Error retrieving User with id=" + id });
    });
};

// Find a single User by username
exports.findByUsername = (req, res) => {
  const username = req.params.username;

  User.findOne({ username: username })
    .populate('roles')
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found User with username " + username });
      else res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: "Error retrieving User with username=" + username });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update User with id=${id}. Maybe User was not found!`
        });
      } else res.send({ message: "User was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      } else {
        res.send({
          message: "User was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Users were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all users."
      });
    });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).send({ message: "Current password and new password are required." });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const passwordIsValid = bcrypt.compareSync(currentPassword, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid current password." });
    }

    user.password = bcrypt.hashSync(newPassword, 8);
    await user.save();

    res.send({ message: "Password was changed successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message || "An error occurred while changing the password." });
  }
};

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};
  
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};