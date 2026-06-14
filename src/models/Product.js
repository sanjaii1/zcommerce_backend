const mongoose = require("mongoose");

const productAttributeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  values: { type: String, required: true },
});

const productHighlightSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const productAdditionalInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: String,
      required: true,
    },
    offerPrice: {
      type: String,
    },
    inventory: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Draft", "Archived"],
      default: "Draft",
    },
    images: [{ type: String }],
    attributes: [productAttributeSchema],
    highlights: [productHighlightSchema],
    detailedDescription: { type: String },
    keyBenefits: [{ type: String }],
    howToUse: [{ type: String }],
    additionalInfo: [productAdditionalInfoSchema],
    isMostPopular: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
