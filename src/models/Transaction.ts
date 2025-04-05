import mongoose, { Document, Schema } from "mongoose";

const inputSchema = new mongoose.Schema({
  label: { type: String, required: true },
  name: { type: String, required: true },
});

const variantSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  icon: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, enum: ["normal", "package"], required: true },
});

const transactionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    inputs: [inputSchema],
    variants: [variantSchema],
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
