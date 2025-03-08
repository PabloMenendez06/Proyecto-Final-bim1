import { Router } from "express";
import { getUserInvoices, getInvoiceById, updateInvoice } from "./invoice.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-role.js";

const router = Router();

router.get("/", validarJWT, getUserInvoices);

router.get("/:id", validarJWT, getInvoiceById);

router.put("/:id", [validarJWT, tieneRole("ADMIN")], updateInvoice);

export default router;
