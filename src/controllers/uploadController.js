const cloudinary = require("cloudinary").v2;
const fs = require("fs");

if (process.env.CLOUDINARY_URL) {
  const urlParams = process.env.CLOUDINARY_URL.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
  if (urlParams) {
    cloudinary.config({
      api_key: urlParams[1],
      api_secret: urlParams[2],
      cloud_name: urlParams[3],
    });
  }
}
const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }

  try {
    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "ecommerce_store", // Optional: organizes files in a folder on Cloudinary
    });

    // Delete the local file after successful upload to save space
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: result.secure_url, // Return the Cloudinary secure URL
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    
    // Attempt to delete local file if Cloudinary upload fails
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      message: "Failed to upload image to Cloudinary", 
      error: error.message 
    });
  }
};

module.exports = {
  uploadImage,
};
