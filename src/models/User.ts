import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/.+\@.+\..+/, "Invalid email format"],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
}, { timestamps: true });

export const User = models.User || model("User", UserSchema);