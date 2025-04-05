import express from "express";
import {
  getVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
} from "../controllers/voucherController";

const router = express.Router();

router.get("/", getVouchers);
router.get("/:id", getVoucherById);
router.post("/", createVoucher);
router.put("/:id", updateVoucher);
router.delete("/:id", deleteVoucher);

export default router;
