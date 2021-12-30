import express from "express"
import error from "./middleware/error.js"
import product from "./routes/productRoute.js"
import user from "./routes/userRoute.js"
import cookieParser from "cookie-parser"
const app = express()
app.use(express.json())
app.use(cookieParser())
// Router Imports

app.use("/api/v1", product)
app.use("/api/v1", user)
//middleware for Errors
app.use(error)
export default app
