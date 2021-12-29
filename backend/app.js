import express from "express"
import error from "./middleware/error.js"
const app = express()
app.use(express.json())
// Router Imports
import product from "./routes/productRoute.js"

app.use("/api/v1", product)

//middleware for Errors
app.use(error)
export default app
