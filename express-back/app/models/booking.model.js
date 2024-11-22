const mongoose = require("mongoose");
const Accommodation = require("./accommodation.model");

const schema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  accommodation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accommodation'
  },
  checkInDate: Date,
  checkOutDate: Date,
  totalPrice: Number,
  cancelled: {
    type: Number,
    enum: [0, 1, 2],
    required: true, 
    default: 0
  },
  reviewLeft: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

// Middleware to update availability on booking creation
schema.pre('save', async function(next) {
  const booking = this;

  // Find the related accommodation
  const accommodation = await Accommodation.findById(booking.accommodation);

  // Update the availability
  if (accommodation) {
    accommodation.availability = accommodation.availability.map(period => {
      if (booking.checkInDate <= period.endDate && booking.checkOutDate >= period.startDate) {
        if (booking.checkInDate > period.startDate && booking.checkOutDate < period.endDate) {
          return [
            { startDate: period.startDate, endDate: booking.checkInDate },
            { startDate: booking.checkOutDate, endDate: period.endDate }
          ];
        } else if (booking.checkInDate <= period.startDate && booking.checkOutDate >= period.endDate) {
          return null;
        } else if (booking.checkInDate > period.startDate) {
          return { startDate: period.startDate, endDate: booking.checkInDate };
        } else if (booking.checkOutDate < period.endDate) {
          return { startDate: booking.checkOutDate, endDate: period.endDate };
        }
      } else {
        return period;
      }
    }).flat().filter(period => period);

    await accommodation.save();
  }

  next();
});

// Middleware to update availability on booking cancellation
schema.pre('remove', async function(next) {
  const booking = this;

  // Find the related accommodation
  const accommodation = await Accommodation.findById(booking.accommodation);

  // Update the availability
  if (accommodation) {
    let availabilityUpdated = false;

    // Check if the booking period can be merged with existing availability periods
    accommodation.availability = accommodation.availability.map(period => {
      if (booking.checkOutDate === period.startDate) {
        // Extend the existing period's start date to include the booking period
        period.startDate = booking.checkInDate;
        availabilityUpdated = true;
        return period;
      } else if (booking.checkInDate === period.endDate) {
        // Extend the existing period's end date to include the booking period
        period.endDate = booking.checkOutDate;
        availabilityUpdated = true;
        return period;
      } else {
        return period;
      }
    });

    // If the booking period did not merge with any existing periods, add it as a new period
    if (!availabilityUpdated) {
      accommodation.availability.push({ startDate: booking.checkInDate, endDate: booking.checkOutDate });
    }

    // Sort availability periods by start date
    accommodation.availability.sort((a, b) => a.startDate - b.startDate);

    await accommodation.save();
  }

  next();
});

schema.method("toJSON", function() {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Booking = mongoose.model("Booking", schema);
module.exports = Booking;
