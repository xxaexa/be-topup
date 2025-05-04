import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoute";
import voucherRoute from "./routes/voucherRoute";
import transactionRoute from "./routes/transactionRoute"
import summaryRoute from './routes/summaryRoute'

dotenv.config();

const app = express();
const port = process.env.PORT 

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true, 
}));

app.use(express.json());
app.use(cookieParser());

connectDB();

app.get("/", (req, res) => {
    res.send({ message: "Server Connected" });
  });
  
app.use("/api/auth", authRoutes);
app.use("/api/voucher", voucherRoute);
app.use("/api/transaction",transactionRoute)
app.use("/api/summary",summaryRoute)



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
