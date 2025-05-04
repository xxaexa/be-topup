import { Schema, model, models } from "mongoose";

const InputFieldSchema = new Schema({
  field_name: { type: String, required: true },
  label: { type: String, required: true },
  required: { type: Boolean, default: true },
}, { _id: false });

const VariantSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
}, { _id: false });

const VoucherSchema = new Schema({
  game_name: { type: String, required: true },
  voucher_name: { type: String, required: true },
  image_url: { type: String },
  description: { type: String },
  input_fields: [InputFieldSchema],
  variants: [VariantSchema],
}, { timestamps: true });

export const Voucher = models.Voucher || model("Voucher", VoucherSchema);
