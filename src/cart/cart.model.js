import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"]
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Product ID is required"]
            },
            quantity: {
                type: Number,
                required: [true, "Product quantity is required"],
                min: [1, "Quantity must be at least 1"]
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Cart", CartSchema);
