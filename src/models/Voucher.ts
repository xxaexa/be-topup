import mongoose from "mongoose";

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

const voucherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String },
  inputs: [inputSchema],
  variants: [variantSchema],
});

const Voucher = mongoose.model("Voucher", voucherSchema);

export default Voucher;
