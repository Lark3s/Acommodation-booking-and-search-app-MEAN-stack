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
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
}, { timestamps: true });

schema.method("toJSON", function() {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

schema.post('save', async function() {
  const review = this;
  
  // Increment the review count and calculate the new average rating
  const reviews = await Review.aggregate([
    { $match: { accommodation: review.accommodation } },
    { $group: {
      _id: null,
      averageRating: { $avg: "$rating" },
      reviewCount: { $sum: 1 }
    }}
  ]);

  const averageRating = reviews.length > 0 ? reviews[0].averageRating : 0;
  const reviewCount = reviews.length > 0 ? reviews[0].reviewCount : 0;

  // Update the accommodation's average rating and review count
  await Accommodation.findByIdAndUpdate(review.accommodation, { 
    averageRating: averageRating,
    reviewCount: reviewCount
  });
});

schema.post('remove', async function() {
  const review = this;
  
  // Recalculate the average rating and review count after a review is removed
  const reviews = await Review.aggregate([
    { $match: { accommodation: review.accommodation } },
    { $group: {
      _id: null,
      averageRating: { $avg: "$rating" },
      reviewCount: { $sum: 1 }
    }}
  ]);

  const averageRating = reviews.length > 0 ? reviews[0].averageRating : 0;
  const reviewCount = reviews.length > 0 ? reviews[0].reviewCount : 0;

  // Update the accommodation's average rating and review count
  await Accommodation.findByIdAndUpdate(review.accommodation, { 
    averageRating: averageRating,
    reviewCount: reviewCount
  });
});


const Review = mongoose.model("Review", schema);
module.exports = Review;
