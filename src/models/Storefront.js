const mongoose = require("mongoose");

const heroBannerSchema = new mongoose.Schema({
  heading: { type: String, default: "" },
  subheading: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  ctaText: { type: String, default: "Shop Now" },
  ctaLink: { type: String, default: "/" },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
});

const smallBannerSchema = new mongoose.Schema({
  badgeText: { type: String, default: "" },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  buttonText: { type: String, default: "" },
  targetLink: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
});

const storefrontSchema = new mongoose.Schema(
  {
    // Only one storefront config document
    storeId: { type: String, default: "main", unique: true },

    heroBanners: {
      type: [heroBannerSchema],
      default: [
        {
          heading: "Welcome to our Store",
          subheading: "Discover the best products for your daily needs.",
          imageUrl: "",
          ctaText: "Shop Now",
          ctaLink: "/products",
          isActive: true,
          order: 0,
        },
      ],
    },

    blogSection: {
      isVisible: { type: Boolean, default: true },
      title: { type: String, default: "Latest from our Blog" },
      subtitle: { type: String, default: "Read our latest news and updates." },
      description: { type: String, default: "" },
      imageUrl: { type: String, default: "" },
    },

    promotionalBanners: {
      bigBanner: {
        badgeText: { type: String, default: "FEATURED RELEASE" },
        title: { type: String, default: "Ultimate glossy finish." },
        description: {
          type: String,
          default:
            "Experience professional-grade cleaning with our new Waterless Wash Spray. Available now.",
        },
        buttonText: { type: String, default: "Shop Now" },
        targetLink: { type: String, default: "/" },
        imageUrl: { type: String, default: "" },
      },
      smallBanners: {
        type: [smallBannerSchema],
        default: [
          {
            badgeText: "",
            title: "20% OFF",
            description: "On all Ceramic Coatings.",
            buttonText: "Shop Coatings",
            targetLink: "/products",
            imageUrl: "",
          },
          {
            badgeText: "Pro Series",
            title: "Showroom Shine",
            description: "Professional grade polishers.",
            buttonText: "Shop Polishers",
            targetLink: "/products",
            imageUrl: "",
          },
        ],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Storefront", storefrontSchema);
