// models/Summary.ts
import { Schema, model, models, Document } from "mongoose";

export interface ISummary extends Document {
  type: "transaction" | "voucher";
  game_name: string;
  voucher_name: string;
  variant_price?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const SummarySchema = new Schema<ISummary>(
  {
    type: {
      type: String,
      enum: ["transaction", "voucher"],
      required: true,
    },
    game_name: { type: String, required: true },
    voucher_name: { type: String, required: true },
    variant_price: { type: Number },
  },
  { timestamps: true }
);

export const Summary = models.Summary || model("Summary", SummarySchema);
