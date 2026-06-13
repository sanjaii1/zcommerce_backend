require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecommerce");
    
    // Check if an admin already exists
    const adminExists = await User.findOne({ email: "admin@ecommerce.com" });
    
    if (adminExists) {
      console.log("Admin user already exists. You can log in with admin@ecommerce.com");
      process.exit();
    }

    // Create the admin user
    // The password hashing is automatically handled by the pre("save") hook in User model
    const adminUser = new User({
      name: "Super Admin",
      email: "admin@ecommerce.com",
      password: "adminpassword123",
      role: "admin"
    });

    await adminUser.save();
    
    console.log("=========================================");
    console.log("Admin user created successfully!");
    console.log("Email: admin@ecommerce.com");
    console.log("Password: adminpassword123");
    console.log("=========================================");
    
    process.exit();
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
