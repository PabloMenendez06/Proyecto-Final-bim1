import { Router } from "express";
import { check } from "express-validator";
import { 
    getCart, 
    addToCart, 
    updateCart, 
    removeFromCart, 
    clearCart 
} from "./cart.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();


router.get("/", validarJWT, getCart);


router.post(
    "/",
    [
        validarJWT,
        check("productId", "Invalid product ID").isMongoId(),
        check("quantity", "Quantity must be at least 1").isInt({ min: 1 }),
        validarCampos,
    ],
    addToCart
);


router.put(
    "/",
    [
        validarJWT,
        check("productId", "Invalid product ID").isMongoId(),
        check("quantity", "Quantity must be at least 1").isInt({ min: 1 }),
        validarCampos,
    ],
    updateCart
);


router.delete(
    "/:productId",
    [
        validarJWT,
        check("productId", "Invalid product ID").isMongoId(),
        validarCampos,
    ],
    removeFromCart
);


router.delete("/", validarJWT, clearCart);

export default router;
