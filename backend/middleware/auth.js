import ErrorHandler from "../utils/errorHandler.js"
import { catchAsyncErrors } from "./catchAsyncErrors.js"
import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies
  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource", 401))
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET)

  req.user = await User.findById(decodedData.id)
  next()
})
