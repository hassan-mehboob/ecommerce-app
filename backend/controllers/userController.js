import ErrorHandler from "../utils/errorHandler.js"
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js"
import User from "../models/userModel.js"
import sendToken from "../utils/jwtToken.js"
import sendEmail from "../utils/sendEmail.js"
import crypto from "crypto"
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
//Logout User
export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  })
})

//Forgot Password
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new ErrorHandler("User not found", 404))
  }

  //Get Reset Password Token
  const resetToken = user.getResetPasswordToken()
  await user.save({ validateBeforeSave: false })

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl}\n\nIf you have not requested this email then ,please ignore it`

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    })

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    })
  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })

    return next(new ErrorHandler(error.message, 500))
  }
})

//Reset Password
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  //creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is Invalid or has been expired",
        400
      )
    )
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesn't match", 400))
  }

  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()
  sendToken(user, 200, res)
})
