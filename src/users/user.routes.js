import express from "express";
import { getUsers, getUserById, updateUser, deleteUser, updateUserRole} from "./user.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-role.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/", validarJWT, deleteUser);

router.put(
    "/:id/role",
    [validarJWT, tieneRole("ADMIN")],
    updateUserRole
);


export default router;
