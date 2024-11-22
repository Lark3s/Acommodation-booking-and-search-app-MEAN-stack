const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: String,
  description: String,
  location: String,
  pricePerNight: Number,
  amenities: [String],
  availability: [{ startDate: Date, endDate: Date }],
  owner: [
    { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    }
  ],
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  latitude: { type: Number },
  longitude: { type: Number },
  images: [{ type: String }] 
}, { timestamps: true });

schema.method("toJSON", function() {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Accommodation = mongoose.model("Accommodation", schema);
module.exports = Accommodation;
