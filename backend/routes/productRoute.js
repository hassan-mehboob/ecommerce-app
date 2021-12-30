import express from "express"
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} from "../controllers/productController.js"
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js"
const router = express.Router()

router.route("/products").get(getAllProducts)
router
  .route("/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct)

router
  .route("/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
  .get(getProductDetails)

export default router
