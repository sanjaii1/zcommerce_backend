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

const productPerkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
});

const productAccordionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
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
    attributes: [productAttributeSchema],
    highlights: [productHighlightSchema],
    perks: [productPerkSchema],
    accordions: [productAccordionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
