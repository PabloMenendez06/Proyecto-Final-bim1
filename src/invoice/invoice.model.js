import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: [true, "Order ID is required"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"]
    },
    totalPrice: {
        type: Number,
        required: [true, "Total price is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Invoice", InvoiceSchema);
