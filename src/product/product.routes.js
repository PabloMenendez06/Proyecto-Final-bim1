import { Router } from "express";
import { check } from "express-validator";
import { getProducts, getProductById, createProduct, getTopSellingProducts, searchProducts, updateProduct, deleteProduct, getOutOfStockProducts, getProductsByCategory } from "./product.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-role.js";

const router = Router();


router.get("/", getProducts);


router.get("/best-selling", getTopSellingProducts);


router.get("/out-of-stock", getOutOfStockProducts);


router.get("/category/:category", getProductsByCategory);


router.get("/search", searchProducts);


router.get(
  "/:id",
  [
    check("id", "Invalid product ID").isMongoId(),
    validarCampos,
  ],
  getProductById
);


router.post(
  "/",
  [
    validarJWT,
    tieneRole("ADMIN"),
    check("name", "Product name is required").not().isEmpty(),
    check("price", "Price must be a valid number").isNumeric(),
    check("stock", "Stock must be a number").isNumeric(),
    validarCampos,
  ],
  createProduct
);


router.put(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN"),
    check("id", "Invalid product ID").isMongoId(),
    validarCampos,
  ],
  updateProduct
);


router.delete(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN"),
    check("id", "Invalid product ID").isMongoId(),
    validarCampos,
  ],
  deleteProduct
);

export default router;
