import Cart from "./cart.model.js";
import Product from "../product/product.model.js";


export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ user: userId }).populate("products.product", "name price");

        if (!cart) {
            return res.status(404).json({ success: false, msg: "Cart not found" });
        }

        res.json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Error fetching cart", error });
    }
};


export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            console.log("Product not found in the database");
            return res.status(404).json({ success: false, msg: "Product not found" });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            console.log("The user does not have a cart, creating a new one...");
            cart = new Cart({ user: userId, products: [] });
        }

        const existingProduct = cart.products.find(item => item.product.toString() === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();

        res.status(200).json({ success: true, msg: "Product added to cart", cart });
    } catch (error) {
        console.error("Error en addToCart:", error);
        res.status(500).json({ success: false, msg: "Error adding product to cart", error });
    }
};


export const updateCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ success: false, msg: "Cart not found" });
        }

        const productInCart = cart.products.find(item => item.product.toString() === productId);
        if (!productInCart) {
            return res.status(404).json({ success: false, msg: "Product not found in cart" });
        }

        productInCart.quantity = quantity;
        await cart.save();
        res.json({ success: true, msg: "Cart updated", cart });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Error updating cart", error });
    }
};


export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ success: false, msg: "Cart not found" });
        }

        cart.products = cart.products.filter(item => item.product.toString() !== productId);
        await cart.save();

        res.json({ success: true, msg: "Product removed from cart", cart });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Error removing product from cart", error });
    }
};


export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ success: false, msg: "Cart not found" });
        }

        cart.products = [];
        await cart.save();

        res.json({ success: true, msg: "Cart cleared", cart });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Error clearing cart", error });
    }
};
