import ErrorHandler from "../utils/errorHandler.js"
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js"
import User from "../models/userModel.js"
import sendToken from "../utils/jwtToken.js"

//Register a user
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is a sample",
      url: "profilePicUrl",
    },
  })
  sendToken(user, 201, res)
})
//Login User
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body

  //checking if user  has given password and email both
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Your Email and Password", 400))
  }

  const user = await User.findOne({ email }).select("+password")
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401))
  }

  const isPasswordMatched = user.comparePassword(password)

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401))
  }
  sendToken(user, 200, res)
})
