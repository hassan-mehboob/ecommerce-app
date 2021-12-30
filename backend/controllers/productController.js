import Product from "../models/productModel.js"
import ErrorHandler from "../utils/errorHandler.js"
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js"
import ApiFeatures from "../utils/apiFeatures.js"

//create Product --Admin
export const createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id

  const product = await Product.create(req.body)

  res.status(201).json({
    success: true,
    product,
  })
})

//Get all Products
export const getAllProducts = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 5
  const productCount = await Product.countDocuments()

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage)

  const products = await apiFeature.query
  res.status(200).json({
    success: true,
    products,
    productCount,
  })
})
//Get Product Details
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    return next(new ErrorHandler("Product Not found", 404))
  }

  res.status(200).json({
    success: true,
    product,
  })
})

//Update Product --Admin
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id)

  if (!product) {
    return next(new ErrorHandler("Product Not found", 404))
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    rueValidators: true,
    useFindAndModify: false,
  })
  res.status(200).json({
    success: true,
    product,
  })
})

//Delete Product --Admin
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    return next(new ErrorHandler("Product Not found", 404))
  }
  await product.remove()
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  })
})
