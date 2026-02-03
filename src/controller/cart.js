
import Cart from "../models/cart.js";

//////////////// ADD ITEM TO CART //////////////////
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, name, price, image } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({
        productId,
        name,
        price,
        image,
        quantity: 1
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart
    });
  } catch (err) {
    console.log("Add to cart error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//////////////// GET CART //////////////////
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = { items: [] };
    }

    res.status(200).json({
      success: true,
      cart
    });
  } catch (err) {
    console.log("Get cart error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//////////////// REMOVE ITEM //////////////////
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId !== productId
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed",
      cart
    });
  } catch (err) {
    console.log("Remove cart error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//////////////// UPDATE QUANTITY //////////////////
export const updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find((i) => i.productId === productId);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    item.quantity = quantity;

    await cart.save();

    res.status(200).json({
      success: true,
      cart
    });
  } catch (err) {
    console.log("Update cart error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
