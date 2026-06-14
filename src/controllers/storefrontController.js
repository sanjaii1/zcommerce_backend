const Storefront = require("../models/Storefront");

// Helper: get or create the single storefront config document
const getOrCreateStorefront = async () => {
  let storefront = await Storefront.findOne({ storeId: "main" });
  if (!storefront) {
    storefront = await Storefront.create({ storeId: "main" });
  }
  return storefront;
};

// GET /api/storefront — public
const getStorefront = async (req, res) => {
  try {
    const storefront = await getOrCreateStorefront();
    res.json(storefront);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/storefront — admin only, upserts the full config
const updateStorefront = async (req, res) => {
  try {
    const { heroBanners, blogSection, promotionalBanners } = req.body;

    const storefront = await getOrCreateStorefront();

    if (heroBanners !== undefined) storefront.heroBanners = heroBanners;
    if (blogSection !== undefined) {
      if (blogSection.isVisible !== undefined)
        storefront.blogSection.isVisible = blogSection.isVisible;
      if (blogSection.title !== undefined)
        storefront.blogSection.title = blogSection.title;
      if (blogSection.subtitle !== undefined)
        storefront.blogSection.subtitle = blogSection.subtitle;
    }
    if (promotionalBanners !== undefined) {
      if (promotionalBanners.bigBanner !== undefined) {
        storefront.promotionalBanners.bigBanner = {
          ...storefront.promotionalBanners.bigBanner.toObject(),
          ...promotionalBanners.bigBanner,
        };
      }
      if (promotionalBanners.smallBanners !== undefined) {
        storefront.promotionalBanners.smallBanners =
          promotionalBanners.smallBanners;
      }
    }

    const updated = await storefront.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/storefront/hero-banners — admin only, add a new hero banner
const addHeroBanner = async (req, res) => {
  try {
    const storefront = await getOrCreateStorefront();

    const newBanner = {
      heading: req.body.heading || "New Banner Heading",
      subheading: req.body.subheading || "",
      imageUrl: req.body.imageUrl || "",
      ctaText: req.body.ctaText || "Shop Now",
      ctaLink: req.body.ctaLink || "/",
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      order: storefront.heroBanners.length,
    };

    storefront.heroBanners.push(newBanner);
    await storefront.save();

    res.status(201).json(storefront);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/storefront/hero-banners/:index — admin only, remove by index
const deleteHeroBanner = async (req, res) => {
  try {
    const index = parseInt(req.params.index, 10);
    const storefront = await getOrCreateStorefront();

    if (index < 0 || index >= storefront.heroBanners.length) {
      return res.status(400).json({ message: "Invalid banner index" });
    }

    storefront.heroBanners.splice(index, 1);

    // Re-order remaining banners
    storefront.heroBanners = storefront.heroBanners.map((b, i) => ({
      ...b.toObject(),
      order: i,
    }));

    await storefront.save();
    res.json(storefront);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/storefront/hero-banners/:index — admin only, update a single hero banner
const updateHeroBanner = async (req, res) => {
  try {
    const index = parseInt(req.params.index, 10);
    const storefront = await getOrCreateStorefront();

    if (index < 0 || index >= storefront.heroBanners.length) {
      return res.status(400).json({ message: "Invalid banner index" });
    }

    const banner = storefront.heroBanners[index];
    const { heading, subheading, imageUrl, ctaText, ctaLink, isActive, order } =
      req.body;

    if (heading !== undefined) banner.heading = heading;
    if (subheading !== undefined) banner.subheading = subheading;
    if (imageUrl !== undefined) banner.imageUrl = imageUrl;
    if (ctaText !== undefined) banner.ctaText = ctaText;
    if (ctaLink !== undefined) banner.ctaLink = ctaLink;
    if (isActive !== undefined) banner.isActive = isActive;
    if (order !== undefined) banner.order = order;

    storefront.heroBanners[index] = banner;
    await storefront.save();
    res.json(storefront);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStorefront,
  updateStorefront,
  addHeroBanner,
  deleteHeroBanner,
  updateHeroBanner,
};
