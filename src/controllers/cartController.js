const Cart = require("../models/Cart");

// Get user cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
    if (!cart) {
      cart = { userId: req.user.id, items: [] };
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, variantId, quantity } = req.body;
    
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId: req.user.id,
        items: [{ productId, variantId, quantity: quantity || 1 }],
      });
    } else {
      // Check if item already exists in cart
      const itemIndex = cart.items.findIndex((item) => {
        // Compare both productId and variantId
        const isSameProduct = item.productId.toString() === productId;
        const isSameVariant = variantId ? item.variantId?.toString() === variantId : true;
        return isSameProduct && isSameVariant;
      });

      if (itemIndex > -1) {
        // Item exists, update quantity
        cart.items[itemIndex].quantity += quantity || 1;
      } else {
        // Item doesn't exist, add it
        cart.items.push({ productId, variantId, quantity: quantity || 1 });
      }
    }

    await cart.save();
    
    // Populate product details before sending response
    await cart.populate("items.productId");
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    // You can also pass productId from req.query if clients prefer sending it in URL string
    const { productId, variantId } = req.body; 
    
    const cart = await Cart.findOne({ userId: req.user.id });
    
    if (cart) {
      cart.items = cart.items.filter((item) => {
        const isSameProduct = item.productId.toString() === productId;
        const isSameVariant = variantId ? item.variantId?.toString() === variantId : true;
        
        // Return true to KEEP the item (so we invert the match to remove)
        return !(isSameProduct && isSameVariant);
      });

      await cart.save();
      await cart.populate("items.productId");
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
};
