import express from "express";
import cors from "cors"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())

//Routes import
import userRouter from "./routes/user.routes.js"
import adminRouter from "./routes/admin.routes.js"
import formRouter from "./routes/form.routes.js"
import responseRouter from "./routes/response.routes.js"
import { authenticateUser } from "./middleware/auth.middleware.js";
import { listAllForms } from "./controllers/form.controller.js";

//Routes Declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/admin/forms", formRouter)
app.use("/api/v1/admin/forms", authenticateUser ,listAllForms)
app.use("/api/v1/forms/response", responseRouter)

export { app }