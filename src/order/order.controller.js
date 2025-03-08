import Order from "./order.model.js";
import Cart from "../cart/cart.model.js";
import Product from "../product/product.model.js";
import Invoice from "../invoice/invoice.model.js";

export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId }).populate("products.product");

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ success: false, msg: "Cart is empty" });
        }

        let totalPrice = 0;

        for (const item of cart.products) {
            const product = await Product.findById(item.product._id);
            if (!product) {
                return res.status(404).json({ success: false, msg: "Product not found" });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ success: false, msg: `Not enough stock for ${product.name}` });
            }
            totalPrice += product.price * item.quantity;
        }

        const newOrder = new Order({
            user: userId,
            products: cart.products.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            })),
            totalPrice
        });

        await newOrder.save();

        for (const item of cart.products) {
            await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
        }

        cart.products = [];
        await cart.save();

        const newInvoice = new Invoice({
            user: userId,
            order: newOrder._id,
            totalPrice: newOrder.totalPrice
        });

        await newInvoice.save();

        res.status(201).json({
            success: true,
            msg: "Order created successfully",
            order: newOrder,
            invoice: newInvoice 
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Error creating order", error });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId }).populate("products.product", "name price");

        if (orders.length === 0) {
            return res.status(404).json({ success: false, msg: "No orders found" });
        }

        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Error fetching orders", error });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email").populate("products.product", "name price");

        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Error fetching all orders", error });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!["PENDING", "SHIPPED", "DELIVERED", "CANCELLED", "COMPLETED"].includes(status)) {
            return res.status(400).json({ success: false, msg: "Invalid status" });
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ success: false, msg: "Order not found" });
        }

        res.json({ success: true, msg: "Order status updated", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Error updating order status", error });
    }
};

export const getUserOrderHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId })
            .populate("products.product", "name price")
            .sort({ createdAt: -1 });

        if (orders.length === 0) {
            return res.status(404).json({ success: false, msg: "No orders found" });
        }

        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Error fetching order history", error });
    }
};

