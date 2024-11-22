const db = require("../models");
const Review = db.reviews;
const User = db.users; 
const Accommodation = db.accommodations; 
const Booking = db.bookings;

// Create and Save a new Review
exports.create = async (req, res) => {
  try {
    // Validate request
    const { username, accommodationId, rating, comment, bookingId } = req.body;
    if (!username || !accommodationId || !rating) {
      return res.status(400).send({ message: "All fields are required!" });
    }

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Find the accommodation by ID
    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) {
      return res.status(404).send({ message: "Accommodation not found." });
    }


    // Find the associated booking and ensure it is completed and not reviewed yet
    const booking = await Booking.findOne({ 
      _id: bookingId,
      user: user._id, 
      accommodation: accommodation._id, 
      reviewLeft: false, 
      checkOutDate: { $lt: new Date() }
    });


    if (!booking) {
      return res.status(400).send({ message: "No eligible booking found to leave a review." });
    }

    // Create a Review
    const review = new Review({
      user: user._id,
      accommodation: accommodation._id,
      rating,
      comment
    });

    // Save Review in the database
    const savedReview = await review.save();

    // Mark the booking as reviewed
    booking.reviewLeft = true;
    await booking.save();


    res.send(savedReview);

  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Review."
    });
  }
};

// Retrieve all Reviews from the database.
exports.findAll = async (req, res) => {
  try {
    // Extract pagination parameters from query string
    const { page = 1, limit = 10, sortField = 'createdAt', sortOrder = 'desc'   } = req.query;

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

    // Find reviews with pagination
    const reviews = await Review.find()
      .populate('user accommodation')
      .sort({ 'createdAt': -1 })
      .skip(skip)
      .limit(pageSize);

    // Get the total number of documents for pagination
    const totalReviews = await Review.countDocuments();
    console.log(totalReviews);

    // Send paginated results and pagination information
    res.send({
      reviews,
      totalPages: Math.ceil(totalReviews / pageSize),
      currentPage: pageNum,
      totalItems: totalReviews
      
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving reviews."
    });
  }
};

// Retrieve all Reviews from the database.
exports.findAllNoPagination = async (req, res) => {
  try {
    const reviews = await Review.find().populate('user accommodation');
    res.send(reviews);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving reviews."
    });
  }
};

// Find a single Review with an id
exports.findOne = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('user accommodation');
    if (!review) {
      return res.status(404).send({ message: "Review not found with id " + req.params.id });
    }
    res.send(review);
  } catch (err) {
    res.status(500).send({ message: "Error retrieving Review with id=" + req.params.id });
  }
};

// Find a single Review with an accommodation id
exports.findAllByAccommodationId = async (req, res) => {
  try {
    const accommodationId = req.params.id;

    // Extract pagination parameters from query string
    const { page = 1, limit = 5 } = req.query;
    console.log(req.query);

    // Calculate pagination values
    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNum - 1) * pageSize;

     // Fetch reviews for the accommodation and populate the 'user' field
     const reviews = await Review.find({ accommodation: accommodationId })
     .populate('user', 'username') 
     .sort({ createdAt: -1 }) 
     .skip(skip)
     .limit(pageSize);
     console.log(reviews);

     if (!reviews) {
      return res.status(404).send({ message: "Reviews not found with id " + req.params.id });
    }
    // Get the total number of documents for pagination
    const totalReviews = await Review.countDocuments();
    console.log(totalReviews);

    // Send paginated results and pagination information
    res.send({
      reviews,
      totalPages: Math.ceil(totalReviews / pageSize),
      currentPage: pageNum,
      totalItems: totalReviews,
    });
  } catch (err) {
    res.status(500).send({ message: "Error retrieving Review with id=" + req.params.id });
  }
};

// Update a Review by the id in the request
exports.update = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: "Data to update can not be empty!" });
    }

    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, useFindAndModify: false });
    if (!review) {
      return res.status(404).send({ message: `Cannot update Review with id=${req.params.id}. Maybe the Review was not found!` });
    }
    res.send({ message: "Review was updated successfully.", data: review });
  } catch (err) {
    res.status(500).send({ message: "Error updating Review with id=" + req.params.id });
  }
};

// Delete a Review with the specified id in the request
exports.delete = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).send({ message: `Cannot delete Review with id=${req.params.id}. Maybe the Review was not found!` });
    }

    await review.remove(); // This will trigger the post 'remove' middleware
    res.send({ message: "Review was deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: "Could not delete Review with id=" + req.params.id });
  }
};


// Delete all Reviews from the database.
exports.deleteAll = async (req, res) => {
  try {
    const result = await Review.deleteMany({});
    res.send({ message: `${result.deletedCount} Reviews were deleted successfully!` });
  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while removing all reviews." });
  }
};
