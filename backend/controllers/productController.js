import Product from "../models/productModel.js"

//create Product --Admin
export const createProduct = async (req, res, next) => {
  const product = await Product.create(req.body)
  res.status(201).json({
    success: true,
    product,
  })
}

//Get all Products
export const getAllProducts = async (req, res) => {
  const products = await Product.find()
  res.status(200).json({
    success: true,
    products,
  })
}
//Get Product Details
export const getProductDetails = async (req, res, next) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product Not found",
    })
  }
  await product.remove()
  res.status(200).json({
    success: true,
    product,
  })
}

//Update Product --Admin
export const updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id)

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    })
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
}

//Delete Product --Admin
export const deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product Not found",
    })
  }
  await product.remove()
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  })
}
