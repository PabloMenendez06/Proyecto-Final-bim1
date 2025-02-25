import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        trim: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Category", CategorySchema);
