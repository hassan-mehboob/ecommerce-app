import express from "express"
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} from "../controllers/productController.js"
import { isAuthenticatedUser } from "../middleware/auth.js"
const router = express.Router()

router.route("/products").get(getAllProducts)
router.route("/product/new").post(isAuthenticatedUser, createProduct)

router
  .route("/product/:id")
  .put(isAuthenticatedUser, updateProduct)
  .delete(isAuthenticatedUser, deleteProduct)
  .get(getProductDetails)

export default router
