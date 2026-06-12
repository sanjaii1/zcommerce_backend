const Address = require("../models/Address");

// Add a new address
const addAddress = async (req, res) => {
  try {
    const address = new Address({
      ...req.body,
      userId: req.user.id, // Attach logged in user
    });
    const savedAddress = await address.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all addresses for a user
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an address
const updateAddress = async (req, res) => {
  try {
    // Ensure the address belongs to the logged-in user
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!address) {
      return res.status(404).json({ message: "Address not found or unauthorized" });
    }
    
    res.json(address);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an address
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found or unauthorized" });
    }

    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
};
