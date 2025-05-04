import { Request, Response } from "express";
import { Summary } from "../models/Summary";

export const getDashboardSummary = async (_req: Request, res: Response) => {
  try {
    const totalTransactions = await Summary.countDocuments({ type: "transaction" });
    const totalVouchers = await Summary.countDocuments({ type: "voucher" });

    const totalPriceAgg = await Summary.aggregate([
      { $match: { type: "transaction" } },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$variant_price" },
        },
      },
    ]);

    const totalPrice = totalPriceAgg[0]?.totalPrice || 0;

    res.json({
      total_transactions: totalTransactions,
      total_price: totalPrice,
      total_vouchers: totalVouchers,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
