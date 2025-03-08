import Invoice from "./invoice.model.js";
import Order from "../order/order.model.js";
import Product from "../product/product.model.js";

export const getUserInvoices = async (req, res) => {
    try {
        const userId = req.user.id;
        const invoices = await Invoice.find({ user: userId })
            .populate({
                path: "order",
                populate: {
                    path: "products.product",
                    select: "name price"
                }
            });

        if (invoices.length === 0) {
            return res.status(404).json({ success: false, msg: "No invoices found" });
        }

        res.json({ success: true, invoices });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Error fetching invoices", error });
    }
};

export const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findById(id)
            .populate({
                path: "order",
                populate: {
                    path: "products.product",
                    select: "name price"
                }
            });

        if (!invoice) {
            return res.status(404).json({ success: false, msg: "Invoice not found" });
        }

        if (req.user.role !== "ADMIN" && invoice.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, msg: "Access denied" });
        }

        res.json({ success: true, invoice });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Error fetching invoice", error });
    }
};

export const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { products } = req.body;

        const invoice = await Invoice.findById(id).populate("order");
        if (!invoice) {
            return res.status(404).json({ success: false, msg: "Invoice not found" });
        }

        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ success: false, msg: `Product not found: ${item.product}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ success: false, msg: `Not enough stock for ${product.name}` });
            }
        }

        invoice.order.products = products;
        await invoice.save();

        res.json({ success: true, msg: "Invoice updated successfully", invoice });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Error updating invoice", error });
    }
};
