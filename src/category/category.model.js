import { Schema, model } from "mongoose";

const CategorySchema = Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        unique: true,
        maxLength: [70, "Can't exceed 70 characters"],
    },
    estado: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true, 
    versionKey: false,
});


CategorySchema.methods.toJSON = function () {
    const { __v, _id, ...category } = this.toObject();
    category.uid = _id;
    return category;
};

export default model('Category', CategorySchema);
