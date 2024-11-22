const db = require("../models");
const Booking = db.bookings;
const User = db.users; 
const Accommodation = db.accommodations; 

// Create and Save a new Booking
exports.create = async (req, res) => {
  try {
    // Validate request
    const { username, accommodationId, checkInDate, checkOutDate, totalPrice } = req.body;
    if (!username || !accommodationId || !checkInDate || !checkOutDate || !totalPrice) {
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

    // Create a Booking
    const booking = new Booking({
      user: user._id,
      accommodation: accommodation._id,
      checkInDate,
      checkOutDate,
      totalPrice
    });

    // Save Booking in the database
    const savedBooking = await booking.save();
    res.send(savedBooking);

  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Booking."
    });
  }
};

// Retrieve all Bookings from the database.
exports.findAll = async (req, res) => {
  try {
    // Extract pagination parameters from query string
    const { page = 1, limit = 10, sortField = 'createdAt', sortOrder = 'desc'  } = req.query;

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

    // Find bookings with pagination
    const bookings = await Booking.find()
      .populate('user accommodation')
      .sort(sortOptions) // Sorting by creation date in descending order
      .skip(skip)
      .limit(pageSize);

    // Get the total number of documents for pagination
    const totalBookings = await Booking.countDocuments();
    console.log(totalBookings);

    // Send paginated results and pagination information
    res.send({
      bookings,
      totalPages: Math.ceil(totalBookings / pageSize),
      currentPage: pageNum,
      totalItems: totalBookings
      
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving bookings."
    });
  }
};

// Retrieve all Bookings from the database.
exports.findAllNoPagination= async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user accommodation');
    res.send(bookings);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving bookings."
    });
  }
};

// Find a single Booking with an id
exports.findOne = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user accommodation');
    if (!booking) {
      return res.status(404).send({ message: "Booking not found with id " + req.params.id });
    }
    res.send(booking);
  } catch (err) {
    res.status(500).send({ message: "Error retrieving Booking with id=" + req.params.id });
  }
};

// Retrieve all Bookings for a specific accommodation
exports.findAllByAccommodation = async (req, res) => {
  try {
    const accommodationId = req.params.accommodationId;
    const bookings = await Booking.find({ accommodation: accommodationId }).populate('user accommodation');
    if (!bookings.length) {
      return res.status(404).send({ message: "No bookings found for this accommodation." });
    }
    res.send(bookings);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving bookings for the accommodation."
    });
  }
};

// Retrieve all Bookings for a specific user
exports.findAllByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('user', userId)
    const bookings = await Booking.find({ user: userId }).populate('user accommodation');
    if (!bookings.length) {
      return res.status(404).send({ message: "No bookings found for this user." });
    }
    res.send(bookings);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving bookings for the user."
    });
  }
};

// Cancel a Booking
exports.cancelUserBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).send({ message: "Booking not found." });
    }

    // Check if already cancelled
    if (booking.cancelled === 2 | booking.cancelled === 1) {
      return res.status(400).send({ message: "Booking is already cancelled." });
    }

    // Update the booking to set cancelled
    booking.cancelled = 1;
    await booking.save();

    // Update accommodation availability
    const accommodation = await Accommodation.findById(booking.accommodation);
    if (accommodation) {
      let availabilityUpdated = false;

      accommodation.availability = accommodation.availability.map(period => {
        if (booking.checkOutDate === period.startDate) {
          period.startDate = booking.checkInDate;
          availabilityUpdated = true;
          return period;
        } else if (booking.checkInDate === period.endDate) {
          period.endDate = booking.checkOutDate;
          availabilityUpdated = true;
          return period;
        } else {
          return period;
        }
      });

      if (!availabilityUpdated) {
        accommodation.availability.push({ startDate: booking.checkInDate, endDate: booking.checkOutDate });
      }

      accommodation.availability.sort((a, b) => a.startDate - b.startDate);
      await accommodation.save();
    }

    res.status(200).send({ message: "Booking was cancelled successfully." });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while cancelling the Booking."
    });
  }
};

// Cancel a Booking
exports.cancelOwnerBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).send({ message: "Booking not found." });
    }

    // Check if already cancelled
    if (booking.cancelled === 2 | booking.cancelled === 1) {
      return res.status(400).send({ message: "Booking is already cancelled." });
    }

    // Update the booking to set cancelled
    booking.cancelled = 2;
    await booking.save();

    // Update accommodation availability
    const accommodation = await Accommodation.findById(booking.accommodation);
    if (accommodation) {
      let availabilityUpdated = false;

      accommodation.availability = accommodation.availability.map(period => {
        if (booking.checkOutDate === period.startDate) {
          period.startDate = booking.checkInDate;
          availabilityUpdated = true;
          return period;
        } else if (booking.checkInDate === period.endDate) {
          period.endDate = booking.checkOutDate;
          availabilityUpdated = true;
          return period;
        } else {
          return period;
        }
      });

      if (!availabilityUpdated) {
        accommodation.availability.push({ startDate: booking.checkInDate, endDate: booking.checkOutDate });
      }

      accommodation.availability.sort((a, b) => a.startDate - b.startDate);
      await accommodation.save();
    }

    res.status(200).send({ message: "Booking was cancelled successfully." });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while cancelling the Booking."
    });
  }
};


// Update a Booking by the id in the request
exports.update = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: "Data to update can not be empty!" });
    }
    console.log(req.body);
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true, useFindAndModify: false });
    if (!booking) {
      return res.status(404).send({ message: `Cannot update Booking with id=${req.params.id}. Maybe Booking was not found!` });
    }
    res.send({ message: "Booking was updated successfully.", data: booking });
  } catch (err) {
    res.status(500).send({ message: "Error updating Booking with id=" + req.params.id });
  }
};

// Delete a Booking with the specified id in the request
exports.delete = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).send({ message: `Cannot delete Booking with id=${req.params.id}. Maybe Booking was not found!` });
    }

    await booking.remove(); // This will trigger the post 'remove' middleware if defined
    res.send({ message: "Booking was deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: "Could not delete Booking with id=" + req.params.id });
  }
};


// Delete all Bookings from the database.
exports.deleteAll = async (req, res) => {
  try {
    const result = await Booking.deleteMany({});
    res.send({ message: `${result.deletedCount} Bookings were deleted successfully!` });
  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while removing all bookings." });
  }
};
