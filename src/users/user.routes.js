import express from "express";
import { getUsers, getUserById, deleteUser, updateUserRole} from "./user.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-role.js";
import { updateUserProfile, getUserProfile } from "./user.controller.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/me", validarJWT, getUserProfile);
router.put("/me", validarJWT, updateUserProfile);
router.get("/:id", getUserById);
router.delete("/", validarJWT, deleteUser);

router.put(
    "/:id/role",
    [validarJWT, tieneRole("ADMIN")],
    updateUserRole
);


export default router;
