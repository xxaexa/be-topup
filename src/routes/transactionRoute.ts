import express from "express";
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransactionStatus,
  deleteTransaction,
} from "../controllers/transactionController";
import { authenticateToken } from "../middleware/JwtMiddleware";
const router = express.Router();

// router.use(authenticateToken); 

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/:id", getTransactionById);
router.put("/:id", updateTransactionStatus);
router.delete("/:id", deleteTransaction);

export default router;
