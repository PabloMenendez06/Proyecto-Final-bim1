import { Schema, model } from "mongoose";

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        maxLength: [70, "Can't exceed 70 characters"],
    },
    description: {
        type: String,
        required: true,
        maxLength: [700, "Can't exceed 700 characters"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be a positive number"],
    },
    stock: {
        type: Number,
        required: [true, "Stock is required"],
        min: [0, "Stock cannot be negative"],
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    sold: {
        type: Number,
        default: 0,
    },
    estado: {
        type: Boolean,
        default: true,  
    },
}, {
    timestamps: true,  
    versionKey: false,  
});


ProductSchema.methods.toJSON = function () {
    const { __v, _id, ...product } = this.toObject();
    product.uid = _id;
    return product;
};

export default model('Product', ProductSchema);
