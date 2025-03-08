import { Router } from "express";
import { check } from "express-validator";
import { 
    createOrder, 
    getUserOrders, 
    getAllOrders, 
    updateOrderStatus 
} from "./order.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-role.js";
import { getUserOrderHistory } from "./order.controller.js";

const router = Router();

router.post("/", validarJWT, createOrder);

router.get("/", validarJWT, getUserOrders);

router.get("/all", validarJWT, tieneRole("ADMIN"), getAllOrders);

router.put(
    "/:orderId",
    [
        validarJWT,
        tieneRole("ADMIN"),
        check("orderId", "Invalid order ID").isMongoId(),
        check("status", "Status is required").not().isEmpty(),
        validarCampos
    ],
    updateOrderStatus
);
router.get("/history", validarJWT, getUserOrderHistory);


export default router;
