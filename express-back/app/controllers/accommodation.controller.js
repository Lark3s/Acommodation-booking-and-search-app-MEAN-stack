const db = require("../models");
const Accommodation = db.accommodations;
const User = db.users;

// Create and Save a new Accommodation
exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.name || !req.body.username) {
      return res.status(400).send({ message: "Name and username are required!" });
    }

    const imagePaths = req.files.map(file => file.path); // Get paths of all uploaded images

    // Find the user by username
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Parse the availability JSON string into an array of objects
    let availability = [];
    if (req.body.availability) {
      availability = JSON.parse(req.body.availability);
    }

    // Create an Accommodation
    const accommodation = new Accommodation({
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      pricePerNight: req.body.pricePerNight,
      amenities: req.body.amenities,
      availability: availability,
      owner: user._id,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      images: imagePaths
    });

    // Save Accommodation in the database
    const savedAccommodation = await accommodation.save();
    res.send(savedAccommodation);

  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Accommodation."
    });
  }
};


exports.findAllNoPagination = async (req, res) => {
  try {
    const accommodations = await Accommodation.find();
    res.status(200).send(accommodations);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving accommodations."
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    // Extract pagination parameters from query string
    const { page = 1, limit = 10, sortField = 'createdAt', sortOrder = 'desc' } = req.query;

    // Calculate pagination values
    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNum - 1) * pageSize;

    // Create sort object using the sortField and sortOrder
    const sortOptions = {};

    if (sortOrder == '') {
      sortOptions['createdAt'] = -1;
    } else {
      sortOptions[sortField] = sortOrder.toLowerCase() === 'asc' ? 1 : -1; // Convert 'asc' to 1 and 'desc' to -1
    }
    // Find accommodations with pagination
    const accommodations = await Accommodation.find()
      .populate('owner bookings')
      .sort(sortOptions) // Sorting by creation date in descending order
      .skip(skip)
      .limit(pageSize);

    // Get the total number of documents for pagination
    const totalAccommodations = await Accommodation.countDocuments();
    console.log(totalAccommodations);

    // Send paginated results and pagination information
    res.send({
      accommodations,
      totalPages: Math.ceil(totalAccommodations / pageSize),
      currentPage: pageNum,
      totalItems: totalAccommodations
      
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving accommodations."
    });
  }
};


exports.findAllByFilter = async (req, res) => {
  try {
    const { title, minPrice, maxPrice, location, startDate, endDate, page = 1, limit = 10 } = req.query;

    // Initialize a query object
    let query = {};

    // Get today's date without the time (start of the day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Search by title
    if (title) {
      query.name = { $regex: new RegExp(title), $options: "i" }; // Case-insensitive search
    }

    // Filter by price
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = minPrice;
      if (maxPrice) query.pricePerNight.$lte = maxPrice;
    }

    // Filter by location
    if (location) {
      const trimmedLocation = location.trim();
      query.location = { $regex: new RegExp(trimmedLocation), $options: "i" };
    }

    // Filter by availability
    if (startDate && endDate) {
      query.availability = {
        $elemMatch: {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        }
      };
    } else if (startDate) {
      query.availability = {
        $elemMatch: {
          startDate: { $gte: new Date(startDate) },
        }
      };
    } else if (endDate) {
      query.availability = {
        $elemMatch: {
          endDate: { $lte: new Date(endDate) }
        }
      };
    }

    // Additional filter to ensure the end date is not before today
    query['availability.endDate'] = { $gte: today };

    // Calculate pagination values
    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNum - 1) * pageSize;

    // Find accommodations matching the query, populate related fields, and sort by availability date descending
    const accommodations = await Accommodation.find(query)
      .populate('owner bookings')
      .sort({ 'availability.startDate': 1 })
      .skip(skip)
      .limit(pageSize); // Sorting by startDate in descending order

    // Get the total number of documents for pagination
    const totalAccommodations = await Accommodation.countDocuments(query);
    console.log(accommodations);
    console.log("----------------------------")
    res.send({
      accommodations,
      totalPages: Math.ceil(totalAccommodations / pageSize),
      currentPage: pageNum,
      totalItems: totalAccommodations
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving accommodations."
    });
  }
};

// Search Accommodations by Title
exports.searchByTitle = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title || title.length < 3) {
      return res.status(400).send({ message: "Title must be at least 3 characters long." });
    }

    // Construct the regex with the proper syntax
    const regex = new RegExp(title, "i"); // Case-insensitive search

    // Query the database using the regex
    const accommodations = await Accommodation.find({
      name: regex
    }).select("name id"); // Select only the fields you need

    console.log("Accommodations found:", accommodations.length);
    res.send(accommodations);
  } catch (err) {
    console.error("Error during search:", err);
    res.status(500).send({
      message: err.message || "Some error occurred while searching for accommodations."
    });
  }
};

// Find a single Accommodation with an id
exports.findOne = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id).populate('owner bookings');
    if (!accommodation) {
      return res.status(404).send({ message: "Accommodation not found with id " + req.params.id });
    }
    res.send(accommodation);
  } catch (err) {
    res.status(500).send({ message: "Error retrieving Accommodation with id=" + req.params.id });
  }
};

// Update an Accommodation by the id in the request
exports.update = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: "Data to update can not be empty!" });
    }

    const accommodation = await Accommodation.findByIdAndUpdate(req.params.id, req.body, { new: true, useFindAndModify: false });
    if (!accommodation) {
      return res.status(404).send({ message: `Cannot update Accommodation with id=${req.params.id}. Maybe Accommodation was not found!` });
    }
    res.send({ message: "Accommodation was updated successfully.", data: accommodation });
  } catch (err) {
    res.status(500).send({ message: "Error updating Accommodation with id=" + req.params.id });
  }
};

// Delete an Accommodation with the specified id in the request
exports.delete = async (req, res) => {
  try {
    const accommodation = await Accommodation.findByIdAndRemove(req.params.id, { useFindAndModify: false });
    if (!accommodation) {
      return res.status(404).send({ message: `Cannot delete Accommodation with id=${req.params.id}. Maybe Accommodation was not found!` });
    }
    res.send({ message: "Accommodation was deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: "Could not delete Accommodation with id=" + req.params.id });
  }
};

// Delete all Accommodations from the database.
exports.deleteAll = async (req, res) => {
  try {
    const result = await Accommodation.deleteMany({});
    res.send({ message: `${result.deletedCount} Accommodations were deleted successfully!` });
  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while removing all accommodations." });
  }
};

exports.findAllByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find accommodations owned by the user
    const accommodations = await Accommodation.find({ owner: userId }).populate('bookings');
    
    if (!accommodations) {
      return res.status(404).send({ message: "No accommodations found for this user." });
    }
    
    res.status(200).send(accommodations);
  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while retrieving accommodations for the user." });
  }
};
