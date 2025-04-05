import { Types } from "mongoose";

// models 
export interface InputField {
    label: string;
    name: string;
    value: string;
  }
  
  export interface OptionDetail {
    id: string;
    label: string;
    icon: string;
    price: number;
    type: string;
  }
  
  export interface TransactionDocument extends Document {
    voucherId: string;
    gameName: string;
    voucherImage: string;
    inputs: InputField[];
    selectedOption: OptionDetail;
    status: "pending" | "success" | "failed";
    createdAt: Date;
    updatedAt: Date;
  }


  export interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
  }



  
export interface JwtPayload {
    userId: string;
}