import { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema({
  buyer_name: { type: String, required: true },
  buyer_email: { type: String, required: true },
  voucher_id: { type: Schema.Types.ObjectId, ref: "Voucher", required: true },
  voucher_name: { type: String, required: true },
  variant: {
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  buyer_inputs: {
    type: Map,
    of: String,
    required: true,
  },
  payment_status: {
    type: String,
    enum: ["pending", "paid", "failed", "expired"],
    default: "pending",
  },
  delivery_status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  },
}, { timestamps: true });

export const Transaction = models.Transaction || model("Transaction", TransactionSchema);